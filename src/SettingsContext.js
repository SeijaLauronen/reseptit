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

  const [openQuantityByLongPress, setOpenQuantityByLongPress] = useState(() => {
    const saved = localStorage.getItem('openQuantityByLongPress');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('openQuantityByLongPress', JSON.stringify(openQuantityByLongPress));
  }, [openQuantityByLongPress]);

  const toggleOpenQuantityByLongPress = () => {
    setOpenQuantityByLongPress(prevState => !prevState);
  }

  const [showDose, setShowDose] = useState(() => {
    const saved = localStorage.getItem('showDose');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('showDose', JSON.stringify(showDose));
  }, [showDose]);

  const toggleShowDose = () => {
    setShowDose(prevState => !prevState);
  }

  const [showProductClass, setShowProductClass] = useState(() => {
    const saved = localStorage.getItem('showProductClass');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('showProductClass', JSON.stringify(showProductClass));
  }, [showProductClass]);

  const toggleShowProductClass = () => {
    setShowProductClass(prevState => !prevState);
  }

  const deleteLocalStorage = () => {
    localStorage.removeItem('colorCodingEnabled');
    localStorage.removeItem('keepQuantityEnabled');
    localStorage.removeItem('openQuantityByLongPress');
    localStorage.removeItem('showDose');
    localStorage.removeItem('showProductClass');
    localStorage.removeItem('productView'); // Tämä asetetaan Tuote-näkymässä, toisin kuin muut
  }

  const setLocalStorageDefaults = () => {
    setShowProductClass(true);
    setColorCodingEnabled(true);
    setKeepQuantityEnabled(false);
    setOpenQuantityByLongPress(false);
    setShowDose(true);    
    localStorage.setItem('productView', JSON.stringify(''));    // Tämä asetetaan Tuote-näkymässä, toisin kuin muut 
  }

  return (
    <SettingsContext.Provider value={{
      colorCodingEnabled, toggleColorCoding, setColorCodingEnabled,
      keepQuantityEnabled, toggleKeepQuantity, setKeepQuantityEnabled,
      openQuantityByLongPress, toggleOpenQuantityByLongPress, setOpenQuantityByLongPress,
      showDose, toggleShowDose, setShowDose,
      showProductClass, toggleShowProductClass, setShowProductClass,
      deleteLocalStorage, setLocalStorageDefaults
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
