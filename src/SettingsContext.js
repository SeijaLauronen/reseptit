import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {

  // Asetus: näytetään päiväsuunnitelma näkymä
  const [dayPlanEnabled, setDayPlanEnabled] = useState(() => {
    const saved = localStorage.getItem('dayPlanEnabled');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('dayPlanEnabled', JSON.stringify(dayPlanEnabled));
  }, [dayPlanEnabled]);

  const toggleDayPlanEnabled = () => {
    setDayPlanEnabled(prevState => !prevState);
  };


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
  // Asetus: hideQuantityUnit
  const [hideQuantityUnit, setHideQuantityUnit] = useState(() => {
    const saved = localStorage.getItem('hideQuantityUnit');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('hideQuantityUnit', JSON.stringify(hideQuantityUnit));
  }, [hideQuantityUnit]);

  const toggleHideQuantityUnit = () => {
    setHideQuantityUnit(prevState => !prevState);
  }

   // Asetus: hidePrice
  const [hidePrice, setHidePrice] = useState(() => {
    const saved = localStorage.getItem('hidePrice');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('hidePrice', JSON.stringify(hidePrice));
  }, [hidePrice]);

  const toggleHidePrice = () => {
    setHidePrice(prevState => !prevState);
  }

  // Asetus: openQuantityByLongPress
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

  // Asetus: showDose
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

  // Asetus: showProductClass
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

  //toggleFilterSearchProducts
  const [filterSearchProducts, setFilterSearchProducts] = useState(() => {
    const saved = localStorage.getItem('filterSearchProducts');
    return saved !== null ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('filterSearchProducts', JSON.stringify(filterSearchProducts));
  }, [filterSearchProducts]);

  const toggleFilterSearchProducts = () => {
    setFilterSearchProducts(prevState => !prevState);
  }


  const deleteLocalStorage = () => {

    /* Aseteaan ensin arvot, että kontekstit ja tilat päivittyy */
    setShowProductClass(false);
    setColorCodingEnabled(false);
    setKeepQuantityEnabled(false);
    setOpenQuantityByLongPress(false);
    setShowDose(false);
    setDayPlanEnabled(false);
    setFilterSearchProducts(false);
    setHideQuantityUnit(false);
    localStorage.setItem('productView', JSON.stringify(''));    // Tämä asetetaan Tuote-näkymässä, toisin kuin muut 
    /* Poistetaan sitten localStoresta*/
    localStorage.removeItem('colorCodingEnabled');
    localStorage.removeItem('keepQuantityEnabled');
    localStorage.removeItem('openQuantityByLongPress');
    localStorage.removeItem('showDose');
    localStorage.removeItem('showProductClass');
    localStorage.removeItem('dayPlanEnabled');
    localStorage.removeItem('filterSearchProducts');
    localStorage.removeItem('hideQuantityUnit');
    localStorage.removeItem('hidePrice');
    localStorage.removeItem('productView'); // Tämä asetetaan Tuote-näkymässä
    localStorage.removeItem('dayView'); // Tämä asetetaan Päivä-näkymässä    
    localStorage.removeItem('followPlan'); // Tämä asetetaan Päivä-näkymässä    
    localStorage.removeItem('followedPlan'); // Tämä asetetaan Päivä-näkymässä
    localStorage.removeItem('closedItemsExecution'); // Tämä asetetaan Päivä-näkymässä/ FollowdayPlan
    localStorage.removeItem('dayPlanOpenItems'); // Tämä asetetaan Päivän suunnittelunäkymässä
    localStorage.removeItem('lastSelectedCategoryId'); // App.js
    localStorage.removeItem('lastView'); // App.js
    localStorage.removeItem('shoppingClosedCategories'); // ShoppingList.js

  }

  const setLocalStorageDefaults = () => {
    setShowProductClass(true);
    setColorCodingEnabled(true);
    setKeepQuantityEnabled(false);
    setOpenQuantityByLongPress(false);
    setShowDose(true);
    setDayPlanEnabled(false);
    setFilterSearchProducts(false);
    setHideQuantityUnit(false);
    localStorage.setItem('productView', JSON.stringify(''));    // Tämä asetetaan Tuote-näkymässä, toisin kuin muut 
  }

  return (
    <SettingsContext.Provider value={{
      colorCodingEnabled, toggleColorCoding, setColorCodingEnabled,
      keepQuantityEnabled, toggleKeepQuantity, setKeepQuantityEnabled,
      openQuantityByLongPress, toggleOpenQuantityByLongPress, setOpenQuantityByLongPress,
      showDose, toggleShowDose, setShowDose,
      showProductClass, toggleShowProductClass, setShowProductClass,
      dayPlanEnabled, toggleDayPlanEnabled, setDayPlanEnabled,
      filterSearchProducts, toggleFilterSearchProducts, setFilterSearchProducts,
      hideQuantityUnit, toggleHideQuantityUnit, setHideQuantityUnit,
      hidePrice, toggleHidePrice, setHidePrice,
      deleteLocalStorage, setLocalStorageDefaults
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  return useContext(SettingsContext);
};
