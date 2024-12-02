import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
//import Loader from './code-art-generative-loader.tsx'
function AdminRoute({ children }) {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    };
    checkAdmin();
  }, [user]);

  if (loading) {
    return (<div> Loading......</div>);
  }

  if (!user || !isAdmin) {
    return (<Navigate to="/adminAuthPanel" />);
  }

  return children;
}

export default AdminRoute;