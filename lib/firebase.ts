import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDaJS4kA__wXwe4QYlvYxzhWd1bUJQKXbI",
  authDomain: "alliance-engineers.firebaseapp.com",
  projectId: "alliance-engineers",
  storageBucket: "alliance-engineers.firebasestorage.app",
  messagingSenderId: "641692277727",
  appId: "1:641692277727:web:5fee572189dbdc5725c26a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
