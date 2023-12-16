import React, { useEffect, useState } from 'react';
import { Modal, Input, Button } from 'antd';

const ModalComponentEditCategory = ({ isOpen, onClose, onSave, editingCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleSave = () => {
    onSave(newCategoryName);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setNewCategoryName(editingCategory);
    }
  }, [isOpen, editingCategory]);

  return (
    <Modal
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Vazgeç
        </Button>,
        <Button style={{ backgroundColor: 'green', color: 'black' }} key="update" type="primary" onClick={handleSave}>
          Güncelle
        </Button>,
      ]}
      title="Kategori İsmini Düzenle"
      centered
      destroyOnClose
    >
      <div style={{ marginBottom: '10px' }}>
        <label>Yeni Kategori İsmi:</label>
        <Input
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
      </div>
    </Modal>
  );
};

export default ModalComponentEditCategory;