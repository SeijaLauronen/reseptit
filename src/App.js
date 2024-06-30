import React, { useState } from 'react';
import Menu from './components/Menu';
import Categories from './components/Categories';
import Products from './components/Products';
import ShoppingList from './components/ShoppingList';
import Footer from './components/Footer'; 
import Container from './components/Container';
import styled from 'styled-components';

const DisabledOverlay = styled.div`
  pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;

const App = () => {
  const [refresh, setRefresh] = useState(false);
  const [view, setView] = useState('categories'); // Lisätty view-tila
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleDatabaseCleared = () => {
    setRefresh(!refresh); // Vaihdetaan refresh tila päivittämisen laukaisemiseksi
  };

  const toggleMenu = (isOpen) => {
    setIsMenuOpen(isOpen);
  };

  const renderView = () => {
    switch (view) {
      case 'categories':
        return <Categories refresh={refresh} />;
      case 'products':
        return <Products refresh={refresh} />;
      case 'shoppingList':
        return <ShoppingList refresh={refresh} />;
      default:
        return <Categories refresh={refresh} />;
    }
  };

  return (
    <div>
      <Menu onDatabaseCleared={handleDatabaseCleared} onToggleMenu={toggleMenu} isOpen={isMenuOpen} />
      <DisabledOverlay isDisabled={isMenuOpen}>
        <Container>{renderView()}</Container>
        <Footer setView={setView} />
      </DisabledOverlay>
    </div>
  );
};

export default App;
