// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

console.log(process.env.REACT_APP_FIREBASE_API_KEY);

const firebaseConfig = {
    REACT_APP_FIREBASE_API_KEY=AIzaSyD28PhP0uc7DMXW-8oTQh43KyH77WCo7PE
    REACT_APP_FIREBASE_AUTH_DOMAIN=fir-db-6ccaf.firebaseapp.com
    REACT_APP_FIREBASE_PROJECT_ID=fir-db-6ccaf
    REACT_APP_FIREBASE_STORAGE_BUCKET=fir-db-6ccaf.appspot.com
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID=703615629491
    REACT_APP_FIREBASE_APP_ID=1:703615629491:web:f43bdcf523a542deb6d8c6
};
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore();
