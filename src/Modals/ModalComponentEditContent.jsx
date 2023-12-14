import React, { useState } from 'react';
import { Modal, Input, Button,Upload } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import { storage } from '../firebaseConfig';
import { ref, getDownloadURL,deleteObject  } from 'firebase/storage';



const ModalComponentEditContent = ({ isOpen, onClose, onSave, content }) => {
  if (!content) {
    console.error('Content is null or undefined.');
    return null;
  }

  const [newName, setNewName] = useState(content.name || '');
  const [newPrice, setNewPrice] = useState(content.price || '');
  const [newDescription, setNewDescription] = useState(content.description || '');
  const [newPicture, setNewPicture] = useState(content.picture || ''); 
  const [imagePath, setImagePath] = useState(content.picture || ''); // Store image path separately



  const handleSave = () => {
    onSave({
      id: content.id,
      name: newName,
      price: newPrice,
      description: newDescription,
      picture: newPicture,
    });
    onClose();
  };

  const handleRemovePicture = async () => {
    if (imagePath) {
      try {
        // Get a reference to the file in storage
        const imageRef = ref(storage, imagePath);

        // Delete the file from storage
        await deleteObject(imageRef);

        // Set the picture state to an empty string
        setNewPicture('');

        console.log('Image successfully deleted from storage.');
      } catch (error) {
        console.error('Error deleting image from storage:', error);
        alert('Resim silme hatası: ' + error.message);
      }
    }
  };


  const uploadProps = {
    customRequest: ({ file, onSuccess }) => handleImageUpload(file, onSuccess),
    showUploadList: false, // Dosya listesini gizle
  };

  const handleImageUpload = async (file, onSuccess) => {
    if (!file) {
      console.error('Dosya bilgisi bulunamadı.');
      onSuccess(new Error('Dosya bilgisi bulunamadı.'));
      return;
    }

    try {
    
      const storageRef = ref(storage, `images/${file.name}`);

      // Doğrudan download URL alın
      const downloadURL = await getDownloadURL(storageRef);

      onSuccess(); // Başarılı yükleme durumu

    
      setNewPicture(downloadURL);
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
      title="Edit Content"
      footer={null}
    >
      <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Edit Content</h2>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginBottom: '2px' }}>Picture:</label>
        {newPicture && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src={newPicture}
              alt="Content"
              style={{ maxWidth: '100px', marginRight: '10px' }}
            />
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={handleRemovePicture}
            >
              Remove Picture
            </Button>
          </div>
        )}
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginBottom: '2px' }}>Name:</label>
        <Input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginBottom: '2px' }}>Price:</label>
        <Input
          type="text"
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ marginBottom: '2px' }}>Description:</label>
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
          style={{background:"green", marginRight: '10px' }}
          onClick={handleSave}
        >
          Güncelle
        </Button>
        <Button
          danger
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
};

export default ModalComponentEditContent;