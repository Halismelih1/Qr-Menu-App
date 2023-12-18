import { useEffect } from "react";
import React from "react";
import { onAuthStateChanged } from 'firebase/auth';  
import { useNavigate } from "react-router-dom";
import { auth } from './firebaseConfig';  

function PrivateRoute({ element }) {
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        // Eğer kullanıcı yoksa, /login sayfasına yönlendir
        navigate('/login');
      }
    });

    // Temizlik işlemi
    return () => unsubscribe();
  }, [navigate]); 

  return user ? element : null; // Eğer kullanıcı varsa, element'i render et
}

export default PrivateRoute;
