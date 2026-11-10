export type TransactionType = 'sale' | 'rent';
export type PropertyType = 'apartment' | 'house' | 'penthouse' | 'land' | 'commercial';
export type PropertyStatus = 'draft' | 'published' | 'archived';

export interface Property {
  id: string;
  title: string;
  slug: string;
  code?: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  price: number;
  condominiumName: string;
  region: string;
  areaM2?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  halfBaths?: number;
  parkingSpots?: number;
  storageUnit?: boolean;
  furnished?: boolean;
  gourmetBalcony?: boolean;
  expandedLivingRoom?: boolean;
  description: string;
  features: string[];
  coverImage: string;
  gallery: string[];
  status: PropertyStatus;
  featured: boolean;
  pendingConfirmation: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type LeadStatus =
  | 'new'
  | 'in_progress'
  | 'visit_requested'
  | 'visit_confirmed'
  | 'pending_reply'
  | 'proposal_active'
  | 'converted'
  | 'closed';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  propertyId?: string;
  propertyTitle?: string;
  message?: string;
  preferredContactTime?: string;
  suggestedDate?: string;
  suggestedTime?: string;
  status: LeadStatus;
  notes?: string;
  sourceUrl?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  professionalName: string;
  logoUrl?: string;
  bioTagline: string;
  bioDescription: string;
  region: string;
  instagramHandle: string;
  facebookName: string;
  whatsappNumber: string;
  contactPhone: string;
  contactEmail: string;
  creciNumber: string;
  officeAddress: string;
  heroHeadline: string;
  heroSubheadline: string;
  legalDisclaimers: string;
  updatedAt: string;
}

export interface LandingPage {
  id: string;
  slug: string;
  title: string;
  headline: string;
  subheadline: string;
  propertyId: string;
  coverImage: string;
  features: string[];
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}
