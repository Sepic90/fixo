// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Replace with your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZ_DCh5mFRAdrCl6Q2KZmMlgcmlVIhGWI",
  authDomain: "fixo-cc82f.firebaseapp.com",
  projectId: "fixo-cc82f",
  storageBucket: "fixo-cc82f.firebasestorage.app",
  messagingSenderId: "1080756439548",
  appId: "1:1080756439548:web:380eec8134d574d7034a79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };