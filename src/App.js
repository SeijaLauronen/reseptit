import React, { useState } from 'react';
import Menu from './components/Menu';
import Categories from './components/Categories';
import Products from './components/Products';
import ShoppingList from './components/ShoppingList';
import Footer from './components/Footer'; 
import Container from './components/Container';

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
        return <Categories refresh={refresh} isMenuOpen={isMenuOpen} />;
      case 'products':
        return <Products refresh={refresh} isMenuOpen={isMenuOpen} />;
      case 'shoppingList':
        return <ShoppingList refresh={refresh} isMenuOpen={isMenuOpen} />;
      default:
        return <Categories refresh={refresh} isMenuOpen={isMenuOpen} />;
    }
  };

  return (
    <div>
      <Menu onDatabaseCleared={handleDatabaseCleared} onToggleMenu={toggleMenu} />
      <Container>{renderView()}</Container>
      <Footer setView={setView} />
    </div>
  );
};

export default App;
