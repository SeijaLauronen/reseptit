import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [colorCodingEnabled, setColorCodingEnabled] = useState(() => {
    const saved = localStorage.getItem('colorCodingEnabled');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('colorCodingEnabled', JSON.stringify(colorCodingEnabled));
  }, [colorCodingEnabled]);

  const toggleColorCoding = () => {
    setColorCodingEnabled(prevState => !prevState);
  };

  return (
    <SettingsContext.Provider value={{ colorCodingEnabled, toggleColorCoding, setColorCodingEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
