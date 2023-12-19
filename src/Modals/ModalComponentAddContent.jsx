import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { UploadOutlined,ArrowRightOutlined } from '@ant-design/icons';
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const ModalComponentAddContent = ({ isOpen, onClose, onAdd, selectedCategory }) => {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);



  const handleChange = (info) => {
    if (!info.file || !info.file.type.startsWith('image/')) {
      message.warning('Sadece resim dosyalarını yükleyebilirsiniz.', 2);
      setFile(null);
      return;
    }

    setFile(info.file);
  };

  const handleAdd = async () => {
    if (!name.trim() || !price.trim() || !file) {
      message.warning('Lütfen tüm zorunlu alanları doldurunuz.', 2);
      return;
    }

    try {
      // Dosya adını belirleme
      const storageRef = ref(storage, `images/${file.name}`);

      // Dosyayı Firebase Storage'a yükleme
      await uploadBytes(storageRef, file);

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
      setFile(null);

      // Modal'ı kapat
      onClose();
    } catch (error) {
      message.error('Dosya yükleme hatası, lütfen tekrar deneyin', 2);
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

  const handleCancel = () => {
    // State değerlerini sıfırla
    setName('');
    setPrice('');
    setDescription('');
    setFile(null);

    // Modal'ı kapat
    onClose();
  };


  return (
    <Modal visible={isOpen} onCancel={handleCancel} centered footer={null}>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>
          Ekle <ArrowRightOutlined /> "{selectedCategory}"
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginBottom: '10px' }}>
          <Upload
            showUploadList={false}
            beforeUpload={(file) => {
              handleChange({ file });
              return false;
            }}
          >
            {file ? (
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <img src={URL.createObjectURL(file)} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100px', marginRight: '10px' }} />
                <Button
                  type="dashed"
                  style={{ background: 'rgba(255,255,255,0.7)' }}
                  icon={<UploadOutlined />}
                >
                  Resim Seç
                </Button>
              </div>
            ) : (
              <Button icon={<UploadOutlined />}>Resim Seç</Button>
            )}
          </Upload>

          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginBottom: '10px', marginTop: '10px' }}
          />
        </div>

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
          <Button danger onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponentAddContent;
