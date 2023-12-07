import React, { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Admin = () => {
  
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('Çıkış başarılı.');
      toast.success('Çıkış başarılı.');
      navigate('/login');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      toast.error('Çıkış yapılırken bir hata oluştu.');
    }
  };


  return (
  <>
  <h1>Hi! admin..</h1>
  <button onClick={handleSignOut}>Sign Out</button>
  </>
    )

  }
export default Admin;
