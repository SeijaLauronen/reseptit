import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #673ab7; // violetti //#81cbdb; vaalea turkoosi //#007BFF; tumma turkoosi// 
  color: #fff;
  display: flex;
  justify-content: space-around;
  padding: 10px 0px;
  height: 40px;
`;

const FooterItem = styled.div`
  cursor: pointer;
`;

const FooterButton = styled.button`
  cursor: pointer;
  background: ${({ $isActive }) => ($isActive ? '#ffffc4' : '#673ab7')}; //#4caf50
  color: ${({ $isActive }) => ($isActive ? '#000000' : '#fff')};  
  border: solid #fff;
  border-radius: 20px;
  padding: 3px 25px;
  font-size: 14px;
  transition: background 0.3s, color 0.3s;

  &:hover {
    background: #ffffc4;
    color: #673ab7;
  }
`;

const Footer = ({ setView, currentView }) => {
  return (
    <FooterContainer>
      <FooterButton
        onClick={() => setView('categories')}
        $isActive={currentView === 'categories'}
      >
        Kategoriat
      </FooterButton>
      <FooterButton
        onClick={() => setView('products')}
        $isActive={currentView === 'products'}
      >
        Tuotteet
      </FooterButton>
      <FooterButton
        onClick={() => setView('shoppingList')}
        $isActive={currentView === 'shoppingList'}
      >
        Ostoslista
      </FooterButton>
    </FooterContainer>
  );
};

export default Footer;
