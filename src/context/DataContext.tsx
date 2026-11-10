import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
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
  saveSiteSettings: (settings: SiteSettings) => Promise<void>;
  submitLead: (leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<string>;
  updateLeadStatus: (leadId: string, status: Lead['status'], notes?: string) => Promise<void>;
  seedInitialDataToFirestore: () => Promise<void>;
  isFirebaseConnected: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

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

  // 1. Subscribe to properties (Real-time)
  useEffect(() => {
    const propertiesCol = collection(db, 'properties');
    const q = query(propertiesCol, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: Property[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Property, 'id'>) });
          });
          setProperties(loaded);
        } else {
          // If Firestore collection is empty, retain verified initial items
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

  // 2. Subscribe to siteSettings (Real-time)
  useEffect(() => {
    const settingsDoc = doc(db, 'siteSettings', 'global');

    const unsubscribe = onSnapshot(
      settingsDoc,
      (snapshot) => {
        if (snapshot.exists()) {
          setSiteSettings(snapshot.data() as SiteSettings);
        } else {
          setSiteSettings(INITIAL_SITE_SETTINGS);
        }
        setLoadingSettings(false);
      },
      (error) => {
        console.warn('Real-time settings listener notice:', error.message);
        setLoadingSettings(false);
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
          const loaded: LandingPage[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<LandingPage, 'id'>) });
          });
          setLandingPages(loaded);
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

  // 4. Subscribe to leads (Real-time, when admin)
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
        // Sort newest first
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
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    try {
      await setDoc(doc(db, 'leads', leadId), cleanLead);
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
      await updateDoc(leadRef, updates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leads/${leadId}`);
    }
  };

  // Save / Update Property (Admin)
  const saveProperty = async (property: Property): Promise<void> => {
    const propId = property.id || `prop-${Date.now()}`;
    const cleanProp: Property = {
      ...property,
      id: propId,
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'properties', propId), cleanProp);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `properties/${propId}`);
    }
  };

  // Delete Property (Admin)
  const deleteProperty = async (propertyId: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'properties', propertyId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `properties/${propertyId}`);
    }
  };

  // Save Site Settings (Admin)
  const saveSiteSettings = async (settings: SiteSettings): Promise<void> => {
    const updated = {
      ...settings,
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'siteSettings', 'global'), updated);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'siteSettings/global');
    }
  };

  // 1-Click Initial Data Seeding to Firestore
  const seedInitialDataToFirestore = async (): Promise<void> => {
    try {
      // 1. Seed properties
      for (const prop of INITIAL_PROPERTIES) {
        await setDoc(doc(db, 'properties', prop.id), prop);
      }
      // 2. Seed siteSettings
      await setDoc(doc(db, 'siteSettings', 'global'), INITIAL_SITE_SETTINGS);
      // 3. Seed landingPages
      for (const lp of INITIAL_LANDING_PAGES) {
        await setDoc(doc(db, 'landingPages', lp.id), lp);
      }
      console.log('Dados iniciais provisionados no Firestore com sucesso.');
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
        saveSiteSettings,
        submitLead,
        updateLeadStatus,
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
