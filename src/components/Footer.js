import React from 'react';
import styled from 'styled-components';
import { useSettings } from '../SettingsContext';

//#ffffc4 vaalea keltainen
//#e1f5eb vaalea vihreä
//#673ab7 violetti

const FooterContainerX = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #673ab7; // violetti 
  color: #fff;
  display: flex;
  justify-content: space-around;
  padding: 10px 0px;
  height: 40px; 
`;

const FooterButtonX = styled.button`
  cursor: pointer;
  background: ${({ $isActive }) => ($isActive ? '#e1f5eb' : '#673ab7')}; 
  color: ${({ $isActive }) => ($isActive ? '#000000' : '#fff')};  
  border: solid #fff;
  border-radius: 20px;
  //padding: 3px 25px; // 3 painiketta
  //padding: 3px 15px; // 4 painiketta
  padding: ${({ $isDayPlanEnabled }) => ($isDayPlanEnabled ? '3px 15px' : '3px 25px')}; 
  font-size: 14px;
  transition: background 0.3s, color 0.3s;
  user-select: none;

  &:hover {
    background: #e1f5eb;
    color: #673ab7;
  }

  @media (max-width: 350px) {
    padding: 3px 10px;
  }
`;

const FooterContainerY = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #673ab7;
  color: #fff;
  display: flex;
  align-items: center;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 10px 0;
  height: 40px;
  -webkit-overflow-scrolling: touch;
`;

const FooterButtonY = styled.button`
  flex: 0 0 auto;
  cursor: pointer;
  background: ${({ $isActive }) => ($isActive ? '#e1f5eb' : '#673ab7')};
  color: ${({ $isActive }) => ($isActive ? '#000000' : '#fff')};
  border: solid #fff;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  transition: background 0.3s, color 0.3s;
  user-select: none;
  white-space: nowrap;
  margin: 0 2px; /* Add some horizontal spacing between buttons */

  &:hover {
    background: #e1f5eb;
    color: #673ab7;
  }

  @media (max-width: 350px) {
    padding: 5px 15px;
  }
`;


const FooterContainer = styled.div`
  position: fixed;
  isolation: isolate;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background: #673ab7;
  color: #fff;
  height: 60px;
  overflow: hidden;
  display: flex;
  align-items: center;
  
`;

const FooterScroll = styled.div`

  display: flex;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  gap: 4px;
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
  padding: 0 0 0 0px;
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;

  /* Varaa näkyviin pieni osa seuraavasta painikkeesta */
  padding-right: 20px;
  padding-left: 20px;
`;

const FooterScrollHint = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 28px;
  pointer-events: none;
  background: linear-gradient(
    to right,
    rgba(103, 58, 183, 0),
    #673ab7
  );
`;

const FooterButton = styled.button`
  flex: 0 0 auto;
  cursor: pointer;
  background: ${({ $isActive }) =>
    $isActive ? '#e1f5eb' : '#673ab7'};
  color: ${({ $isActive }) =>
    $isActive ? '#000000' : '#fff'};
  border: 3px solid #fff;
  border-radius: 20px;
  padding: 8px 15px;
  font-size: 14px;
  transition: background 0.3s, color 0.3s;
  user-select: none;
  white-space: nowrap;
  margin: 0;



  &:hover {
    background: #e1f5eb;
    color: #673ab7;
  }

  @media (max-width: 350px) {
    padding: 5px 10px;
  }
`;





const Footer = ({ setView, currentView, selectedCategoryId }) => {
  const { dayPlanEnabled } = useSettings();
  return (
    <FooterContainer className="footer-container">
      <FooterScroll className="footer-scroll">
        <FooterButton
          onClick={() => setView('categories')}
          $isActive={currentView === 'categories'}
          $isDayPlanEnabled={dayPlanEnabled}
        >
          Kategoriat
        </FooterButton>
        <FooterButton
          onClick={() => setView('products')}
          $isActive={currentView === 'products'}
          $isDayPlanEnabled={dayPlanEnabled}
        >
          {selectedCategoryId ? 'Tuotteet ↓↑' : 'Tuotteet'}
        </FooterButton>
        <FooterButton
          onClick={() => setView('shoppingList')}
          $isActive={currentView === 'shoppingList'}
          $isDayPlanEnabled={dayPlanEnabled}
        >
          Ostoslista
        </FooterButton>

        {dayPlanEnabled &&
          <FooterButton
            onClick={() => setView('days')}
            $isActive={currentView === 'days'}
            $isDayPlanEnabled={dayPlanEnabled}
          >
            Päivät
          </FooterButton>
        }

        <FooterButton
          onClick={() => setView('recipes')}
          $isActive={currentView === 'recipes'}
          $isDayPlanEnabled={dayPlanEnabled}
        >
          Reseptit
        </FooterButton>
      </FooterScroll>
      <FooterScrollHint />
    </FooterContainer>
  );
};

export default Footer;
