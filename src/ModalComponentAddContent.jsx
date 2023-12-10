import React, { useState } from 'react';
import Modal from 'react-modal';

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
      isOpen={isOpen}
      onRequestClose={onClose}
      style={{
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
      }}
      contentLabel="Add Content Modal"
    >
      <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Add Content</h2>

      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '2px' }}>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            padding: '5px',
            borderRadius: '10px',
            border: '2px solid #3498db',
            marginBottom: '10px',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '2px' }}>Price:</label>
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{
            padding: '5px',
            borderRadius: '10px',
            border: '2px solid #3498db',
            marginBottom: '10px',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '2px' }}>Description:</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{
            padding: '5px',
            borderRadius: '10px',
            border: '2px solid #3498db',
            marginBottom: '10px',
            outline: 'none',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          style={{
            padding: '5px 10px',
            marginRight: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3498db',
            color: '#fff',
          }}
          onClick={handleAdd}
        >
          Add
        </button>
        <button
          style={{
            padding: '5px 10px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#e74c3c',
            color: '#fff',
          }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ModalComponentAddContent;
