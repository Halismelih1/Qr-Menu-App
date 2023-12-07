import React, { useState } from 'react';
import { auth } from '../firebaseConfig';
import {useNavigate} from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth';



const Login = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase Authentication ile giriş yapma işlemi
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Giriş başarılıysa /admin sayfasına yönlendirme
      navigate('/admin');
    } catch (error) {
      // Hata durumunda hatayı state'e kaydetme
      setError(error.message);
    }
  };


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