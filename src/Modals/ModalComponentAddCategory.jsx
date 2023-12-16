import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { UploadOutlined,ArrowDownOutlined } from '@ant-design/icons';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { toast } from 'react-toastify';

const ModalComponentAddCategory = ({ isOpen, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState({ id: null, file: null });
  

  const handleSave = async () => {
    if (!categoryName.trim() || !name.trim() || !price.trim() || !imageFile.file) {
      toast.error('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    //Firebase Storage resim yükleme
    const storageRef = ref(storage, `images/${imageFile.id}${imageFile.file.name}`);
    await uploadBytes(storageRef, imageFile.file);

    // image URL Alma
    const downloadURL = await getDownloadURL(storageRef);

    onSave({
      category: categoryName.toLowerCase(),
      name: name,
      price: price,
      description: description,
      picture: downloadURL,
    });

    //değerleri temizle
    setCategoryName('');
    setName('');
    setPrice('');
    setDescription('');
    setImageFile({ id: null, file: null }); // id ve file'ı sıfırla

    onClose();
  };

  const uploadProps = {
    beforeUpload: (file) => {
      setImageFile({ id: Math.random().toString(36).substring(7), file: file }); // id'yi rastgele bir değer olarak atadık
      return false; // false döndürerek antd'nin otomatik yükleme işlemini iptal etme
    },
  };

  const handleImageUpload = async (file, onSuccess) => {
    if (!file) {
      console.error('Dosya bilgisi bulunamadı.');
      onSuccess(new Error('Dosya bilgisi bulunamadı.'));
      return;
    }
  
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      
      // Doğrudan download URL alma
      const downloadURL = await getDownloadURL(storageRef);

      console.log('File download URL:', downloadURL);

  
      onSuccess(); // Başarılı yükleme durumu
  
    } catch (error) {
      console.error('File upload error:', error);
      onSuccess(error); // Yükleme hatası durumu
      alert('Dosya yükleme hatası: ' + error.message);
    }
  };


  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      title="Kategori Ekleme"
      footer={null}
    >
      <div style={{ marginBottom: '10px' }}>
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          style={{ marginBottom: '10px' }}
          placeholder='Kategori İsmi'
        />
      </div>
      <h3>{<ArrowDownOutlined />} Kategoriniz İçin Ürün Oluşturun {<ArrowDownOutlined />}</h3>
      <hr /> <br />
      

      <div style={{ marginBottom: '10px' }}>
        <label className='mr-2'>Dosya:</label>
        <Upload
          {...uploadProps}
          customRequest={({ file, onSuccess }) => handleImageUpload(file, onSuccess)}
        >
          <Button icon={<UploadOutlined />}>Ekleyeceğiniz Ürün İçin Resim seçin</Button>
        </Upload>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px' }}
          placeholder='Ürün İsmi'
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginBottom: '10px' }}
            placeholder='Ürün Fiyatı'
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: '10px' }}
          placeholder='İsteğe Bağlı Açıklama Girebilirsiniz..'
        />
      </div>

      <div style={{ marginBottom: '10px', textAlign: 'center' }}>
      <Button
        type="primary"
        style={{ background: 'green', marginRight: '10px' }}
        onClick={handleSave}
      >
        Kategoriyi Kaydet
      </Button>

      <Button
        danger
        onClick={onClose}
      >
        Vazgeç
      </Button>
    </div>
  </Modal>
);
};

export default ModalComponentAddCategory;
