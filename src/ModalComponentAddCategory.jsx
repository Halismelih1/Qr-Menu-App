import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';

const ModalComponentAddContent = ({ isOpen, onClose, onSave }) => {
  const [categoryName, setCategoryName] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = () => {
    if (!categoryName.trim() || !name.trim() || !price.trim()) {
      console.error('Geçersiz bilgi girişi.');
      return;
    }

    onSave({
      category: categoryName.toLowerCase(),
      name: name,
      price: price,
      description: description,
    });

    // Temizleme işlemleri
    setCategoryName('');
    setName('');
    setPrice('');
    setDescription('');

    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      title="Add Content"
      footer={null}
    >
      <div style={{ marginBottom: '10px' }}>
        <label>Category Name:</label>
        <Input
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Name:</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Price:</label>
        <Input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Description:</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
      </div>

      <Button
        type="primary"
        style={{ marginRight: '10px' }}
        onClick={handleSave}
      >
        Save
      </Button>

      <Button
        danger
        onClick={onClose}
      >
        Close
      </Button>
    </Modal>
  );
};

export default ModalComponentAddContent;
