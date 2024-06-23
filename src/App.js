import React, { useState } from 'react';
import Menu from './components/Menu';
import Categories from './components/Categories';
import Products from './components/Products';
import Footer from './components/Footer'; // Varmista, että tämä rivi on mukana
import styled from 'styled-components'; // Containeria varten 

// Määritellään Container-komponentti täällä, voisi myös tehdä erillisen komponentin
const Container = styled.div`
  padding: 20px;
  margin-top: 50px; /* Adjust based on your header/menu height */
  margin-bottom: 50px; /* Adjust based on your footer height */
`;

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
