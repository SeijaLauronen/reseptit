import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {

  // Asetus: colorCodingEnabled
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

  // Asetus: keepQuantityEnabled
  const [keepQuantityEnabled, setKeepQuantityEnabled] = useState(() => {
    const saved = localStorage.getItem('keepQuantityEnabled');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('keepQuantityEnabled', JSON.stringify(keepQuantityEnabled));
  }, [keepQuantityEnabled]);

  const toggleKeepQuantity = () => {
    setKeepQuantityEnabled(prevState => !prevState);
  }

  return (
    <SettingsContext.Provider value={{
      colorCodingEnabled, toggleColorCoding, setColorCodingEnabled,
      keepQuantityEnabled, toggleKeepQuantity, setKeepQuantityEnabled
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
