import React from 'react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Button } from 'antd'; 

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-800 to-white flex flex-col items-center bg-no-repeat" style={{
      backgroundImage: `url(/assets/welcomebg.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }} >
      {/* Logo */}
      <div className="mt-40">
      <Link to="/">
          <img src="assets/degirmenLogoRemove.png" alt="Logo" className="h-28 cursor-pointer border-b-2 border-black " />
        </Link>
        </div>

      {/* Üst Div (Görsel ve Hoşgeldiniz Metni) */}
      <div className="text-white text-center p-4 md:p-8">
        <h1 className="text-2xl md:text-6xl font-extrabold mb-2 md:mb-4 m-16 text-black">Hoşgeldiniz!</h1>
        <p className="text-gray-900">Tadını çıkarın, özel lezzetlerimizi keşfedin.</p>
      </div>

      {/* Alt Div (Menü Git Butonu ve Sosyal Medya Linkleri) */}
      <div className="flex flex-col items-center space-y-4 p-4 md:p-8 ">
      <Link to="/menu">
          <Button
            type="primary"
            size="large"
            shape="round"
            className="hover:bg-yellow-500 hover:text-white"
            style={{background:"#002244", color:"white",fontWeight:"bold" }}

          >
            Menüye Git
          </Button>
        </Link>
        <div className="flex space-x-4">
          <a href="#" className="text-gray-500 hover:text-black hover:text-white mt-6"><FaInstagram size={24} /></a>
          <a href="#" className="text-gray-500 hover:text-black hover:text-white mt-6"><FaTwitter size={24} /></a>
          <a href="#" className="text-gray-500 hover:text-black hover:text-white mt-6"><FaFacebook size={24} /></a>
        </div>
      </div>
    </div>
  );
};
export default Welcome;





