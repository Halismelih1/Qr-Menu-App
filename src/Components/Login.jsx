import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Form, Input, Button,message} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const Login = () => {

  const [user, setUser] = useState(null);

  const navigate = useNavigate();


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (values) => {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      navigate('/admin');
      message.success('Giriş Başarılı',2)
    } catch (error) {
      message.error('Giriş Bilgilerinizi Kontrol Edin',2);
    }
  };
  useEffect(() => {
    //eğer giriş yapılmışsa admine yönlendir
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200" style={{
      backgroundImage: `url(/assets/loginbg.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'}}>
      <div className="bg-white p-8 rounded-md shadow-md md:w-96 w-full m-4 ">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Admin Giriş Ekranı</h2>
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
  <Button
    style={{
      background: 'linear-gradient(45deg, #FE6B1B 60%, #FF8E53 10%)',
      color: 'white',
      border: 'none',
    }}
    type="primary"
    htmlType="submit"
    className="w-full"
  >
    Giriş Yap
  </Button>
</Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;