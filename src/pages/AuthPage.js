import React, { useState } from 'react';
import LoginPage from './LoginPage';
import AdminLogin from './AdminLogin';
import './AuthPage.css';

const AuthPage = () => {
  const [modalType, setModalType] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const openModal = (type) => setModalType(type);
  const closeModal = () => setModalType(null);

  const handleLogin = async (type) => {
    setLoading(true);
    try {
      // Call login API or perform login logic here
      // ...
      setLoading(false);
      closeModal();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1>Welcome! Please choose how you would like to log in :</h1>
      <div className="button-group">
        <button onClick={() => openModal('user')} aria-label="Login as User">
          Login as User
        </button>
        <button onClick={() => openModal('admin')} aria-label="Login as Admin">
          Login as Admin
        </button>
      </div>

      {modalType && (
        <>
          <div className="modal-backdrop" onClick={closeModal} />
          <div className="modal" style={{ display: 'block' }}>
            {modalType === 'user' && (
              <>
                <h2>User Login</h2>
                <LoginPage onClose={closeModal} onLogin={() => handleLogin('user')} />
              </>
            )}
            {modalType === 'admin' && (
              <>
                <h2>Admin Login</h2>
                <AdminLogin onClose={closeModal} onLogin={() => handleLogin('admin')} />
              </>
            )}
            {loading && <div>Loading...</div>}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <button onClick={closeModal}>Close</button>
          </div>
        </>
      )}
    </div>
  );
};

export default AuthPage;