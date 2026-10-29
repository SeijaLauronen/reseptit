import React from 'react';
import styled from 'styled-components';
import { useSettings } from '../SettingsContext';

//#ffffc4 vaalea keltainen
//#e1f5eb vaalea vihreä
//#673ab7 violetti

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
  padding-right: 10px;
  padding-left: 10px;
`;

const FooterScrollHint = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 10px;
  pointer-events: none;
  background: linear-gradient(
    to right,
    rgba(103, 58, 183, 0),
    #673ab7
  );  
`;

const FooterScrollHintLeft = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  width: 10px;
  pointer-events: none;
  background: linear-gradient(
    to left,
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
  padding: 8px 10px;
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
    padding: 5px 8px;
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

        <FooterButton
          onClick={() => setView('recipes')}
          $isActive={currentView === 'recipes'}
          $isDayPlanEnabled={dayPlanEnabled}
        >
          Reseptit
        </FooterButton>

        {dayPlanEnabled &&
          <FooterButton
            onClick={() => setView('days')}
            $isActive={currentView === 'days'}
            $isDayPlanEnabled={dayPlanEnabled}
          >
            Päiväsuunnitelmat
          </FooterButton>
        }

      </FooterScroll>
      <FooterScrollHintLeft />
      <FooterScrollHint />
    </FooterContainer>
  );
};

export default Footer;
