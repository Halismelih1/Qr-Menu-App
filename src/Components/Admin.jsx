import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDocs, query, updateDoc, where, writeBatch,deleteDoc , addDoc} from 'firebase/firestore';
import { ref,deleteObject  } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import ModalComponentAddCategory from '../Modals/ModalComponentAddCategory';
import ModalComponentEditContent from "../Modals/ModalComponentEditContent";
import ModalComponentAddContent from '../Modals/ModalComponentAddContent';
import ModalComponentEditCategory from '../Modals/ModalComponetEditCategory'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Button, Card,Typography } from 'antd';
import { LogoutOutlined, FileAddOutlined, EditOutlined, DeleteOutlined,PlusCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;
const { Meta } = Card;


const Admin = () => {


  const [adminData, setAdminData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(auth.currentUser); 
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [addCategoryModalIsOpen, setAddCategoryModalIsOpen] = useState(false);
  const [editCategoryModalIsOpen, setEditCategoryModalIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); 
  const [addContentModalIsOpen, setAddContentModalIsOpen] = useState(null); 

  

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

  const handleAddCategory = () => {
    setAddCategoryModalIsOpen(true);
  };

  const handleModalAddCategorySave = async ({ category, name, price, description,picture }) => {
    try {
      if (!category.trim() || !name.trim() || !price.trim()) {
        toast.info('Lütfen Tüm Zorunlu Alanları Doldurunuz !', {
          autoClose: 1000,
        });
        return;
      }

      const categoryExists = categories.map(c => c.toLowerCase()).includes(category.toLowerCase());
      if (categoryExists) {
        // Aynı isimde bir kategori zaten varsa uyarı ver
        toast.info('Lütfen Tüm Zorunlu Alanları Doldurunuz !', {
          autoClose: 1000,
        });
        return;
      }

      // Firestore'a yeni içerik eklemek için addDoc
      await addDoc(collection(db, 'Menu'), {
        category: category.toLowerCase(),
        name: name,
        price: price,
        description: description,
        picture:picture
      });
      

      // Verileri tekrar çekme işlemi
      fetchData();

      toast.success('İçerik başarıyla eklendi.', {
        autoClose: 1000,
      });

      setAddCategoryModalIsOpen(false);
    } catch (error) {
      console.error('İçerik ekleme hatası:', error);
      toast.error('İçerik ekleme işlemi başarısız oldu.');
    }
  };

  const handleModalAddCategoryClose = () => {
    setAddCategoryModalIsOpen(false);
  };
  
  const handleDeleteCategory = async (category) => {
    // Kullanıcıya silme işleminden önce bir onay modalı göster
    confirmAlert({
      title: 'Kategoriyi Sil',
      message: `"${category}" kategorisini silmek istediğinizden emin misiniz?`,
      buttons: [
        {
          label: 'Evet',
          onClick: async () => {
            try {
              // İlgili kategoriyi ve içerikleri silme işlemi
              const categoryCollection = collection(db, 'Menu');
              const categoryQuery = query(categoryCollection, where('category', '==', category));
              const categorySnapshot = await getDocs(categoryQuery);
  
              const batch = writeBatch(db);
  
              categorySnapshot.forEach(async (categoryDoc) => {
                const docRef = doc(db, 'Menu', categoryDoc.id);
                batch.delete(docRef);
  
                const imagePath = categoryDoc.data().picture;
                if (imagePath) {
                  const imageRef = ref(storage, imagePath);
                  try {
                    await deleteObject(imageRef);
                    // Image deleted successfully
                  } catch (error) {
                    console.error('Error deleting image from storage:', error);
                  }
                }
              });
  
              await batch.commit();
  
              // Kategorileri ve içerikleri tekrar çekme işlemi
              fetchData();
  
              toast.success(`"${category}" kategorisi ve ilgili içerikleri başarıyla silindi.`, {
                autoClose: 1000,
              });
  
            } catch (error) {
              console.error('Kategori silme hatası:', error);
              toast.error('Kategori silme işlemi başarısız oldu.');
            }
          },
        },
        {
          label: 'Hayır',
          onClick: () => {
            // Kullanıcı "Hayır" derse bir şey yapmaya gerek yok
          },
        },
      ],
    });
  };

  const handleEditContent = (content) => {
    setEditingContent(content);
    setEditModalIsOpen(true);
  };
  
  const handleModalEditSave = async ({ id, name, price, description, picture }) => {
    try {
      if (!id) {
        console.error('Content ID is undefined.');
        return;
      }
  
      // İlgili belgenin referansını alma
      const contentDocRef = doc(db, 'Menu', id);
  
      // Belgeyi güncelleme işlemi
      const updateData = {
        name,
        price,
        description,
        picture,
      };
  
      // Eğer yeni açıklama varsa, onu da güncelleme verisine ekleme
      if (description !== null) {
        updateData.description = description;
      }
  
      // Eğer yeni picture varsa, onu da güncelleme verisine ekleme
      if (picture !== null) {
        updateData.picture = picture;
      }
  
      await updateDoc(contentDocRef, updateData);
  
      // Verileri tekrar çekme işlemi
      handleCategoryClick(selectedCategory);
  
      toast.success('İçerik başarıyla güncellendi.',{
        autoClose:1000
      });

    } catch (error) {
      console.error('İçerik güncelleme hatası:', error);
      toast.error('İçerik güncelleme işlemi başarısız oldu.');
    } finally {
      setEditModalIsOpen(false);
      setEditingContent(null);
    }
  };

  const handleModalEditClose = () => {
    setEditModalIsOpen(false);
    setEditingContent(null);
  };

  const handleDeleteContent = async (contentId, contentName) => {
    // Kullanıcıya silme işleminden önce bir onay modalı göster
    confirmAlert({
      title: 'İçeriği Sil',
      message: `"${contentName}" içeriğini silmek istediğinizden emin misiniz?`,
      buttons: [
        {
          label: 'Evet',
          onClick: async () => {
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
          },
        },
        {
          label: 'Hayır',
          onClick: () => {
            // Kullanıcı "Hayır" derse bir şey yapmaya gerek yok
          },
        },
      ],
    });
  };

  const handleAddContent = (category) => {
    try {
      if (!category) {
        // Kullanıcı henüz bir kategori seçmemişse, uyarı ver
        alert('Lütfen bir kategori seçin.');
        return;
      }
      setAddContentModalIsOpen(true);
      setSelectedCategory(category);
    } catch (error) {
      console.error('İçerik ekleme hatası:', error);
      toast.error('İçerik ekleme işlemi başarısız oldu.');
    }
  };

  const handleModalAddContentSave = ({ name, price, description, picture }) => {
    try {
      // Yeni içeriği Firestore'a ekleme
      addDoc(collection(db, 'Menu'), {
        category: selectedCategory,
        name: name || '',
        price: price || '',
        description: description || '',
        picture: picture || '',  
      });
  
      // Verileri tekrar çekme işlemi
      fetchData();
  
      toast.success('İçerik başarıyla eklendi.');
      setAddContentModalIsOpen(false);
    } catch (error) {
      console.error('İçerik ekleme hatası:', error);
      toast.error('İçerik ekleme işlemi başarısız oldu.');
    }
  };

  const handleModalAddContentClose = () => {
    setAddContentModalIsOpen(false);
  };

  const handleEditCategory = (category) => {
    setEditCategoryModalIsOpen(true);
    setEditingCategory(category);
  };

  const handleModalEditCategorySave = async (newCategoryName) => {
    try {
      if (!editingCategory || !newCategoryName) {
        console.error('Invalid data for category edit.');
        return;
      }
  
      const categoryCollection = collection(db, 'Menu');
      const categoryQuery = query(categoryCollection, where('category', '==', editingCategory));
      const categorySnapshot = await getDocs(categoryQuery);
  
      const batch = writeBatch(db);
      categorySnapshot.forEach((categoryDoc) => {
        const docRef = doc(db, 'Menu', categoryDoc.id);
        batch.update(docRef, { category: newCategoryName });
      });
  
      await batch.commit();
  
      // Kategorileri tekrar çekme işlemi
      fetchData();

      
  
      toast.success('Category successfully updated.', {
        autoClose: 1000,
      });
    } catch (error) {
      console.error('Category update error:', error);
      toast.error('Category update failed.');
    } finally {
      setEditCategoryModalIsOpen(false);
      setEditingCategory(null);
    }
  };



  return (
    <div className="container min-h-screen overflow-y-hidden mx-auto mt-8 p-4">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold mb-4 mt-8 text-center md:text-left">
            Welcome, {user.email}!
          </h1>
        </div>
        <Button
        onClick={handleAddCategory}
        style={{
          color: 'green',
          fontWeight: 'bold',
          marginBottom:'4px'
        }}
        icon={<FileAddOutlined />}
      >
        Add Category
      </Button>
        <Button
          icon={<LogoutOutlined />}
          onClick={handleSignOut}
          style={{ color: '#FF0000', fontWeight: 'bold' }}
        >
          Çıkış Yap
        </Button>
      </header>
      <div className="mb-8 flex flex-col md:flex-row">
      <div className="md:w-1/4 mb-4 md:mb-0 mr-4">
    {categories.map((category) => (
            <div key={category} className="flex items-center mb-4 m-8 justify-between">
            <Button
          type="primary"
          onClick={() => handleCategoryClick(category)}
          style={{
            width: '120px',
            height: '40px',
            backgroundColor: '#1890ff',
            borderColor: '#1890ff',
            marginRight: '8px',
            borderBottom: '2px solid black'
          }}
        >
          {category}
        </Button>
        <div className="ml-2 flex items-center">
      <span
        className="cursor-pointer text-green-500"
        onClick={() => handleAddContent(category)}
      >
        <PlusCircleOutlined />
      </span>
      <span className="cursor-pointer text-blue-500 ml-2" onClick={() => handleEditCategory(category)}>
        <EditOutlined />
      </span>
      <span className="cursor-pointer text-red-500 ml-2" onClick={() => handleDeleteCategory(category)}>
        <DeleteOutlined />
      </span>
    </div>
  </div>
))}
  </div>
  <hr />
  
  <div className="md:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Array.isArray(adminData) ? adminData : []).map((item) => (
          <Card
            key={item.id}
            style={{ width: '100%'}}
            cover={
              item.picture ? (
                <img
                  alt={item.name}
                  src={item.picture}
                  style={{
                    objectFit: 'cover',
                    width: '100%', 
                    height: '170px', 
                  }}
                />
              ) : (
                <div className="text-center mt-4">
                  Bu ürün için eklenmiş bir resim bulunmamaktadır.
                </div>
              )
            }
            actions={[
              <EditOutlined
                key="edit"
                onClick={() => handleEditContent(item)}
                style={{ color: 'blue' }}

              />,
              <DeleteOutlined
                key="delete"
                onClick={() => handleDeleteContent(item.id, item.name)}
                style={{ color: 'red' }}

              />,
            ]}
          >
            <Meta
              title={<span>{item.name}</span>}
              description={<p className='mb-2'> <span className='font-bold'>Açıklama:</span>{item.description || 'Bu ürün için bir açıklama bulunamadı.'}</p>}
            />
            <p>Fiyat: {item.price}&#8378;</p>
          </Card>
        ))}
      </div>
    </div>
  
     
  
  
      <ModalComponentAddContent
        isOpen={addContentModalIsOpen}
        onClose={handleModalAddContentClose}
        onAdd={handleModalAddContentSave}
        selectedCategory={selectedCategory}
      />
  
      <ModalComponentEditCategory
        isOpen={editCategoryModalIsOpen}
        onClose={() => setEditCategoryModalIsOpen(false)}
        onSave={handleModalEditCategorySave}
        editingCategory={editingCategory}
      />
  
      <ModalComponentAddCategory
        isOpen={addCategoryModalIsOpen}
        onClose={handleModalAddCategoryClose}
        onSave={handleModalAddCategorySave}
      />
  
  {editingContent && (
  <ModalComponentEditContent
    isOpen={editModalIsOpen}
    onClose={handleModalEditClose}
    onSave={handleModalEditSave}
    content={editingContent}
  />
)}
  
      <ToastContainer />
    </div>
  );

}
export default Admin;