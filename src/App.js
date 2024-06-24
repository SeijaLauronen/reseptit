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

  const handleDatabaseCleared = () => {
    setRefresh(!refresh); // Vaihdetaan refresh tila päivittämisen laukaisemiseksi
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
      <Menu onDatabaseCleared={handleDatabaseCleared} />
      <Container>{renderView()}</Container>
      <Footer setView={setView} />
    </div>
  );
};

export default App;
