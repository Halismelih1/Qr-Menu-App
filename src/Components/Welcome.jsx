// src/Components/Welcome.jsx
import React from 'react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';

const Welcome = ({ onMenuButtonClick, handleAdminClick }) => {
  return (
    
    <div className="bg-gray-900 text-white min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
         <a
        className="text-white py-2 px-4 cursor-pointer"
        onClick={handleAdminClick}
      >
        isAdmin ?
      </a>
      <div className="max-w-md p-8 bg-gray-800 rounded-md shadow-lg text-center relative">
        <h1 className="text-4xl font-extrabold mb-4">Hoş Geldiniz!</h1>
        <p className="text-gray-300 mb-8">Lezzetin Keyfini Çıkarın.</p>
        
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
          onClick={onMenuButtonClick}
        >
          Menüyü Görüntüle
        </button>
        
        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-300 hover:text-blue-500">
            <FaInstagram />
          </a>
          <a href="#" className="text-gray-300 hover:text-blue-500">
            <FaTwitter />
          </a>
          <a href="#" className="text-gray-300 hover:text-blue-500">
            <FaFacebook />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
