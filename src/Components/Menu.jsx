import React, { useEffect, useState } from 'react';
import { Menu as AntMenu, Drawer, Button, Row, Col, Card,Typography ,Collapse } from 'antd';
import LazyLoad from 'react-lazy-load';


const { Title, Paragraph } = Typography;

const Menu = ({ categoryItems, categories }) => {

  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [hasSelectedCategory, setHasSelectedCategory] = useState(false);
  const [expandedDescription, setExpandedDescription] = useState(null);




  const { Panel } = Collapse;

  const handleDescriptionClick = (index) => {
    setExpandedDescription(expandedDescription === index ? null : index);
  }

  useEffect(() => {
    setFilteredItems([]);

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


  const onCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleCategoryClick = (category) => {
    filterItemsByCategory(category);
    onCloseDrawer();
  };



 

  const cardStyle = {
    width: '100%',
    height: '100%', 
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden', 
  };



  
  return (
    <div
  className={'min-h-screen text-gray-800 p-4 '}
  style={{
    backgroundImage: hasSelectedCategory
      ? 'url(/assets/categorybg.jpg)'
      : `url(/assets/menubg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
  <Row justify="center" align="middle" gutter={[16, 16]}>
    <Col span={24}></Col>

    <Drawer
      title={
        <Title level={3} >
          Kategoriler
        </Title>
      }
      placement="left"
      closable={false}
      open={drawerOpen}
      style={{ padding: 0, textAlign: 'center', background: 'rgba(255, 255, 255, 0.6)' }}
      width="60%"
      destroyOnClose={true}
    >
      {categories.map((category, i) => (
         <Paragraph
         style={{
           margin: '15px',
           justifyContent: 'center',
           fontSize: '18',
           fontFamily: 'Amatic SC, cursive',
           color: 'black', 
           fontWeight: 'bold', 
           letterSpacing: '1px', 
         }}
         key={i}
         onClick={() => handleCategoryClick(category)}
       >
         {category}
       </Paragraph>
      ))}
    </Drawer>
   
        {filteredItems.length > 0 ? (
          <Col span={24}>
            <Row gutter={[16, 16]}>
              {filteredItems.map((item, i) => (
                <Col key={i} xs={24} sm={12} md={12} lg={12}>
                  <Card
                  className='bg-gray-100 shadow-lg'
                    hoverable
                    style={cardStyle}
                    bodyStyle={{ padding: '10px', display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}
                  >
                    <div style={{ marginBottom: '16px', flex: 1, borderRadius: '10px', overflow: 'hidden' }}>
                      {item.picture && (
                        <LazyLoad height={200} offset={100} resize={false} threshold={0.5}  debounce={false} once>
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