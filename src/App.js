import React, { useState } from 'react';
import Menu from './components/Menu';
import Categories from './views/Categories';
import Products from './views/Products';
import ShoppingList from './views/ShoppingList';
import Footer from './components/Footer'; 
import Container from './components/Container';
import styled from 'styled-components';

 // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
const DisabledOverlay = styled.div`
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? 'none' : 'auto')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
`;


const App = () => {
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState('categories'); // Lisätty view-tila
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // Lisätty tila valitulle kategorian ID:lle

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
      setSelectedCategoryId(null); // Reset the selected category when switching to products view
    }
    setView(view);
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
      <Menu onDatabaseCleared={handleDatabaseCleared} onToggleMenu={toggleMenu} isOpen={isMenuOpen}/>
      <DisabledOverlay $isDisabled={isMenuOpen}>
        <Container>{renderView()}</Container>
        <Footer setView={handleViewChange} />
      </DisabledOverlay>
    </div>
  );
};

export default App;
