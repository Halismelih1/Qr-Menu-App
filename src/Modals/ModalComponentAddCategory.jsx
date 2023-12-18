import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { UploadOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ModalComponentAddCategory = ({ isOpen, onClose, onSave }) => {

  const [categoryName, setCategoryName] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);



  const handleSave = async () => {
    if (!categoryName.trim() || !name.trim() || !price.trim() || !imageFile) {
      message.warning('Lütfen tüm zorunlu alanları doldurunuz.',2);
      return;
    }

    // Firebase Storage resim yükleme
    const storageRef = ref(storage, `images/${imageFile.uid}${imageFile.name}`);
    await uploadBytes(storageRef, imageFile);

    // image URL Alma
    const downloadURL = await getDownloadURL(storageRef);

    onSave({
      category: categoryName.toLowerCase(),
      name: name,
      price: price,
      description: description,
      picture: downloadURL,
    });

    // değerleri temizle
    setCategoryName('');
    setName('');
    setPrice('');
    setDescription('');
    setImageFile(null);

    onClose();
  };

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.warning('Lütfen geçerli bir resim dosyası seçin (jpg, jpeg, png).',2);
        return false;
      }

      setImageFile(file);
      return false; 
    },
  };

  const handleImageUpload = async (file, onSuccess) => {
    if (!file) {
      onSuccess(new Error('Dosya bilgisi bulunamadı.'));
      return;
    }

    try {
      const storageRef = ref(storage, `images/${file.name}`);

      // Doğrudan download URL alma
      await getDownloadURL(storageRef);

      onSuccess(); // Başarılı yükleme durumu
    } catch (error) {
      onSuccess(error); // Yükleme hatası durumu
      message.error('Dosya yükleme hatası lütfen tekrar deneyin');
    }
  };



  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      title="Kategori Ekleme"
      footer={null}
      style={{textAlign:"center"}}
    >
      <div style={{ marginBottom: '10px' }}>
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder='Kategori İsmi'
        />
      </div>
      <h3 className='mt-6 text-center font-bold'>{<ArrowDownOutlined />} Kategoriniz İçin Ürün Oluşturun {<ArrowDownOutlined />}</h3>
      <hr /> <br />
  
      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginRight: '10px' }}>Resim :</label>
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
          placeholder='Ürün İsmi'
        />
      </div>
  
      <div style={{ marginBottom: '10px' }}>
        <Input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder='Ürün Fiyatı'
        />
      </div>
  
      <div style={{ marginBottom: '10px' }}>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
