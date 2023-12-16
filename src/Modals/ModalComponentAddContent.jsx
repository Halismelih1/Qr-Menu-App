import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { UploadOutlined,ArrowRightOutlined } from '@ant-design/icons';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ModalComponentAddContent = ({ isOpen, onClose, onAdd,selectedCategory  }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [fileList, setFileList] = useState([]);

 

  const handleChange = ({ fileList }) => {
    // Dosya seçilmediyse işlemi iptal et
    if (!fileList || fileList.length === 0) {
      return;
    }
    setFileList(fileList);
  };

  const handleAdd = async () => {
    if (!name.trim() || !price.trim()) {
      toast.info('Lütfen Tüm Zorunlu Alanları Doldurunuz !', {
        autoClose: 1000,
      });
      return;
    }

    if (fileList.length === 0) {
      message.error('Lütfen bir dosya seçin.');
      return;
    }

    try {
      // Dosya adını belirleme
      const selectedFile = fileList[0].originFileObj;
      const storageRef = ref(storage, `images/${selectedFile.name}`);

      // Dosyayı Firebase Storage'a yükleme
      await uploadBytes(storageRef, selectedFile);

      // Dosyanın URL'sini alma
      const downloadURL = await getDownloadURL(storageRef);

      // İçeriği eklemek için onAdd fonksiyonunu kullanma
      onAdd({
        name: name,
        price: price,
        description: description,
        picture: downloadURL ,
      });

      // State değerlerini sıfırla
      setName('');
      setPrice('');
      setDescription('');
      setFileList([]);

      // Modal'ı kapat
      onClose();
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      message.error('Dosya yükleme hatası: ' + error.message);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      // Dosya seçilmediyse işlemi iptal et
      if (!file) {
        return false;
      }
      setImageFile({ file: file });
      return true;
    },
  };

  const handleImageUpload = async (file, onSuccess) => {
    if (!file) {
      console.error('Dosya bilgisi bulunamadı.');
      onSuccess(new Error('Dosya bilgisi bulunamadı.'));
      return;
    }
  
    try {
      // Storage referansı oluşturun, ancak dosyayı yükleme işlemi için "uploadBytes" kullanmayın
      const storageRef = ref(storage, `images/${file.name}`);
      
      // Doğrudan download URL alın
      const downloadURL = await getDownloadURL(storageRef);
  
      onSuccess(); // Başarılı yükleme olduğunu belirtin
  
      // downloadURL'yi kullanın (örneğin, state'e kaydedin veya üst düzey bileşene gönderin)
      console.log('File download URL:', downloadURL);
    } catch (error) {
      console.error('File upload error:', error);
      onSuccess(error); // Yükleme hatası olduğunu belirtin
      alert('Dosya yükleme hatası: ' + error.message);
    }
  };



  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      centered
      footer={null}
    >
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px', marginTop:'20px' }}>
          Ekle <ArrowRightOutlined /> "{selectedCategory}"
        </h2>

        <Upload
      {...uploadProps}
      customRequest={({ file, onSuccess }) => handleImageUpload(file, onSuccess)}
      onChange={handleChange}  
      >
      <Button style={{marginBottom:"10px"}} icon={<UploadOutlined />}>Resim Seçin</Button>
      </Upload>

        <Input
          placeholder="Ürün İsmi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        <Input
          placeholder="Ürün Fiyatı"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        <Input
          placeholder="İsteğe Bağlı Açıklama Girebilirsiniz"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button
            type="primary"
            style={{ background: 'green', marginRight: '10px' }}
            onClick={handleAdd}
          >
            Ürünü Ekle
          </Button>
          <Button
            danger
            onClick={onClose}
          >
            Vazgeç
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponentAddContent;