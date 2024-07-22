import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { CloseButtonComponent, MenuHelpButton } from './Button';
import Info from './Info';
import { GroupRight } from './Container';
import DataManagement from '../DataManagement';

const programVersion = '2024-07-22: 1.176';

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

  display: flex;
  justify-content: space-between;
  align-items: center;

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

const MenuItemText = styled.div`  
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  text-decoration: none;
  color: black;
  border-bottom: 1px solid #ddd;
`;

const MenuIcon = styled.div`
  cursor: pointer;
  color: white;
  font-size: 24px;
`;

const ChevronIcon = () => {
  return <FontAwesomeIcon icon={faChevronRight} size="xs" />
};


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
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [dataManagementAction, setDataManagementAction] = useState('');

  //TODO INFO ei tällä hetkellä käytössä, mutta jätetään se vielä
  const handleOpenInfo = (message) => {
    setInfoMessage(message);
    setIsInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

  const toggleMenu = () => {    
    onToggleMenu(!isOpen);
  };

  const handleOpenDataManagement = (action) => {
    setShowDataManagement(true);
    setDataManagementAction(action);
    //onToggleMenu(false); // Suljetaan menu kun data management aukeaa
  };

  const handleCloseDataManagement = (refresh) => {
    setShowDataManagement(false);
    setDataManagementAction('');    
    
    if (refresh) {         
      onDatabaseCleared(); // refresh kutsu App.js:lle
      onToggleMenu(false);
    }
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
        <MenuHeader>Toiminnot</MenuHeader>        
        <MenuItem onClick={() => handleOpenDataManagement('load')}>Lataa esimerkkiaineisto<ChevronIcon/></MenuItem>
        <MenuItem onClick={() => handleOpenDataManagement('export')}>Varmuuskopioi / Vie tiedot<ChevronIcon/></MenuItem>
        <MenuItem onClick={() => handleOpenDataManagement('import')}>Palauta / Tuo tiedot<ChevronIcon/></MenuItem>                
        <MenuItem onClick={() => handleOpenDataManagement('delete')}>Poista tiedot<ChevronIcon/></MenuItem>
        <MenuHeader>Tietoja</MenuHeader>  
        <MenuItemText>Sovellus: Ostokset</MenuItemText>
        <MenuItemText>Versio: {programVersion}</MenuItemText>
      </MenuList>
      <Info isOpen={isInfoOpen} onCancel={handleCloseInfo}>
        {infoMessage}
      </Info>
      <DataManagement 
        isOpen={showDataManagement}  
        action={dataManagementAction} 
        onClose={handleCloseDataManagement} 
      />

    </>
  );
};

export default Menu;
