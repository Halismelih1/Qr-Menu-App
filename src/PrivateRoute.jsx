import { useEffect } from "react";
import React from "react";
import { onAuthStateChanged } from 'firebase/auth';  // Eklediğimiz import
import { useNavigate } from "react-router-dom";
import { auth } from './firebaseConfig';  // Eklediğimiz import

function PrivateRoute({ element }) {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();  // Fonksiyonu doğru bir şekilde kullan

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Oturum durumu değişti. Yeni kullanıcı:", user);
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  console.log("PrivateRoute - Current User:", user);

  return user ? element : navigate('/login');  // navigate fonksiyonunu doğru bir şekilde çağır
}

export default PrivateRoute;
