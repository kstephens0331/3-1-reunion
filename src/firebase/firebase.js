import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Replace these with your own Firebase config values
const firebaseConfig = {
  apiKey: "AIzaSyCRhR0U3__hRoA4OtpPm1piiFPGqpUeTvY",
  authDomain: "reunion-2a307.firebaseapp.com",
  projectId: "reunion-2a307",
   storageBucket: "reunion-2a307.appspot.com",,
  messagingSenderId: "256860236490",
  appId: "1:256860236490:web:18ddc41567f84490d9a233"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };