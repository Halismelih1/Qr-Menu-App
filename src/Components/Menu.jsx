// src/Components/Menu.jsx
import React, { useState } from 'react';

const Menu = ({ categoryItems, categories }) => {

  const [filteredItems, setFilteredItems] = useState(categoryItems);

  // Kategoriye göre filtreleme yapacak fonksiyon
  const filterItemsByCategory = (category) => {
    if (category === 'Tümü') {
      // Eğer "Tümü" seçiliyse, tüm menüleri göster
      setFilteredItems(menuItems);
    } else {
      // Diğer durumda, seçilen kategoriye göre filtrele
      const filtered = categoryItems.filter((item) => item.category === category);
      setFilteredItems(filtered);
    }
  };




  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white">
      {/* Kategori filtreleme düğmeleri */}
      {categories.length > 0 && (
        <div className="flex flex-wrap justify-center mt-4">
          <button
            key="Tümü"
            className="p-4 m-2 bg-blue-500 text-white rounded-md"
            onClick={() => filterItemsByCategory('Tümü')}
          >
            Tümü
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className="p-4 m-2 bg-blue-500 text-white rounded-md"
              onClick={() => filterItemsByCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Filtrelenmiş menü içeriği */}
      {filteredItems.length > 0 ? (
        <div className="flex flex-col items-center mt-8 w-full">
          {filteredItems.map((item) => (
            <div key={item.id} className="mb-4">
              <p className="text-xl font-semibold">{item.name}</p>
              <p className="text-gray-400">Fiyat: ${item.price}</p>
              {/* Eğer description mevcutsa göster */}
              {item.description && (
                <p className="text-gray-400">Açıklama: {item.description}</p>
              )}
              {/* Eğer picture mevcutsa göster */}
              {item.picture && (
                <img src={item.picture} alt={item.name} className="w-32 h-32" />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-white">Bu kategoride menü bulunmamaktadır.</p>
      )}
    </div>
  );
};

export default Menu;
