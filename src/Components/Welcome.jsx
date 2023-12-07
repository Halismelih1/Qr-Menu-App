import React from 'react';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Welcome = () => {
  return (
    <div className="bg-gray-400 text-white min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
      <Link to="/login" className="text-white py-2 px-4 cursor-pointer absolute top-0 right-0 ">
        isAdmin ?
      </Link>
      <div className="max-w-xl p-8 bg-gray-500 rounded-md shadow-lg text-center relative">
        <h1 className="text-5xl font-extrabold mb-4">Hoş Geldiniz!</h1>
        <p className="text-gray-300 mb-8">Lezzetin Keyfini Çıkarın. Restoranımıza özel lezzetleri keşfedin.</p>

        <Link
          to="/menu"
          className="bg-blue-500 text-white py-3 px-6 rounded-full mb-6 inline-block hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          Menüyü Görüntüle
        </Link>

        <div className="flex justify-center space-x-4">
          <a href="#" className="text-gray-300 hover:text-blue-500">
            <FaInstagram size={32} />
          </a>
          <a href="#" className="text-gray-300 hover:text-blue-500">
            <FaTwitter size={32} />
          </a>
          <a href="#" className="text-gray-300 hover:text-blue-500">
            <FaFacebook size={32} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
