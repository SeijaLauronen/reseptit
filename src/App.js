import React, { useState } from 'react';
import styled from 'styled-components';
import Menu from './components/Menu';
import Footer from './components/Footer';
import Categories from './components/Categories';
import Products from './components/Products';

const Container = styled.div`
  padding: 20px;
`;

const App = () => {
  const [view, setView] = useState('categories');

  const renderView = () => {
    switch (view) {
      case 'categories':
        return <Categories />;
      case 'products':
        return <Products />;
      // Lisää muut näkymät
      default:
        return <Categories />;
    }
  };

  return (
    <>
      <Menu />
      <Container>{renderView()}</Container>
      <Footer setView={setView} />
    </>
  );
};

export default App;
