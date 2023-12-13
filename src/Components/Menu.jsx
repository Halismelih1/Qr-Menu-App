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


  
  return (
    <div className="min-h-screen bg-cream text-gray-800 p-4">
      <Row justify="center" align="middle" gutter={[16, 16]}>
        <Col span={24}>
          <h1 className="text-xl font-bold mb-4">
            Lezzetin Tadını Çıkartın..
            {selectedCategory ? (
              <span className="block text-lg">{selectedCategory}</span>
            ) : (
              ''
            )}
          </h1>
        </Col>

        <Col span={24}>
          <Button
            type="primary"
            onClick={showDrawer}
            className="mb-4 menu-button"
            style={{ backgroundColor: '#3498db', borderColor: '#3498db' }}
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
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #ddd',
                  }}
                >
                  <Row gutter={16}>
                    {item.picture && (
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <img
                          alt={item.name}
                          src={item.picture}
                          style={{
                            width: '100%',
                            height: '200px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            borderTopLeftRadius: '10px',
                            borderTopRightRadius: '10px',
                          }}
                        />
                        {/* Resim URL'sini kontrol etmek için console.log ekleyin */}
                        {console.log('Item Picture URL:', item.picture)}
                      </Col>
                    )}
                      <Col xs={24} sm={12} md={12} lg={12}>
                        <div style={{ padding: '16px' }}>
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
                            Fiyat: ${item.price}
                          </p>
                          {item.description && (
                            <p className="text-gray-600 mb-2">
                              {item.description && item.description.length > 100
                                ? `${item.description.substring(0, 100)}...`
                                : item.description}
                            </p>
                          )}
                        </div>
                      </Col>
                    </Row>
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










