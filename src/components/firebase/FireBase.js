// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore, collection } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyCW4Kc-KUYRg4-iRNTT8x0gf2zK7WMp140",
  authDomain: "filmyverse-1501a.firebaseapp.com",
  projectId: "filmyverse-1501a",
  storageBucket: "filmyverse-1501a.appspot.com",
  messagingSenderId: "929424392071",
  appId: "1:929424392071:web:3e016e11e9740ed5629d22"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);
export const moviesRef=collection(db,"movies");
export const reviewsRef=collection(db,"reviews");
export default app;