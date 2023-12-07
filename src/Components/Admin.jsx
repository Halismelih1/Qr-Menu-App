import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
  const [adminData, setAdminData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);  // Yeni state ekledik



  
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Çıkış başarılı.');
      toast.success('Çıkış başarılı.');
      navigate('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      toast.error('Çıkış yapılırken bir hata oluştu.');
    }
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesCollection = collection(db, 'Menu');
        const categoriesSnapshot = await getDocs(categoriesCollection);

        const uniqueCategories = [...new Set(categoriesSnapshot.docs.map(doc => doc.data().category))];
        setCategories(uniqueCategories);

        const data = {};
        for (const category of uniqueCategories) {
          const categoryCollection = collection(db, 'Menu');
          const categoryQuery = query(categoryCollection, where('category', '==', category));
          const categorySnapshot = await getDocs(categoryQuery);
          data[category] = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
        setAdminData(data);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
        toast.error('Veri çekme işlemi başarısız oldu.');
      }
    };

    // Veri çekme işlemini başlatma
    fetchData();
  }, []);




  const handleCategoryClick = async (category) => {
    try {
      setSelectedCategory(category);
      const categoryCollection = collection(db, 'Menu');
      const categoryQuery = query(categoryCollection, where('category', '==', category));
      const categorySnapshot = await getDocs(categoryQuery);
      const categoryData = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdminData(categoryData);
    } catch (error) {
      // ...
      setAdminData([]); // Hata durumunda adminData'ya geçerli bir dizi atıyoruz
    }
  };




  return (
    <div className="container mx-auto mt-8 p-4 ">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, Admin!</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
        >
          Sign Out
        </button>
      </header>

      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Array.isArray(adminData) ? adminData : []).map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-600">${item.price}</p>
            {item.description && <p className="text-gray-600 mt-2">{item.description}</p>}
            {item.picture && (
              <img src={item.picture} alt={item.name} className="mt-4 mx-auto w-48 h-48 object-cover" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;