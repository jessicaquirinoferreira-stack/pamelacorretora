import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  getDocs,
  getDoc,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Property, Lead, SiteSettings, LandingPage } from '../types';
import {
  INITIAL_PROPERTIES,
  INITIAL_SITE_SETTINGS,
  INITIAL_LANDING_PAGES,
} from '../data/initialData';
import { useAuth } from './AuthContext';

interface DataContextType {
  properties: Property[];
  siteSettings: SiteSettings;
  landingPages: LandingPage[];
  leads: Lead[];
  loadingProperties: boolean;
  loadingSettings: boolean;
  loadingLeads: boolean;
  saveProperty: (property: Property) => Promise<void>;
  deleteProperty: (propertyId: string) => Promise<void>;
  saveLandingPage: (landingPage: LandingPage) => Promise<void>;
  deleteLandingPage: (landingPageId: string) => Promise<void>;
  saveSiteSettings: (settings: SiteSettings) => Promise<void>;
  submitLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  updateLeadStatus: (leadId: string, status: Lead['status'], notes?: string) => Promise<void>;
  deleteLead: (leadId: string) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
  isFirebaseConnected: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

function stripUndefined<T extends Record<string, any>>(obj: T): T {
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value;
    }
  }
  return cleaned as T;
}

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin } = useAuth();
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [landingPages, setLandingPages] = useState<LandingPage[]>(INITIAL_LANDING_PAGES);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingProperties, setLoadingProperties] = useState<boolean>(true);
  const [loadingSettings, setLoadingSettings] = useState<boolean>(true);
  const [loadingLeads, setLoadingLeads] = useState<boolean>(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);
  const isDbInitializedRef = useRef<boolean>(false);
  const bootstrapAttemptedRef = useRef<boolean>(false);

  // 1. Subscribe to siteSettings (Real-time, also tracks whether DB was initialized)
  useEffect(() => {
    const settingsDoc = doc(db, 'siteSettings', 'global');

    const unsubscribe = onSnapshot(
      settingsDoc,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data() as SiteSettings;
          if (data.initialized) {
            isDbInitializedRef.current = true;
          }
          setSiteSettings({ ...INITIAL_SITE_SETTINGS, ...data });
        } else {
          setSiteSettings(INITIAL_SITE_SETTINGS);
        }
        setIsFirebaseConnected(true);
        setLoadingSettings(false);
      },
      (error) => {
        console.warn('Real-time settings listener notice:', error.message);
        setLoadingSettings(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Subscribe to properties (Real-time)
  useEffect(() => {
    const propertiesCol = collection(db, 'properties');
    const q = query(propertiesCol, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          isDbInitializedRef.current = true;
          const loaded: Property[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Property, 'id'>) });
          });
          setProperties(loaded);
        } else if (isDbInitializedRef.current) {
          // Database was already initialized and admin intentionally cleared items
          setProperties([]);
        } else {
          setProperties(INITIAL_PROPERTIES);
        }
        setLoadingProperties(false);
      },
      (error) => {
        console.warn('Real-time properties listener notice:', error.message);
        setLoadingProperties(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 3. Subscribe to landingPages (Real-time)
  useEffect(() => {
    const lpCol = collection(db, 'landingPages');
    const unsubscribe = onSnapshot(
      lpCol,
      (snapshot) => {
        if (!snapshot.empty) {
          isDbInitializedRef.current = true;
          const loaded: LandingPage[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<LandingPage, 'id'>) });
          });
          loaded.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
          setLandingPages(loaded);
        } else if (isDbInitializedRef.current) {
          setLandingPages([]);
        } else {
          setLandingPages(INITIAL_LANDING_PAGES);
        }
      },
      (error) => {
        console.warn('Landing pages listener notice:', error.message);
      }
    );

    return () => unsubscribe();
  }, []);

  // 4. Auto-bootstrap initial records into Firestore on first Admin session so edits/deletions persist permanently
  useEffect(() => {
    if (!isAdmin || bootstrapAttemptedRef.current) return;
    bootstrapAttemptedRef.current = true;

    const ensureInitialPersisted = async () => {
      try {
        const [settingsSnap, propsSnap, lpsSnap] = await Promise.all([
          getDoc(doc(db, 'siteSettings', 'global')),
          getDocs(collection(db, 'properties')),
          getDocs(collection(db, 'landingPages')),
        ]);

        const alreadyInitialized = settingsSnap.exists() && Boolean((settingsSnap.data() as SiteSettings).initialized);

        if (!alreadyInitialized) {
          if (propsSnap.empty) {
            for (const prop of INITIAL_PROPERTIES) {
              await setDoc(doc(db, 'properties', prop.id), stripUndefined(prop));
            }
          }
          if (lpsSnap.empty) {
            for (const lp of INITIAL_LANDING_PAGES) {
              await setDoc(doc(db, 'landingPages', lp.id), stripUndefined(lp));
            }
          }
          const baseSettings = settingsSnap.exists()
            ? { ...INITIAL_SITE_SETTINGS, ...(settingsSnap.data() as SiteSettings), initialized: true }
            : { ...INITIAL_SITE_SETTINGS, initialized: true };
          await setDoc(doc(db, 'siteSettings', 'global'), stripUndefined(baseSettings));
          isDbInitializedRef.current = true;
        } else {
          isDbInitializedRef.current = true;
        }
      } catch (err) {
        console.warn('Bootstrap Firestore check notice:', err);
      }
    };

    ensureInitialPersisted();
  }, [isAdmin]);

  // 5. Subscribe to leads (Real-time, when admin)
  useEffect(() => {
    if (!isAdmin) {
      setLeads([]);
      setLoadingLeads(false);
      return;
    }

    setLoadingLeads(true);
    const leadsCol = collection(db, 'leads');
    const unsubscribe = onSnapshot(
      leadsCol,
      (snapshot) => {
        const loaded: Lead[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Lead, 'id'>) });
        });
        loaded.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLeads(loaded);
        setLoadingLeads(false);
      },
      (error) => {
        console.error('Leads listener error:', error);
        setLoadingLeads(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Helper ensuring DB is marked initialized on any admin write
  const markDbInitialized = async () => {
    if (isDbInitializedRef.current) return;
    isDbInitializedRef.current = true;
    await setDoc(
      doc(db, 'siteSettings', 'global'),
      stripUndefined({ ...siteSettings, initialized: true, updatedAt: new Date().toISOString() })
    );
  };

  // Submit Lead to Firestore
  const submitLead = async (
    leadInput: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>
  ): Promise<string> => {
    const leadId = `lead-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowIso = new Date().toISOString();

    const cleanLead: Lead = {
      id: leadId,
      name: leadInput.name.trim(),
      phone: leadInput.phone.trim(),
      email: leadInput.email?.trim() || '',
      propertyId: leadInput.propertyId || '',
      propertyTitle: leadInput.propertyTitle || '',
      message: leadInput.message?.trim() || '',
      preferredContactTime: leadInput.preferredContactTime || 'Qualquer horário',
      suggestedDate: leadInput.suggestedDate || '',
      suggestedTime: leadInput.suggestedTime || '',
      status: 'new',
      notes: '',
      sourceUrl: window.location.href,
      utmSource: leadInput.utmSource || '',
      utmMedium: leadInput.utmMedium || '',
      utmCampaign: leadInput.utmCampaign || '',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    try {
      await setDoc(doc(db, 'leads', leadId), stripUndefined(cleanLead));
      return leadId;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `leads/${leadId}`);
    }
  };

  // Update lead status (Admin)
  const updateLeadStatus = async (
    leadId: string,
    status: Lead['status'],
    notes?: string
  ): Promise<void> => {
    try {
      const leadRef = doc(db, 'leads', leadId);
      const updates: Partial<Lead> = {
        status,
        updatedAt: new Date().toISOString(),
      };
      if (notes !== undefined) {
        updates.notes = notes;
      }
      await updateDoc(leadRef, stripUndefined(updates));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
    }
  };

  // Delete lead (Admin)
  const deleteLead = async (leadId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'leads', leadId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `leads/${leadId}`);
    }
  };

  // Save / Update Property (Admin)
  const saveProperty = async (property: Property): Promise<void> => {
    const propId = property.id || `prop-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const cleanProp: Property = stripUndefined({
      ...property,
      id: propId,
      slug:
        property.slug ||
        property.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      gallery: Array.isArray(property.gallery) ? property.gallery : [],
      videos: Array.isArray(property.videos) ? property.videos : [],
      features: Array.isArray(property.features) ? property.features : [],
      createdAt: property.createdAt || nowIso,
      updatedAt: nowIso,
    });

    try {
      await markDbInitialized();
      await setDoc(doc(db, 'properties', propId), cleanProp);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `properties/${propId}`);
    }
  };

  // Delete Property (Admin)
  const deleteProperty = async (propertyId: string): Promise<void> => {
    try {
      await markDbInitialized();
      await deleteDoc(doc(db, 'properties', propertyId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `properties/${propertyId}`);
    }
  };

  // Save / Update Landing Page (Admin)
  const saveLandingPage = async (landingPage: LandingPage): Promise<void> => {
    const lpId = landingPage.id || `lp-${Date.now()}`;
    const nowIso = new Date().toISOString();
    const cleanLp: LandingPage = stripUndefined({
      ...landingPage,
      id: lpId,
      slug:
        landingPage.slug ||
        landingPage.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-'),
      features: Array.isArray(landingPage.features) ? landingPage.features : [],
      gallery: Array.isArray(landingPage.gallery) ? landingPage.gallery : [],
      createdAt: landingPage.createdAt || nowIso,
      updatedAt: nowIso,
    });

    try {
      await markDbInitialized();
      await setDoc(doc(db, 'landingPages', lpId), cleanLp);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `landingPages/${lpId}`);
    }
  };

  // Delete Landing Page (Admin)
  const deleteLandingPage = async (landingPageId: string): Promise<void> => {
    try {
      await markDbInitialized();
      await deleteDoc(doc(db, 'landingPages', landingPageId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `landingPages/${landingPageId}`);
    }
  };

  // Save Site Settings (Admin)
  const saveSiteSettings = async (settings: SiteSettings): Promise<void> => {
    const updated = stripUndefined({
      ...settings,
      initialized: true,
      updatedAt: new Date().toISOString(),
    });
    try {
      isDbInitializedRef.current = true;
      await setDoc(doc(db, 'siteSettings', 'global'), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'siteSettings/global');
    }
  };

  // 1-Click Initial Data Seeding to Firestore
  const seedInitialDataToFirestore = async (): Promise<void> => {
    try {
      for (const prop of INITIAL_PROPERTIES) {
        await setDoc(doc(db, 'properties', prop.id), stripUndefined(prop));
      }
      await setDoc(
        doc(db, 'siteSettings', 'global'),
        stripUndefined({ ...INITIAL_SITE_SETTINGS, initialized: true, updatedAt: new Date().toISOString() })
      );
      for (const lp of INITIAL_LANDING_PAGES) {
        await setDoc(doc(db, 'landingPages', lp.id), stripUndefined(lp));
      }
      isDbInitializedRef.current = true;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'seedInitialData');
    }
  };

  return (
    <DataContext.Provider
      value={{
        properties,
        siteSettings,
        landingPages,
        leads,
        loadingProperties,
        loadingSettings,
        loadingLeads,
        saveProperty,
        deleteProperty,
        saveLandingPage,
        deleteLandingPage,
        saveSiteSettings,
        submitLead,
        updateLeadStatus,
        deleteLead,
        seedInitialDataToFirestore,
        isFirebaseConnected,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
