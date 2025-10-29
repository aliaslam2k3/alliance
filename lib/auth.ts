import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'customer';
  createdAt: any;
  isTestUser?: boolean;
}

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user role from Firestore
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data() as UserData;
      return { user, userData };
    } else {
      throw new Error('User data not found');
    }
  } catch (error) {
    throw error;
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  firstName: string, 
  lastName: string,
  phone: string,
  role: 'admin' | 'customer' = 'customer'
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update user profile
    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`
    });
    
    // Save to Firestore
    const userDocRef = doc(db, 'users', user.uid);
    await setDoc(userDocRef, {
      firstName,
      lastName,
      email,
      phone,
      role,
      createdAt: serverTimestamp(),
    });
    
    return { user, userData: { firstName, lastName, email, phone, role } };
  } catch (error) {
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};
