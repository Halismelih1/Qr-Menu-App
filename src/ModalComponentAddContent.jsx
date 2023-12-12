import React, { useState } from 'react';
import { Modal, Input, Button } from 'antd';


const ModalComponentAddContent = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleAdd = () => {
    const newContent = {
      name,
      price,
      description: description || undefined,
    };

    onAdd(newContent);
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      centered
      footer={null}
    >
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Add Content</h2>

        <Input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginBottom: '10px' }}
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
          <Button
            type="primary"
            style={{ background:"green", marginRight: '10px' }}
            onClick={handleAdd}
          >
            Add
          </Button>
          <Button
            danger
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponentAddContent;