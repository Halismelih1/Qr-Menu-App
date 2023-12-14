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
    });

    return () => unsubscribe();
  }, []);


  return user ? element : navigate('/login');
  
}

export default PrivateRoute;
