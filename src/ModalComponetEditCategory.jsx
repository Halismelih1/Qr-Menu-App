// ModalComponentEditCategory.js

import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const ModalComponentEditCategory = ({ isOpen, onClose, onSave,editingCategory  }) => {
  const [newCategoryName, setNewCategoryName] = useState('');


  const handleSave = () => {
    onSave(newCategoryName);
    onClose();
  };

  useEffect(() => {
    // Set the initial value of newCategoryName when the modal is opened
    if (isOpen) {
      setNewCategoryName(editingCategory); // Eğer editingCategory varsa set et
    }
  }, [isOpen, editingCategory]);

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '40%', // Modal genişliği
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
      style={customStyles}
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Edit Category Modal"
    >
      <div style={{ textAlign: 'center' }}>
        <h2>Edit Category</h2>
        <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
          <label style={{ display: 'block', margin: '10px 0' }}>New Category Name:</label>
          <input
            style={{
              padding: '8px',
              borderRadius: '10px',
              border: '2px solid #3498db',
              marginBottom: '20px',
              width: '100%',
              boxSizing: 'border-box',
              outline: 'none',
            }}
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
        </div>
        <button
          style={{
            padding: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#3498db',
            color: '#fff',
            marginRight: '10px',
          }}
          onClick={handleSave}
        >
          Save
        </button>
        <button
          style={{
            padding: '10px',
            cursor: 'pointer',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#ccc',
            color: '#000',
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ModalComponentEditCategory;