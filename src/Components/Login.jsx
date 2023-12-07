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
    <div className="min-h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
    <div className="bg-white p-8 rounded-md shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              E-posta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="E-posta adresinizi girin"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Şifre
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              placeholder="Şifrenizi girin"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;