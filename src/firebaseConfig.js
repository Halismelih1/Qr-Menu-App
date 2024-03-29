import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';



// Unvalid Configs
const firebaseConfig = {
    apiKey: "AIzaSyCTGDGkxEt7LY1PPmZp9oLO72t0OeKKp5g",
    authDomain: "qr-menu-ep.firebaseapp.com",
    projectId: "qr-menu-ep",
    storageBucket: "qr-menu-ep.appspot.com",
    messagingSenderId: "320241078228",
    appId: "1:320241078228:web:446b7baa470a4e80c15041",
    measurementId: "G-TCZJLJ7CCF"
  };

  // Unvalid Configs
   const app = initializeApp(firebaseConfig);
   const storage = getStorage(app);
   const auth = getAuth(app);
   const db = getFirestore(app);




   export { app, storage,auth,db };
