import React, { useState } from 'react';
import Menu from './components/Menu';
import Categories from './views/Categories';
import Products from './views/Products';
import ShoppingList from './views/ShoppingList';
import Footer from './components/Footer'; 
import Container from './components/Container';
import Info from './components/Info';
import helpTexts from './helpTexts';
import DisabledOverlay from './components/DisabledOverlay';

const App = () => {
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState('categories'); // Lisätty view-tila
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Lisätty tila valitulle kategorian ID:lle
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

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
    if (view === 'products') {
      setSelectedCategoryId(null); // Nollataan valittu kategoria kun siirrytään products-näkymään
    }
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
      default:
        return <Categories refresh={refresh} onCategorySelect={handleCategorySelect} />;
    }
  };

   // Huom, Menu:uun ei transientti props, koska se ei ole styledKOmponentti
  return (
    <div>
      <Menu onDatabaseCleared={handleDatabaseCleared} onToggleMenu={toggleMenu} isOpen={isMenuOpen} onOpenInfo={handleOpenInfo}/>
      <DisabledOverlay $isDisabled={isMenuOpen}>
        <Container>{renderView()}</Container>
        <Footer setView={handleViewChange} currentView ={view}/>
      </DisabledOverlay>
      <Info isOpen={isInfoOpen} onCancel={handleCloseInfo}>
        {infoMessage}
      </Info>
    </div>
  );
};

export default App;
