import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDocs, query, updateDoc, where, writeBatch,deleteDoc , addDoc} from 'firebase/firestore';
import { FaEdit,FaTrash  } from 'react-icons/fa';



import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {


  const [adminData, setAdminData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(auth.currentUser); 
  



  const navigate = useNavigate();


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Çıkış başarılı.');
      navigate('/');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      toast.error('Çıkış yapılırken bir hata oluştu.');
    }
  };

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

  useEffect(() => {
    // Sayfa yüklendiğinde içerikleri çekme işlemi
    fetchData();
  }, []);

  const handleCategoryClick = async (category) => {
    try {
      // Eğer zaten seçili kategoriye tıklanırsa, tüm içerikleri kapat
      if (selectedCategory === category) {
        setSelectedCategory(null);
        setAdminData([]); // İçerikleri temizle
      } else {
        // Yeni bir kategoriye tıklanırsa, o kategoriye ait içerikleri göster
        setSelectedCategory(category);
        const categoryCollection = collection(db, 'Menu');
        const categoryQuery = query(categoryCollection, where('category', '==', category));
        const categorySnapshot = await getDocs(categoryQuery);
        const categoryData = categorySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setAdminData(categoryData);
      }
    } catch (error) {
      console.error('Kategoriye tıklama hatası:', error);
      setAdminData([]); // Hata durumunda adminData'ya geçerli bir dizi atıyoruz
    }
  };

  const handleAddCategory = async () => {
    try {
      const categoryName = prompt('Kategori adını girin:');
      if (!categoryName) {
        // Kategori adı girilmemişse veya iptal edilmişse işlemi sonlandır
        return;
      }
  
      const lowercaseCategoryName = categoryName.toLowerCase();
      
      // Aynı isimde bir kategori var mı kontrolü
      const categoryExists = categories.map(c => c.toLowerCase()).includes(lowercaseCategoryName);
      if (categoryExists) {
        // Aynı isimde bir kategori zaten varsa uyarı ver
        alert('Bu isimde bir kategori zaten var. Başka bir isim seçin.');
        return;
      }
  
      // Diğer bilgileri al
      const name = prompt('İçerik adını girin:');
      const price = prompt('Fiyatı girin:');
      const description = prompt('Açıklamayı girin:');
  
      // Zorunlu alan kontrolü
      if (!name || !price) {
        alert('İçerik adı ve fiyat alanları zorunludur. Kategori eklenemedi.');
        return;
      }
  
      // Yeni kategoriyi Firestore'a ekleme
      await addDoc(collection(db, 'Menu'), { category: lowercaseCategoryName, name, price, description });
  
      // Kategorileri tekrar çekme işlemi
      fetchData();
  
      toast.success('Kategori başarıyla eklendi.');
    } catch (error) {
      console.error('Kategori ekleme hatası:', error);
      toast.error('Kategori ekleme işlemi başarısız oldu.');
    }
  };

  const handleDeleteCategory = async (category) => {
    // Kullanıcıya silme işleminden önce bir onay mesajı göster
    const isConfirmed = window.confirm(`"${category}" kategorisini silmek istediğinizden emin misiniz?`);

    if (isConfirmed) {
      try {
        // İlgili kategoriyi ve içerikleri silme işlemi
        const categoryCollection = collection(db, 'Menu');
        const categoryQuery = query(categoryCollection, where('category', '==', category));
        const categorySnapshot = await getDocs(categoryQuery);

        const batch = writeBatch(db);
        categorySnapshot.forEach((categoryDoc) => {
          const docRef = doc(db, 'Menu', categoryDoc.id);
          batch.delete(docRef);
        });

        await batch.commit();

        // Kategorileri ve içerikleri tekrar çekme işlemi
        fetchData();

        toast.success(`"${category}" kategorisi başarıyla silindi.`);
      } catch (error) {
        console.error('Kategori silme hatası:', error);
        toast.error('Kategori silme işlemi başarısız oldu.');
      }
    }
  };

  const handleEditContent = async (content) => {
    try {
      const newName = prompt('Yeni ismi girin:', content.name);
      const newPrice = prompt('Yeni fiyatı girin:', content.price);
      const newDescription = prompt('Yeni açıklamayı girin:', content.description);
  
      // İlgili belgenin referansını alma
      const contentDocRef = doc(db, 'Menu', content.id);
  
      // Belgeyi güncelleme işlemi
      const updateData = {
        name: newName || content.name,
        price: newPrice || content.price,
      };
  
      // Eğer yeni açıklama varsa, onu da güncelleme verisine ekleme
      if (newDescription !== null) {
        updateData.description = newDescription;
      }
  
      await updateDoc(contentDocRef, updateData);
  
      // Verileri tekrar çekme işlemi
      handleCategoryClick(selectedCategory);
  
      toast.success('İçerik başarıyla güncellendi.');
    } catch (error) {
      console.error('İçerik güncelleme hatası:', error);
      toast.error('İçerik güncelleme işlemi başarısız oldu.');
    }
  };

  const handleDeleteContent = async (contentId, contentName) => {
    // Kullanıcıya silme işleminden önce bir onay mesajı göster
    const isConfirmed = window.confirm(`"${contentName}" içeriğini silmek istediğinizden emin misiniz?`);
  
    if (isConfirmed) {
      try {
        // İlgili belgenin referansını alma
        const contentDocRef = doc(db, 'Menu', contentId);
  
        // Belgeyi silme işlemi
        await deleteDoc(contentDocRef);
  
        // Verileri tekrar çekme işlemi
        fetchData();
  
        toast.success('İçerik başarıyla silindi.');
      } catch (error) {
        console.error('İçerik silme hatası:', error);
        toast.error('İçerik silme işlemi başarısız oldu.');
      }
    }
  };

  const handleAddContent = async () => {
    try {
      if (!selectedCategory) {
        // Kullanıcı henüz bir kategori seçmemişse, uyarı ver
        alert('Lütfen bir kategori seçin.');
        return;
      }

      const name = prompt('İçerik adını girin:');
      const price = prompt('Fiyatı girin:');
      const description = prompt('Açıklamayı girin (boş bırakabilirsiniz):');

      // Eğer description boş bırakılmışsa, null yerine undefined olarak set edelim
      const newContent = {
        category: selectedCategory,
        name: name || '',
        price: price || '',
        description: description !== null ? description : undefined,
      };

      // Yeni içeriği Firestore'a ekleyelim
      await addDoc(collection(db, 'Menu'), newContent);

      // Verileri tekrar çekme işlemi
      fetchData();

      toast.success('İçerik başarıyla eklendi.');
    } catch (error) {
      console.error('İçerik ekleme hatası:', error);
      toast.error('İçerik ekleme işlemi başarısız oldu.');
    }
  };

  const handleEditCategory = async (category) => {
    const newCategoryName = prompt('Yeni kategori adını girin:', category);
    if (newCategoryName !== null) {
      try {
        // Kategori adını güncelleme işlemi
        const categoryCollection = collection(db, 'Menu');
        const categoryQuery = query(categoryCollection, where('category', '==', category));
        const categorySnapshot = await getDocs(categoryQuery);
  
        const batch = writeBatch(db);
        categorySnapshot.forEach((categoryDoc) => {
          const docRef = doc(db, 'Menu', categoryDoc.id); 
          batch.update(docRef, { category: newCategoryName });
        });
  
        await batch.commit();
  
        // Kategorileri tekrar çekme işlemi
        fetchData();
        toast.success('Kategori başarıyla güncellendi.');
      } catch (error) {
        console.error('Kategori güncelleme hatası:', error);
        toast.error('Kategori güncelleme işlemi başarısız oldu.');
      }
    }
  };



  return (
    <div className="container mx-auto mt-8 p-4">
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome, Admin!</h1>
         
          <p className="text-sm text-gray-500 "> Admin E-mail: {user.email} | Admin ID: {user.uid} </p>
        
      </div>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded-md mt-4"
        >
          Sign Out
        </button>
      </header>
     

      <div className="flex justify-center space-x-4 mb-8">
        {categories.map((category) => (
          <div key={category} className="flex items-center">
            <button
              onClick={() => handleCategoryClick(category)}
              className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300 mr-2`}
            >
              {category}
            </button>
            <FaEdit onClick={() => handleEditCategory(category)} className="cursor-pointer" />
            <FaTrash onClick={() => handleDeleteCategory(category)} className="cursor-pointer" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Array.isArray(adminData) ? adminData : []).map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-md shadow-md">
            <h2 className="text-lg font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-600">${item.price}</p>
            {item.description && <p className="text-gray-600 mt-2">{item.description}</p>}
            <button
              onClick={handleAddContent}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
                >
               Add
            </button>
            <button
              onClick={() => handleEditContent(item)}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring focus:border-yellow-300 mt-4"
            >
              Edit
            </button>
            <button
                onClick={() => handleDeleteContent(item.id, item.name)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:border-red-300"
              >
                Delete
              </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddCategory}
        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300 absolute bottom-4 right-4"
      >
        Add Category
      </button>
      <ToastContainer />
    </div>
  );
};

export default Admin;