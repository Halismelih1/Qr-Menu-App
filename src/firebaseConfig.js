import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';




const firebaseConfig = {
   Secret
  };

   const app = initializeApp(firebaseConfig);
   const storage = getStorage(app);
   const auth = getAuth(app);
   const db = getFirestore(app);




   export { app, storage,auth,db };
