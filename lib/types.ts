export interface Project {
  id: string;
  title: string;
  description: string;
  category: string; // Commercial, Industrial, Residential, etc.
  location: string;
  area: string;
  completionDate?: any; // Firestore timestamp
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number; // 0-100
  image: string; // URL
  images?: string[]; // Array of URLs for gallery
  keyFeatures?: string[];
  technicalSpecs?: string[];
  capacity?: string;
  isPortfolio: boolean; // true for public portfolio items, false for customer-specific
  customerId?: string | null; // null for portfolio, userId for customer projects
  customerName?: string;
  createdAt: any; // Firestore timestamp
  updatedAt: any; // Firestore timestamp
  createdBy: string; // admin userId
  currentPhase?: string; // description of current work
  nextPhase?: string; // description of upcoming work
  estimatedCompletion?: any; // Firestore timestamp
}

export interface Quote {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  projectType: string;
  timeline: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  userId?: string | null;
  createdAt: any; // Firestore timestamp
  source: string; // homepage, contact, etc.
  adminNotes?: string;
  projectId?: string; // if converted to project
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  area: string;
  completionDate?: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  progress: number;
  image: string;
  images?: string[];
  keyFeatures?: string[];
  technicalSpecs?: string[];
  capacity?: string;
  isPortfolio: boolean;
  customerId?: string | null;
  customerName?: string;
  currentPhase?: string;
  nextPhase?: string;
  estimatedCompletion?: string;
}

