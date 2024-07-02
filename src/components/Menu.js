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
  background-color: #333;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1000;
`;

const MenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 998;
`;

const MenuList = styled.ul.withConfig({
  shouldForwardProp: (prop) => prop !== 'isOpen',
})`
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: fixed;
  top: 50px; /* Alkaa menupalkin alapuolelta */
  left: 0;
  width: 250px;
  height: calc(100% - 50px); /* Korkeus suhteutettu menupalkkiin */
  background-color: white;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
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

const CloseButtonXYZ = styled.div`
  padding: 10px;
  text-align: right;
  cursor: pointer;
  background-color: white;
`;

const Menu = ({ onDatabaseCleared, isOpen, onToggleMenu }) => {
  const handleDeleteDatabase = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete the database? This action cannot be undone.');
    if (confirmDelete) {
      await clearDB();
      alert('Database cleared');
      onDatabaseCleared();
    }
    onToggleMenu(false); // Suljetaan menu joka tapauksessa
  };

  const toggleMenu = () => {    
    onToggleMenu(!isOpen);
  };

  return (
    <>
      <MenuContainer>
        <MenuIcon onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </MenuIcon>
      </MenuContainer>
      <MenuOverlay isOpen={isOpen} onClick={toggleMenu} />
      <MenuList isOpen={isOpen}>
        <CloseButtonComponent onClick={toggleMenu}/>
        <MenuItem onClick={handleDeleteDatabase}>Delete Database</MenuItem>
        <MenuItem>Test Menu Item</MenuItem>
        <MenuItem>Test Menu Item 2</MenuItem>
      </MenuList>
    </>
  );
};

export default Menu;
