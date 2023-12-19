import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDocs, query, updateDoc, where, writeBatch,deleteDoc ,getDoc, addDoc} from 'firebase/firestore';
import { ref,deleteObject  } from 'firebase/storage';
import { storage } from '../firebaseConfig';
import ModalComponentAddCategory from '../Modals/ModalComponentAddCategory';
import ModalComponentEditContent from "../Modals/ModalComponentEditContent";
import ModalComponentAddContent from '../Modals/ModalComponentAddContent';
import ModalComponentEditCategory from '../Modals/ModalComponetEditCategory'
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { Button, Card,Typography,message } from 'antd';
import { LogoutOutlined,HomeOutlined ,FileAddOutlined,PushpinOutlined, EditOutlined, DeleteOutlined,PlusCircleOutlined } from '@ant-design/icons';

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
      message.info('Çıkış yapıldı.');
      navigate('/');
    } catch (error) {
      message.error('Çıkış yapılırken bir hata oluştu.');
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
      message.error('Veri çekme işlemi başarısız oldu.');
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
      setAdminData([]);
    }
  };

  const handleAddCategory = () => {
    setAddCategoryModalIsOpen(true);
  };

  const handleModalAddCategorySave = async ({ category, name, price, description, picture }) => {
    try {
      if (!category.trim() || !name.trim() || !price.trim() || !picture) {
        message.warning('Lütfen Tüm Zorunlu Alanları Doldurunuz !', 2);
        return;
      }
  
      // Kategori ismini küçük harfe dönüştürerek kontrol et
      const categoryLowerCase = category.toLowerCase();
      const categoryExists = categories.map(c => c.toLowerCase()).includes(categoryLowerCase);
  
      if (categoryExists) {
        message.warning('Bu isimde bir kategori mevcut, lütfen farklı bir isim girin !', 2);
        return;
      }
  
      await addDoc(collection(db, 'Menu'), {
        category: categoryLowerCase,
        name: name,
        price: price,
        description: description,
        picture: picture
      });
  
      fetchData();
  
      message.success('İçerik başarıyla eklendi.', 2);
  
      setAddCategoryModalIsOpen(false);
    } catch (error) {
      message.error('İçerik ekleme işlemi başarısız oldu.');
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
                  } catch (error) {
                    console.error('Error :', error);
                  }
                }
              });
  
              await batch.commit();
  
              fetchData();
  
              message.success(`"${category}" kategorisi ve ilgili içerikleri başarıyla silindi.`, 2
             );
  
            } catch (error) {
              message.error('Kategori silme işlemi başarısız oldu.');
            }
          },
        },
        {
          label: 'Hayır',
          onClick: () => {
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
        message.error('Tanımsız Content ID');
        return;
      }
  
      // İlgili belgenin referansını alma
      const contentDocRef = doc(db, 'Menu', id);
  
      // Eski içeriğin verilerini alma
      const oldContentSnapshot = await getDoc(contentDocRef);
      const oldPicturePath = oldContentSnapshot.data().picture;
  
      // Belgeyi güncelleme işlemi
      const updateData = {
        name,
        price,
        description,
      };
  
      // Eğer yeni açıklama varsa, onu da güncelleme verisine ekleme
      if (description !== null) {
        updateData.description = description;
      }
  
      // Eğer yeni resim varsa, onu da güncelleme verisine ekleme
      if (picture !== null) {
        updateData.picture = picture;
  
        // Eski resmi Storage'dan silme işlemi
        if (oldPicturePath) {
          const oldImageRef = ref(storage, oldPicturePath);
          try {
            await deleteObject(oldImageRef);
            // Eski resim başarıyla silindi
          } catch (error) {
          }
        }
      }
  
      await updateDoc(contentDocRef, updateData);
  
      handleCategoryClick(selectedCategory);
  
      message.success('İçerik başarıyla güncellendi.', 2);
    } catch (error) {
      message.error('İçerik güncelleme işlemi başarısız oldu.');
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
  
              // İlgili içeriğin resim dosyasının Storage'dan silinmesi
              const contentSnapshot = await getDoc(contentDocRef);
              const imagePath = contentSnapshot.data().picture;
              if (imagePath) {
                const imageRef = ref(storage, imagePath);
                try {
                  await deleteObject(imageRef);
                  // Resim başarıyla silindi
                } catch (error) {
                  console.error('Storage\'dan resim silme hatası,tekrar deneyin');
                }
              }
  
              // Belgeyi silme işlemi
              await deleteDoc(contentDocRef);
  
              fetchData();
  
              message.success('İçerik başarıyla silindi.',2);
            } catch (error) {
              console.error('İçerik silme işlemi başarısız oldu.',2);
            }
          },
        },
        {
          label: 'Hayır',
          onClick: () => {
          },
        },
      ],
    });
  };

  const handleAddContent = (category) => {
    try {
      if (!category) {
        // Kullanıcı henüz bir kategori seçmemişse, uyarı ver
        message.warning('Lütfen bir kategori seçin.',2);
        return;
      }
      setAddContentModalIsOpen(true);
      setSelectedCategory(category);
    } catch (error) {
      message.error('İçerik ekleme işlemi başarısız oldu, lütfen tekrar deneyin');
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
  
      fetchData();
  
      message.success('İçerik başarıyla eklendi.',2);
      setAddContentModalIsOpen(false);
    } catch (error) {
      message.error('İçerik ekleme işlemi başarısız oldu, lütfen tekrar deneyin');
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
  
      fetchData();

      
  
      message.success('Kategori güncellendi', 2);
    } catch (error) {
      message.error('Kategori güncelleme işlemi başarısız, lütfen tekrar deneyin');
    } finally {
      setEditCategoryModalIsOpen(false);
      setEditingCategory(null);
    }
  };

  const navigateHome = ()=>{
    navigate("/")
  }



  return (
    <div className="container min-h-screen overflow-y-hidden mx-auto mt-8 p-4">
      <header className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-3xl font-bold mb-4 mt-8 text-center md:text-left" style={{
                     color: ' black',
                    
          }}>
           Admin: {user.email}!
          </h1>
          <hr /> <br />
        </div>
        <Button
        onClick={handleAddCategory}
        style={{
          color: 'green',
          fontWeight: 'bold',
          marginBottom:'4px',
          width:"100%",
          borderRadius:"50px"
        }}
        icon={<FileAddOutlined />}
      >
        Kategori Ekle
      </Button>
      <Button
        onClick={navigateHome}
        style={{
          color: '#008B8B',
          fontWeight: 'bold',
          marginBottom:'4px',
          width:"100%",
          borderRadius:"50px"
        }}
        icon={<HomeOutlined />}
      >
        Anasayfa
      </Button>
        <Button
          icon={<LogoutOutlined />}
          onClick={handleSignOut}
          style={{ color: '#FF0000', fontWeight: 'bold', width:"100%",
          borderRadius:"50px" }}
          
        >
          Çıkış Yap
        </Button>
      </header>
      <div className="mb-8 flex flex-col md:flex-row">
      <div className="md:w-1/4 mb-4 md:mb-0 mr-4">
    {categories.map((category,i) => (
            <div key={i} className="flex items-center mb-4 m-8 justify-between">
              <PushpinOutlined />
            <Button
          type="primary"
          onClick={() => handleCategoryClick(category)}
          style={{
            width: '120px',
            height: '40px',
            backgroundColor: '#ffffff',
            borderColor: 'black',
            marginRight: '8px',
            borderBottom: '4px solid black',
            color:"black",
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
        {(Array.isArray(adminData) ? adminData : []).map((item,i) => (
          <Card
            key={i}
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
            <p>Fiyat: {item.price} &#8378;</p>
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
  
    </div>
  );

}
export default Admin;