import React, { useState } from 'react';
import Modal from 'react-modal';

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
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customStyles}
      contentLabel="Edit Content Modal"
    >
      <h2 style={{ fontSize: '24px', color: '#333', marginBottom: '20px' }}>Edit Content</h2>

      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '2px' }}>Name:</label>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
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
          value={newPrice}
          onChange={(e) => setNewPrice(e.target.value)}
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
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
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
          onClick={handleSave}
        >
          Save
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

export default ModalComponentEditContent;