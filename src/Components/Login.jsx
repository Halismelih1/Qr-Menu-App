import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged,getAuth } from 'firebase/auth';




const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    // Firebase Authentication'da oturum durumu değiştiğinde çalışacak olan fonksiyon
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Component unmount olduğunda listener'ı temizle
    return () => unsubscribe();
  }, []);



  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Giriş başarılı:", userCredential);
  
      // Kullanıcının oturum açık olup olmadığını kontrol et
      const user = getAuth().currentUser;
      console.log("Current User:", user);
  
      if (user) {
        // Oturum açık ise /admin sayfasına yönlendir
        console.log("Yönlendirme yapılıyor...");
        navigate('/admin');
        
      } else {
        console.error("Kullanıcı oturum açık değil.");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-2 w-full border-b border-gray-300 placeholder-gray-500 focus:outline-none"
              placeholder="E-posta adresiniz"
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 w-full border-b border-gray-300 placeholder-gray-500 focus:outline-none"
              placeholder="Şifreniz"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;