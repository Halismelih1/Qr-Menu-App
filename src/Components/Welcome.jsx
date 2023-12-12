import React from 'react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-white flex flex-col items-center bg-no-repeat" >
      {/* Logo */}
      <div className="mt-32 mb-2">
      <Link to="/login">
          <img src="assets/dgrmn.png" alt="Logo" className="h-16 cursor-pointer" />
        </Link>
        </div>

      {/* Üst Div (Görsel ve Hoşgeldiniz Metni) */}
      <div className="text-white text-center p-4 md:p-8">
        <h1 className="text-2xl md:text-6xl font-extrabold mb-2 md:mb-4 m-16">Hoşgeldiniz!</h1>
        <p className="text-gray-900">Tadını çıkarın, özel lezzetlerimizi keşfedin.</p>
      </div>

      {/* Alt Div (Menü Git Butonu ve Sosyal Medya Linkleri) */}
      <div className="flex flex-col items-center space-y-4 p-4 md:p-8 ">
      <Link to="/menu">
      <button className="bg-white text-black px-4 md:px-6 py-2 md:py-3 rounded-full hover:bg-yellow-500 hover:text-white focus:outline-none focus:ring focus:border-blue-300">
  Menüye Git
</button>
        </Link>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-300 hover:bg-yellow-500 hover:text-white"><FaInstagram size={24} /></a>
          <a href="#" className="text-gray-300 hover:bg-yellow-500 hover:text-white"><FaTwitter size={24} /></a>
          <a href="#" className="text-gray-300 hover:bg-yellow-500 hover:text-white"><FaFacebook size={24} /></a>
        </div>
      </div>
    </div>
  );
};
export default Welcome;





