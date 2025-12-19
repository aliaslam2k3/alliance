import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Project, Quote } from './types';

// Project CRUD Operations

export const getAllProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw error;
  }
};

export const getPortfolioProjects = async (): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, 'projects');
    // Try with orderBy first, if it fails (no index), fall back to just where
    try {
      const q = query(
        projectsRef,
        where('isPortfolio', '==', true),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
    } catch (orderError: any) {
      // If orderBy fails (likely missing index), fetch all and filter/sort in memory
      if (orderError.code === 'failed-precondition') {
        const q = query(projectsRef, where('isPortfolio', '==', true));
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        // Sort by createdAt in memory
        return projects.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
          const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
          return bTime - aTime;
        });
      }
      throw orderError;
    }
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    throw error;
  }
};

export const getCustomerProjects = async (userId: string): Promise<Project[]> => {
  try {
    const projectsRef = collection(db, 'projects');
    // Prefer ordered query, fall back if index missing
    try {
      const q = query(
        projectsRef,
        where('customerId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Project[];
    } catch (orderError: any) {
      if (orderError.code === 'failed-precondition') {
        const q = query(projectsRef, where('customerId', '==', userId));
        const querySnapshot = await getDocs(q);
        const projects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Project[];
        return projects.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
          const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
          return bTime - aTime;
        });
      }
      throw orderError;
    }
  } catch (error) {
    console.error('Error fetching customer projects:', error);
    throw error;
  }
};

export const getProjectById = async (id: string): Promise<Project | null> => {
  try {
    const projectRef = doc(db, 'projects', id);
    const projectSnap = await getDoc(projectRef);
    
    if (projectSnap.exists()) {
      return {
        id: projectSnap.id,
        ...projectSnap.data(),
      } as Project;
    }
    return null;
  } catch (error) {
    console.error('Error fetching project:', error);
    throw error;
  }
};

export const createProject = async (data: Partial<Project>, createdBy: string): Promise<string> => {
  try {
    const projectsRef = collection(db, 'projects');
    const projectData = {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy,
    };
    const docRef = await addDoc(projectsRef, projectData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const updateProject = async (id: string, data: Partial<Project>): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', id);
    await updateDoc(projectRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating project:', error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const projectRef = doc(db, 'projects', id);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

// Quote Operations

export const getQuotes = async (status?: string): Promise<Quote[]> => {
  try {
    const quotesRef = collection(db, 'quotes');
    let q;
    
    if (status) {
      q = query(
        quotesRef,
        where('status', '==', status),
        orderBy('createdAt', 'desc')
      );
    } else {
      q = query(quotesRef, orderBy('createdAt', 'desc'));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Quote[];
  } catch (error) {
    console.error('Error fetching quotes:', error);
    throw error;
  }
};

export const updateQuoteStatus = async (
  id: string,
  status: Quote['status'],
  adminNotes?: string
): Promise<void> => {
  try {
    const quoteRef = doc(db, 'quotes', id);
    const updateData: any = { status };
    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }
    await updateDoc(quoteRef, updateData);
  } catch (error) {
    console.error('Error updating quote status:', error);
    throw error;
  }
};

export const convertQuoteToProject = async (
  quoteId: string,
  projectData: Partial<Project>,
  createdBy: string
): Promise<string> => {
  try {
    // Create the project
    const projectId = await createProject(projectData, createdBy);
    
    // Update the quote to mark it as converted
    await updateQuoteStatus(quoteId, 'converted');
    const quoteRef = doc(db, 'quotes', quoteId);
    await updateDoc(quoteRef, { projectId });
    
    return projectId;
  } catch (error) {
    console.error('Error converting quote to project:', error);
    throw error;
  }
};

// Quotes for a specific user (customer dashboard)
export const getUserQuotes = async (userId: string): Promise<Quote[]> => {
  try {
    const quotesRef = collection(db, 'quotes');
    try {
      const q = query(
        quotesRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Quote[];
    } catch (orderError: any) {
      if (orderError.code === 'failed-precondition') {
        const q = query(quotesRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        const quotes = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Quote[];
        return quotes.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.()?.getTime() || 0;
          const bTime = b.createdAt?.toDate?.()?.getTime() || 0;
          return bTime - aTime;
        });
      }
      throw orderError;
    }
  } catch (error) {
    console.error('Error fetching user quotes:', error);
    throw error;
  }
};

