import React, { useState, useEffect } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { app } from './firebaseConfig';
import Welcome from './Components/Welcome';
import Menu from './Components/Menu';
import Login from './Components/Login';
import Admin from './Components/Admin';
import PrivateRoute from './PrivateRoute';
import { BrowserRouter as Router, Route, Routes,useNavigate } from "react-router-dom";


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
    
      <Routes>
        <Route path='/' element={<Welcome />} />
        <Route path='/menu' element={<Menu categories={categories} categoryItems={categoryItems} />} />
        <Route path='/login' element={<Login />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute
              element={<Admin />}
            />
          }
        />
      </Routes>
   
  );
};

export default App;