import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged,getAuth } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Input, Button, notification } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


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



  const handleSubmit = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate('/admin');
    } catch (error) {
      console.error('Giriş hatası:', error);
      toast.warning('Giriş Bilgilerinizi Kontrol Edin');
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
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Giriş Ekranı</h2>
        <Form name="login-form" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="E-posta adresiniz" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Şifreniz" />
          </Form.Item>
          <Form.Item>
            <Button style={{ backgroundColor: 'white', color: 'black' }} type="primary" htmlType="submit" className="w-full">
              Giriş Yap
            </Button>
          </Form.Item>
        </Form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;