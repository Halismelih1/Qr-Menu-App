

import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { app } from './firebaseConfig';
import Welcome from './Components/Welcome';
import Menu from './Components/Menu';
import Login from './Components/Login';

// Firebase Firestore koleksiyon referansı
import { getFirestore, collection, query, where } from 'firebase/firestore';

const firestore = getFirestore(app);
const menuRef = collection(firestore, 'Menu');

const App = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryItems, setCategoryItems] = useState([]);
  const [currentView, setCurrentView] = useState('welcome');
  const [isAdminClicked, setIsAdminClicked] = useState(false);


  // useCollectionData hook'u ile kategorileri çekme
  const [categoriesData, loadingCategories, errorCategories] = useCollectionData(
    menuRef,
    { idField: 'id' }
  );

  useEffect(() => {
    if (categoriesData) {
      // Veritabanındaki tüm kategorileri al
      const uniqueCategories = [...new Set(categoriesData.map(item => item.category))];
      setCategories(uniqueCategories);
    }
  }, [categoriesData]);

  // useCollectionData hook'u ile veriyi çekme
  const [data, loadingData, errorData] = useCollectionData(
    selectedCategory
      ? query(menuRef, where('category', '==', selectedCategory))
      : menuRef,
    { idField: 'id' }
  );

  useEffect(() => {
    if (data) {
      setCategoryItems(data);
    }
  }, [data]);

  useEffect(() => {
    if (errorCategories || errorData) {
      console.error('Veri çekme hatası:', errorCategories || errorData);
    }
  }, [errorCategories, errorData]);

 
  const handleAdminClick = () => {
    setIsAdminClicked(true);
    setCurrentView('login');
  };
  const handleMenuButtonClick = () => {
    setCurrentView('menu');
  };

  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      
      {currentView === 'welcome' && (
        <Welcome onMenuButtonClick={handleMenuButtonClick}
        handleAdminClick={handleAdminClick} />
      )}
      {currentView === 'menu' && (
        <Menu menuItems={categoryItems} categories={categories} />    
      )}
      
      {isAdminClicked && <Login />}

    </div>
  );
};

export default App;
