import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { CloseButtonComponent, DeleteButton, HelpButton, MenuHelpButton, PrimaryButton } from './Button';
import { clearDB } from '../database';
import Info from './Info';
import { ButtonGroup, GroupLeft, GroupRight } from './Container';
import helpTexts from '../helpTexts';

const programVersion = '2024-07-17: 159';

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
  border-bottom: 1px solid #ddd;

  &:hover {
    background-color: #ddd;
  }

  &:last-child {
    border-bottom: none;
  }

`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: white;
  font-size: 24px;
`;


const MenuHeader = styled.h3`
  padding: 10px;
  margin: 0;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

//Huom tähän ei transienttia $isOpenia, koska ei ole styled komponentti
const Menu = ({ onDatabaseCleared, isOpen, onToggleMenu, onOpenInfo }) => {

  
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');

  const handleOpenInfo = (message) => {
    setInfoMessage(message);
    setIsInfoOpen(true);
  };

  const handleDeleteDatabase = async () => {
    const confirmDelete = window.confirm('Haluatko varmasti poistaa kaikki sovelluksen tiedot?');
    if (confirmDelete) {
      await clearDB();
      handleOpenInfo('Tiedot poistettu');
      onDatabaseCleared();
    }
    onToggleMenu(false); // Suljetaan menu joka tapauksessa
  };

  const toggleMenu = () => {    
    onToggleMenu(!isOpen);
  };


  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

 
  // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle, esim $isOpen
  // tai käytetään pieniä kirjaimia kuten fillspace eikä fillSpace
  return (
    <>
      <MenuContainer>
        <MenuIcon onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </MenuIcon> 
        <GroupRight><MenuHelpButton onClick={onOpenInfo}/> </GroupRight>       
      </MenuContainer>
      <MenuOverlay $isOpen={isOpen} onClick={toggleMenu} />
      <MenuList $isOpen={isOpen}>
        <CloseButtonComponent onClick={toggleMenu}/>
        <MenuItem></MenuItem>
        <MenuHeader>Toiminnot</MenuHeader>
        <MenuItem>
          <ButtonGroup>
            <GroupLeft fillspace = 'true'>
              <DeleteButton fullwidth = 'true' onClick={handleDeleteDatabase}>            
              Poista tiedot...
              </DeleteButton>
            </GroupLeft>
            <GroupRight>
              <HelpButton onClick={() => handleOpenInfo(helpTexts['deleteDB'])}/>     
            </GroupRight>
          </ButtonGroup>    
          </MenuItem>
        <MenuItem> 
          <PrimaryButton fullwidth = 'true' onClick={() => handleOpenInfo('Ei vielä toteutettu.')}>Tuo tiedot...</PrimaryButton>            
        </MenuItem>
        <MenuItem>
          <PrimaryButton fullwidth = 'true' onClick={() => handleOpenInfo('Ei vielä toteutettu.')}>Vie tiedot...</PrimaryButton>            
        </MenuItem>   
        <MenuHeader>Tietoja</MenuHeader>     
        <MenuItem>Versio: {programVersion}</MenuItem>
      </MenuList>
      <Info isOpen={isInfoOpen} onCancel={handleCloseInfo}>
        {infoMessage}
      </Info>
    </>
  );
};

export default Menu;
