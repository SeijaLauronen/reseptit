import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #673ab7;
  color: #fff;
  display: flex;
  justify-content: space-around;
  padding: 10px 0;
`;

const FooterItem = styled.div`
  cursor: pointer;
`;

const Footer = ({ setView }) => {
  return (
    <FooterContainer>
      <FooterItem onClick={() => setView('categories')}>Kategoriat</FooterItem>
      <FooterItem onClick={() => setView('products')}>Tuotteet</FooterItem>
      <FooterItem onClick={() => setView('shoppingList')}>Ostoslista</FooterItem>
    </FooterContainer>
  );
};

export default Footer;
