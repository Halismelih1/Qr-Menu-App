// src/Components/Menu.jsx
import React, { useEffect, useState } from 'react';
import { Menu as AntMenu, Drawer, Button, Row, Col, Card,message,Collapse } from 'antd';
import { MenuOutlined,FilterOutlined } from '@ant-design/icons';
import LazyLoad from 'react-lazy-load';


const { SubMenu } = AntMenu;

const Menu = ({ categoryItems, categories }) => {

  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [hasSelectedCategory, setHasSelectedCategory] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(null);


  const { Panel } = Collapse;

  const handleDescriptionClick = (index) => {
    setExpandedDescription(expandedDescription === index ? null : index);
  }





  useEffect(() => {
    setFilteredItems([]);
    message.open({
      content: 'Hoşgeldiniz!',
      duration: 2,
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
      setHasSelectedCategory(true);
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
    height: '100%', 
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    border: '1px solid #ddd',
    overflow: 'hidden', 
  };



  
  return (
    <div
    className="min-h-screen text-gray-800 p-4"
    style={{
      backgroundImage: hasSelectedCategory
        ? 'none'
        : `url(/assets/menubg.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}
  >
      <Row justify="center" align="middle" gutter={[16, 16]}>

        <Col span={24}>
          <Button
            type="primary"
            onClick={showDrawer}
            className="mt-12 ml-2"
            style={{ backgroundColor: 'white', borderColor: 'black', color:"black" }}
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
          open={drawerOpen}
        >
          <AntMenu
            mode="vertical"
            defaultSelectedKeys={[]}
            selectedKeys={selectedCategory ? [selectedCategory] : []}
            style={{ width: '100%' }}
          >
            {categories.map((category,i) => (
              <AntMenu.Item
                key={i}
                onClick={() => handleCategoryClick(category)}
                style={{borderLeft:"2px solid black",
                textAlign:"center", 
                marginBottom:"20px",
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
              >
                <FilterOutlined /> {category}
                 
              </AntMenu.Item>
            ))}
          </AntMenu>
        </Drawer>

 

        {filteredItems.length > 0 ? (
  <Col span={24}>
    <Row gutter={[16, 16]}>
      {filteredItems.map((item, i) => (
        <Col key={i} xs={24} sm={12} md={12} lg={12}>
          <Card
            hoverable
            style={cardStyle}
            bodyStyle={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
          >
            <div style={{ marginBottom: '16px', flex: 1, borderRadius: '10px', overflow: 'hidden' }}>
              {item.picture && (
                <LazyLoad height={200} offset={100} once>
                  <img
                    alt={item.name}
                    src={item.picture}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </LazyLoad>
              )}
            </div>
            <div style={{ flex: 1 }}>
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
                <Collapse accordion activeKey={expandedDescription}>
                  <Panel
                    key={i.toString()}
                    header="Açıklama"
                    onClick={() => handleDescriptionClick(i)}
                    showArrow={true}
                  >
                    <p className="text-gray-600 mb-2">
                      {item.description}
                    </p>
                  </Panel>
                </Collapse>
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










