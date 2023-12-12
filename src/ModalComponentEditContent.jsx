import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

const ModalComponentEditContent = ({ isOpen, onClose, onSave, content }) => {
  if (!content) {
    console.error('Content is null or undefined.');
    return null;
  }

  const [newName, setNewName] = useState(content.name || '');
  const [newPrice, setNewPrice] = useState(content.price || '');
  const [newDescription, setNewDescription] = useState(content.description || '');

  const handleSave = () => {
    onSave({
      id: content.id,
      name: newName,
      price: newPrice,
      description: newDescription,
    });
    onClose();
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '60%', // Modal genişliği
      padding: '20px', // İçerik iç boşluğu
      borderRadius: '8px', // Köşe yuvarlaklığı
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', // Gölge
    },
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Arkaplanı bulanık yapar
    },
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