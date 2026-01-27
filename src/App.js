import React, { useState, useEffect } from 'react';
import Menu from './components/Menu';
import Categories from './views/Categories';
import Products from './views/Products';
import ShoppingList from './views/ShoppingList';
import Days from './views/Days';
import Footer from './components/Footer';
import Container from './components/Container';
import Info from './components/Info';
import helpTexts from './helpTexts';
import DisabledOverlay from './components/DisabledOverlay';

const App = () => {

  const [refresh, setRefresh] = useState(false);  
  const [isMenuOpen, setIsMenuOpen] = useState(false);  
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const [view, setView] = useState(() => {
    const savedView = localStorage.getItem('lastView');
    return savedView || 'categories';
  });

  useEffect(() => {
    localStorage.setItem('lastView', view);
  }, [view]);

  const [selectedCategoryId, setSelectedCategoryId] = useState(() => {
    const saved = localStorage.getItem('lastSelectedCategoryId');
    return saved ? parseInt(saved, 10) : null;
  });

  useEffect(() => {
    if (selectedCategoryId !== null) {
      localStorage.setItem('lastSelectedCategoryId', selectedCategoryId.toString());
    } else {
      localStorage.removeItem('lastSelectedCategoryId');
    }
  }, [selectedCategoryId]);

  const handleDatabaseCleared = () => {
    setRefresh(!refresh); // Vaihdetaan refresh tila päivittämisen laukaisemiseksi
  };

  const toggleMenu = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  const handleCategorySelect = (categoryId) => {    
    setSelectedCategoryId(categoryId);
    setView('products');
  };

  const handleViewChange = (view) => {    
    setSelectedCategoryId(null);
    localStorage.removeItem('lastSelectedCategoryId');
    setView(view);
  };

  const handleOpenInfo = () => {
    setInfoMessage(helpTexts[view]);
    setIsInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

  const renderView = () => {
    switch (view) {
      case 'categories':
        return <Categories refresh={refresh} onCategorySelect={handleCategorySelect} />;
      case 'products':
        return <Products refresh={refresh} categoryId={selectedCategoryId} />;
      case 'shoppingList':
        return <ShoppingList refresh={refresh} />;
      case 'days':
        return <Days refresh={refresh} />;
      default:
        return <Categories refresh={refresh} onCategorySelect={handleCategorySelect} />;
    }
  };

  // Huom, Menu:uun ei transientti props, koska se ei ole styledKOmponentti
  return (
    <div>
      <Menu onDatabaseCleared={handleDatabaseCleared} onToggleMenu={toggleMenu} isOpen={isMenuOpen} onOpenInfo={handleOpenInfo} />
      <DisabledOverlay $isDisabled={isMenuOpen}>
        <Container>{renderView()}</Container>
        <Footer setView={handleViewChange} currentView={view} selectedCategoryId={selectedCategoryId}/>
      </DisabledOverlay>
      <Info isOpen={isInfoOpen} onCancel={handleCloseInfo}>
        {infoMessage}
      </Info>
    </div>
  );
};

export default App;
