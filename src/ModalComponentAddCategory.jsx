import React, { useState } from 'react';
import Modal from 'react-modal';

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
      contentLabel="Add Content Modal"
      style={customStyles}
    >
      <h2>Add Content</h2>
      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
        <label>Category Name:</label>
        <input
          type="text"
          value={categoryName}
          style={{
            padding: '5px',
            borderRadius: '10px',
            border: '2px solid #3498db',
            marginBottom: '10px',
            outline: 'none',
          }}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          style={{
            padding: '5px',
            borderRadius: '10px',
            border: '2px solid #3498db',
            marginBottom: '10px',
            outline: 'none',
          }}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
        <label>Price:</label>
        <input
          type="text"
          value={price}
          style={{
            padding: '5px',
            borderRadius: '10px',
            border: '2px solid #3498db',
            marginBottom: '10px',
            outline: 'none',
          }}
          onChange={(e) => setPrice(e.target.value)}
        />
      </div>
      <div style={{ marginBottom: '10px', display: 'flex', flexDirection: 'column' }}>
        <label>Description:</label>
        <input
          type="text"
          value={description}
          style={{
            padding: '5px',
            borderRadius: '10px',
            border: '2px solid #3498db',
            marginBottom: '10px',
            outline: 'none',
          }}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

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
        Close
      </button>
    </Modal>
  );
};

export default ModalComponentAddContent;
