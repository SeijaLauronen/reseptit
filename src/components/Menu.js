import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronRight, faExclamation } from '@fortawesome/free-solid-svg-icons';
import { CloseButtonComponent, MenuHelpButton, MenuWarningButton } from './Button';
import Info from './Info';
import { GroupLeft, GroupRight } from './Container';
import DataManagement from '../DataManagement';
import { getBrowserName } from '../utils/browserUtils';
import DeviceInfo from './DeviceInfo';
import StorageInfo from './StorageInfo';
import { useSettings } from '../SettingsContext';
import SwitchButtonComponent from './SwitchButtonCompnent';
import ColorManagement from '../ColorManagement';
import SettingsManagement from '../SettingsManagement';
import ProductClassManagement from '../ProductClassManagement';
import useStorageEstimate from '../hooks/useStorageEstimate';

const programVersion = '2025-12-29: 2.351';

//päivitä versiohistoria myös tänne, huom, vain ostokseni-sovelluksen!:
//https://github.com/SeijaLauronen/SeijaLauronen.github.io/blob/main/ostokseniversio.html
//https://seijalauronen.github.io/ostokseniversio.html

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
  /*height: calc(100% - 50px);*/ /* Korkeus suhteutettu menupalkkiin */
  max-height: calc(100% - 50px); /* Varmistaa, että menu ei mene yli */
  background-color: white;
  overflow-y: auto; /* Lisää vierityspalkin, jos sisältö ylittää korkeuden */
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
  margin-right: 15px;
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
  const { percentageUsed, supported, isPersistent } = useStorageEstimate();

  const { colorCodingEnabled, toggleColorCoding } = useSettings();
  const { dayPlanEnabled, toggleDayPlanEnabled } = useSettings();

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  //const [infoMessage, setInfoMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState(null);
  const [showDataManagement, setShowDataManagement] = useState(false);
  const [dataManagementAction, setDataManagementAction] = useState('');
  const [showColorManagement, setShowColorManagement] = useState(false);
  const [showProductClassManagement, setShowProductClassManagement] = useState(false);
  const [showSettingsManagement, setShowSettingsManagement] = useState(false);

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

  const handleOpenColorManagement = () => {
    setShowColorManagement(true);
  };

  const handleCloseColorManagement = (refresh) => {

    setShowColorManagement(false);
    //Todo onkohan refresh tarpeen
    if (refresh) {
      onDatabaseCleared(); // refresh kutsu App.js:lle
      onToggleMenu(false);
    }

  };

  const handleOpenSettingsManagement = () => {
    setShowSettingsManagement(true);
  };

  const handleCloseSettingsManagement = (refresh) => {
    setShowSettingsManagement(false);
    //Todo onkohan refresh tarpeen
    if (refresh) {
      onDatabaseCleared(); // refresh kutsu App.js:lle
      onToggleMenu(false);
    }
  }

  const handleOpenProductClassManagement = () => {
    setShowProductClassManagement(true);
  }

  const handleCloseProductClassManagement = (refresh) => {
    setShowProductClassManagement(false);
    //Todo onkohan refresh tarpeen
    if (refresh) {
      onDatabaseCleared(); // refresh kutsu App.js:lle
      onToggleMenu(false);
    }
  }

  const StorageWarning = () => {
    //console.log('percentageUsed', percentageUsed);
    return supported ? (
      <>
        {percentageUsed > 90 && (
          <MenuWarningButton onClick={() => handleOpenInfo(<StorageInfo />)} />
        )}
        {!isPersistent && (
          <MenuWarningButton
            icon={faExclamation}
            $bcolor="#007BFF"
            $hcolor="#0056b3"
            defaultText=""
            onClick={() => handleOpenInfo(<StorageInfo />)}
          />
        )}
      </>
    ) : (
      <MenuWarningButton
        icon={faExclamation}
        $bcolor="#007BFF"
        $hcolor="#0056b3"
        defaultText=""
        onClick={() => handleOpenInfo(<StorageInfo />)}
      />
    );
  };



  // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle, esim $isOpen
  // tai käytetään pieniä kirjaimia kuten fillspace eikä fillSpace
  return (
    <>
      <MenuContainer className='MenuContainer'>

        <MenuIcon onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </MenuIcon>
        <GroupLeft><StorageWarning /></GroupLeft>
        <GroupRight><MenuHelpButton onClick={onOpenInfo} /> </GroupRight>
      </MenuContainer>
      <MenuOverlay $isOpen={isOpen} onClick={toggleMenu} className='MenuOverlay' />
      <MenuList $isOpen={isOpen} className='MenuList'>
        <CloseButtonComponent onClick={toggleMenu} />
        <MenuHeader>Toiminnot</MenuHeader>
        <MenuItem onClick={() => handleOpenDataManagement('load')}>Lataa esimerkkiaineisto<ChevronIcon /></MenuItem>
        <MenuItem onClick={() => handleOpenDataManagement('export')}>Varmuuskopioi / Vie tiedot<ChevronIcon /></MenuItem>
        <MenuItem onClick={() => handleOpenDataManagement('import')}>Palauta / Tuo tiedot<ChevronIcon /></MenuItem>
        <MenuItem onClick={() => handleOpenDataManagement('delete')}>Poista tiedot<ChevronIcon /></MenuItem>
        <MenuHeader>Asetukset</MenuHeader>
        <MenuItemText>
          <label>
            Päiväsuunnitelma käytössä
          </label>
          <SwitchButtonComponent
            checked={dayPlanEnabled}
            onChange={toggleDayPlanEnabled}
          />
        </MenuItemText>
        <MenuItemText>
          <label>
            Värikoodit käytössä
          </label>
          <SwitchButtonComponent
            checked={colorCodingEnabled}
            onChange={toggleColorCoding}
          /*
          onColor="#00ff00"
          offColor="#ff0000"
          onHandleColor="#0000ff"
          offHandleColor="#ffffff"
          */
          />
        </MenuItemText>
        <MenuItem onClick={() => handleOpenColorManagement()}>Värien määrittely<ChevronIcon /></MenuItem>
        <MenuItem onClick={() => handleOpenProductClassManagement()}>Tuoteluokkien määrittely<ChevronIcon /></MenuItem>
        <MenuItem onClick={() => handleOpenSettingsManagement()}>Yleiset määrittelyt<ChevronIcon /></MenuItem>
        <MenuHeader>Tietoja</MenuHeader>
        <MenuItemText>Sovellus: Ostokset</MenuItemText>
        <MenuItem
          onClick={() => handleOpenInfo(
            <>
              <div>Täältä näet viimeisimmän version sovelluksesta ja versiohistorian. Tähän tarvitset nettiyhteyden.</div>
              <div>https://seijalauronen.github.io/ostokseniversio.html</div>
              <br />
              <a href="https://seijalauronen.github.io/ostokseniversio.html" target="_blank" rel="noopener noreferrer">Näytä versiohistoria</a>
            </>
          )}
        >Versio: {programVersion}  <ChevronIcon /></MenuItem>

        <MenuItem onClick={() => handleOpenInfo(<DeviceInfo></DeviceInfo>)}>Selaimesi: {getBrowserName()} <ChevronIcon /></MenuItem>
        <MenuItem onClick={() => handleOpenInfo(<StorageInfo></StorageInfo>)}>Tallennustila<ChevronIcon /></MenuItem>
        <MenuHeader></MenuHeader>
      </MenuList>




      <Info isOpen={isInfoOpen} onCancel={handleCloseInfo}>
        {infoMessage}
      </Info>


      <DataManagement
        isOpen={showDataManagement}
        action={dataManagementAction}
        onClose={handleCloseDataManagement}
      />

      <ColorManagement
        isOpen={showColorManagement}
        onClose={handleCloseColorManagement}
      />

      {/* Drag ja Drop ei onnistunut SlideIn Containerin kanssa, koska siinä on transform, siksi tehdään tämä eri lailla */}
      {showProductClassManagement && (
        <ProductClassManagement
          isOpen={showProductClassManagement}
          onClose={handleCloseProductClassManagement}
        />
      )}

      <SettingsManagement
        isOpen={showSettingsManagement}
        onClose={handleCloseSettingsManagement}
      />

    </>
  );
};

export default Menu;
