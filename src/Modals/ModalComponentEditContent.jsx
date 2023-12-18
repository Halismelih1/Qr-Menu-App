import React, { useState } from 'react';
import { Modal, Input, Button, Upload, message } from 'antd';
import { UploadOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { storage } from '../firebaseConfig';
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage';

const ModalComponentEditContent = ({ isOpen, onClose, onSave, content }) => {
  if (!content) {
    console.error('Content is null or undefined.');
    return null;
  }

  const [newName, setNewName] = useState(content.name || '');
  const [newPrice, setNewPrice] = useState(content.price || '');
  const [newDescription, setNewDescription] = useState(content.description || '');
  const [newPicture, setNewPicture] = useState(content.picture || '');

  const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

  const beforeUpload = (file) => {
    // Dosya türünü kontrol et
    const isImage = allowedFileTypes.includes(file.type);
    if (!isImage) {
      message.error('Lütfen geçerli bir resim dosyası seçin (jpg, jpeg, png).');
    }
    return isImage;
  };

  const handleImageUpload = async (file, onSuccess) => {
    if (!file) {
      console.error('Dosya bilgisi bulunamadı.');
      onSuccess(new Error('Dosya bilgisi bulunamadı.'));
      return;
    }

    try {
      const storageRef = ref(storage, `images/${file.name}`);

      // Eğer mevcut resim varsa, silme işlemi yapma

      // Yeni dosyayı yükle
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Yükleme ilerleme durumu
        },
        (error) => {
          // Yükleme hatası durumu
          console.error('File upload error:', error);
          onSuccess(error);
          alert('Dosya yükleme hatası: ' + error.message);
        },
        async () => {
          // Yükleme tamamlandığında
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onSuccess();
          setNewPicture(downloadURL);
        }
      );
    } catch (error) {
      console.error('File upload error:', error);
      onSuccess(error); // Yükleme hatası durumu
      alert('Dosya yükleme hatası: ' + error.message);
    }
  };
  const uploadProps = {
    customRequest: ({ file, onSuccess }) => handleImageUpload(file, onSuccess),
    beforeUpload,
    showUploadList: false, // Dosya listesini gizle
  };

  const handleCancel = () => {
    // Eğer kullanıcı işlemi iptal ederse, resmi güncelleme
    setNewPicture(content.picture || '');
    onClose();
  };

  const handleSave = () => {
    // Validation for required fields
    if (!newName.trim() || !newPrice.trim() || !newPicture) {
      message.error('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    onSave({
      id: content.id,
      name: newName,
      price: newPrice,
      description: newDescription,
      picture: newPicture,
    });
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      title="Ürün Düzenleme"
      footer={null}
    >
      <hr /> <br />
      <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
        <label style={{ marginBottom: '2px' }}>Mevcut Resim <ArrowRightOutlined /></label>
        {newPicture && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={newPicture}
              alt="Content"
              style={{ maxWidth: '100px', marginRight: '10px' }}
            />
          </div>
        )}
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Yeni Resim</Button>
        </Upload>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginBottom: '2px' }}>Ürün İsmi:</label>
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginBottom: '2px' }}>Ürün Fiyatı:</label>
        <Input
          type="text"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginBottom: '2px' }}>Açıklama:</label>
        <Input
          type="text"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          type="primary"
          style={{ background: 'green', marginRight: '10px' }}
          onClick={handleSave}
        >
          Güncelle
        </Button>
        <Button
          danger
          onClick={handleCancel}
        >
          Vazgeç
        </Button>
      </div>
    </Modal>
  );
};

export default ModalComponentEditContent;