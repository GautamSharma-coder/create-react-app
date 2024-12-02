import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';

function PrivateRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (<div>Loading...</div>);  // Optionally, you can return a loading spinner here
  }

  return (user ? children : <Navigate to="/auth-page" />);
}

export default PrivateRoute;