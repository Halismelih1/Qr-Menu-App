import React, { useEffect, useState } from 'react';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, onAuthStateChanged,sendPasswordResetEmail  } from 'firebase/auth';
import { Form, Input, Button,message, Modal} from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';


const Login = () => {
  const [user, setUser] = useState(null);
  const [resetPassword, setResetPassword] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleResetClick = () => {
    setResetModalVisible(true);
  };

  const handleResetModalOk = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      message.success('Şifre sıfırlama e-postası gönderildi. Lütfen e-postanızı kontrol edin.');
      setResetModalVisible(false);
      setResetEmail('');
    } catch (error) {
      message.error('Şifre sıfırlama işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleResetModalCancel = () => {
    setResetModalVisible(false);
    setResetEmail('');
  };

  const handleSubmit = async (values) => {
    try {
      if (resetPassword) {
        // Şifre sıfırlama işlemi
        handleResetModalOk();
      } else {
        // Giriş işlemi
        await signInWithEmailAndPassword(auth, values.email, values.password);
        navigate('/admin');
        message.loading('Login..');
      }
    } catch (error) {
      message.error('Giriş Bilgilerinizi Kontrol Edin', 1);
    }
  };

  useEffect(() => {
    //eğer giriş yapılmışsa admine yönlendir
    if (user) {
      navigate('/admin', { replace: true });
    }
  }, [user, navigate]);


  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-200 ${resetModalVisible ? 'blur' : ''}`} style={{
      backgroundImage: `url(/assets/loginbg.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
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
                width: '100%',
              }}
              type="primary"
              htmlType="submit"
              className="w-full"
            >
              {resetPassword ? 'Şifreyi Sıfırla' : 'Giriş Yap'}
            </Button>
          </Form.Item>
          {/* Şifre sıfırlama bağlantısını göstermek için buton */}
          {!resetPassword && (
            <Form.Item>
              <Button
                type="link"
                onClick={handleResetClick}
                style={{ textAlign: 'center', width: '100%', marginTop: '8px' }}
              >
                Şifremi Unuttum ?
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>

      {/* Şifre sıfırlama modal */}
      <Modal
  title="Şifrenizi Sıfırlayın"
  open={resetModalVisible}
  onOk={handleResetModalOk}
  onCancel={handleResetModalCancel}
  okText="Şifre Sıfırla"
  cancelText="İptal"
  okButtonProps={{ style: { background: 'linear-gradient(45deg, #FE6B1B 60%, #FF8E53 10%)', color: 'white', border: 'none' } }}
  cancelButtonProps={{ style: { background: '#d3d3d3', color: 'black', border: 'none' } }}
  mask={true} 
>
        <Form.Item
          name="resetEmail"
          rules={[{ required: true, message: 'Lütfen e-posta adresinizi girin!' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="E-posta adresiniz"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
          />
        </Form.Item>
      </Modal>
    </div>
  );
};

export default Login;