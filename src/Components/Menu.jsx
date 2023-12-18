// src/Components/Menu.jsx
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Menu as AntMenu, Drawer, Button, Row, Col, Card } from 'antd';
import { MenuOutlined } from '@ant-design/icons';




const { SubMenu } = AntMenu;


const Menu = ({ categoryItems, categories }) => {

  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);



  useEffect(() => {
    setFilteredItems([]);
    toast.success('Hoşgeldiniz!', {
      position: 'bottom-right',
      autoClose: 3000,
      closeOnClick: false,
    });
  }, []);

  const filterItemsByCategory = (category) => {
    if (category === selectedCategory) {
      setSelectedCategory(null);
      setFilteredItems([]);
    } else {
      const filtered = category
        ? categoryItems.filter((item) => item.category === category)
        : [];
      setSelectedCategory(category);
      setFilteredItems(filtered);
    }
  };

  const showDrawer = () => {
    setDrawerOpen(true);
  };

  const onClose = () => {
    setDrawerOpen(false);
  };

  const handleCategoryClick = (category) => {
    filterItemsByCategory(category);
    onClose();

  };

  const cardStyle = {
    width: '100%',
    height: '100%', // Kartın sabit yüksekliği
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
    overflow: 'hidden', // Kart içeriğini sınırlamak için
  };



  
  return (
<div className="min-h-screen text-gray-800 p-4" style={{
      backgroundImage: `url(/assets/menubg.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <Row justify="center" align="middle" gutter={[16, 16]}>

        <Col span={24}>
          <Button
            type="primary"
            onClick={showDrawer}
            className="mb-4 menu-button"
            style={{ backgroundColor: 'white', borderColor: '#3498db', color:"black" }}
            icon={<MenuOutlined />}
          >
            Kategoriler
          </Button>
        </Col>

        <Drawer
          title="Menü"
          placement="left"
          closable={false}
          onClose={onClose}
          visible={drawerOpen}
        >
          <AntMenu
            mode="vertical"
            defaultSelectedKeys={[]}
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            style={{ width: '100%' }}
          >
            {categories.map((category) => (
              <AntMenu.Item
                key={category}
                onClick={() => handleCategoryClick(category)}
              >
                {category}
              </AntMenu.Item>
            ))}
          </AntMenu>
        </Drawer>

 

{filteredItems.length > 0 ? (
  <Col span={24}>
    <Row gutter={[16, 16]}>
      {filteredItems.map((item) => (
        <Col key={item.id} xs={24} sm={12} md={12} lg={12}>
          <Card
            hoverable
            style={cardStyle}
            cover={
              item.picture && (
                <img
                  alt={item.name}
                  src={item.picture}
                  style={{
                    objectFit: 'cover',
                    width: '100%', // Resim genişliği
                    height: '170px', // Resim yüksekliği
                  }}
                />
              )
            }
          >
            <div style={{ padding: '16px', height: '100%' }}>
              <h3
                style={{
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                {item.name}
                <hr />
              </h3>
              <p
                style={{
                  color: '#3498db',
                  fontWeight: 'bold',
                  marginBottom: '8px',
                }}
              >
                Fiyat: &#8378;{item.price}
              </p>
              {item.description && (
                <p className="text-gray-600 mb-2">
                  {item.description && item.description.length > 100
                    ? `${item.description.substring(0, 100)}...`
                    : item.description}
                </p>
              )}
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  </Col>
) : null}
      </Row>
    </div>
  );
};

export default Menu;










