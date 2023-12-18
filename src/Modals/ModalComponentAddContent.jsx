import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { UploadOutlined,ArrowRightOutlined } from '@ant-design/icons';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ModalComponentAddContent = ({ isOpen, onClose, onAdd, selectedCategory }) => {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [fileList, setFileList] = useState([]);



  const handleChange = ({ fileList }) => {

    if (!fileList || fileList.length === 0) {
      return;
    }
    setFileList(fileList);
  };

  const handleAdd = async () => {
    if (!name.trim() || !price.trim()) {
      message.warning('Lütfen tüm zorunlu alanları doldurunuz.',2);
      return;
    }

    if (fileList.length === 0) {
      message.warning('Lütfen ürününüz için bir resim seçin.',2);
      return;
    }

    const selectedFile = fileList[0].originFileObj;

    try {
      // Doğru dosya türlerini kontrol etme
      const allowedFileTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedFileTypes.includes(selectedFile.type)) {
        message.warning('Sadece PNG ve JPEG formatındaki resim dosyalarını yükleyebilirsiniz.',2);
        return;
      }

      // Dosya adını belirleme
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
        picture: downloadURL,
      });

      // State değerlerini sıfırla
      setName('');
      setPrice('');
      setDescription('');
      setFileList([]);

      // Modal'ı kapat
      onClose();
    } catch (error) {
      message.error('Dosya yükleme hatası lütfen tekrar deneyin',2);
    }
  };

  const uploadProps = {
    beforeUpload: (file) => {
      if (!file) {
        return false;
      }
      setFileList([file]);
      return false; 
    },
  };


  return (
    <Modal visible={isOpen} onCancel={onClose} centered footer={null}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>
          Ekle <ArrowRightOutlined /> "{selectedCategory}"
        </h2>

        <Upload {...uploadProps} onChange={handleChange}>
          <Button icon={<UploadOutlined />}>Resim Seç</Button>
        </Upload>

        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px', marginTop:"10px" }}
        />

        <Input
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        <Input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: '10px' }}
        />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
          <Button type="primary" style={{ background: 'green', marginRight: '10px' }} onClick={handleAdd}>
            Add
          </Button>
          <Button danger onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponentAddContent;
