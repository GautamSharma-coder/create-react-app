import React, { createContext, useState, useContext } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

// Create a context for managing toasts
const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    setToasts([...toasts, { id: Date.now(), message, type }]);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer position="top-end" className="p-3">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            bg={toast.type === 'success' ? 'success' : 'danger'}
            onClose={() => removeToast(toast.id)}
            autohide
            delay={3000}
          >
            <Toast.Header>
              <strong className="me-auto">{toast.type === 'success' ? 'Success' : 'Error'}</strong>
            </Toast.Header>
            <Toast.Body>{toast.message}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    </ToastContext.Provider>
  );
};