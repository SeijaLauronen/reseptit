import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CloseButtonComponent } from './Button';
import { clearDB } from '../database';

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #673ab7;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

// transientti props $isOpen eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  z-index: 998;
`;

const MenuList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: fixed;
  top: 50px; /* Alkaa menupalkin alapuolelta */
  left: 0;
  width: 250px;
  height: calc(100% - 50px); /* Korkeus suhteutettu menupalkkiin */
  background-color: white;
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;
  z-index: 999;
`;

const MenuItem = styled.li`
  padding: 10px;
  text-decoration: none;
  color: black;
  cursor: pointer;

  &:hover {
    background-color: #ddd;
  }
`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: white;
  font-size: 24px;
`;

//Huom tähän ei transienttia $isOpenia, koska ei ole styled komponentti
const Menu = ({ onDatabaseCleared, isOpen, onToggleMenu }) => {
  const handleDeleteDatabase = async () => {
    const confirmDelete = window.confirm('Haluatko varmasti poistaa kaikki sovelluksen tiedot?');
    if (confirmDelete) {
      await clearDB();
      alert('Tiedot poistettu');
      onDatabaseCleared();
    }
    onToggleMenu(false); // Suljetaan menu joka tapauksessa
  };

  const toggleMenu = () => {    
    onToggleMenu(!isOpen);
  };

  // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
  return (
    <>
      <MenuContainer>
        <MenuIcon onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </MenuIcon>        
      </MenuContainer>
      <MenuOverlay $isOpen={isOpen} onClick={toggleMenu} />
      <MenuList $isOpen={isOpen}>
        <CloseButtonComponent onClick={toggleMenu}/>
        <MenuItem></MenuItem>
        <MenuItem onClick={handleDeleteDatabase}>Poista kaikki tiedot</MenuItem>
        <MenuItem></MenuItem>
        <MenuItem></MenuItem>
      </MenuList>
    </>
  );
};

export default Menu;
