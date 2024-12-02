import React, { createContext, useState, useContext, useEffect } from 'react';

// Create a context for dark mode
const DarkModeContext = createContext();

// Custom hook to use dark mode context
export const useDarkMode = () => {
  return useContext(DarkModeContext);
};

// DarkModeProvider component that wraps your application
export const DarkModeProvider = ({ children }) => {
  // Check for dark mode preference in localStorage or fallback to system preference
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [darkMode, setDarkMode] = useState(getInitialMode);

  // Update dark mode in localStorage and apply dark mode class to body
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};