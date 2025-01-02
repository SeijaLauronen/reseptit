import React from 'react';
import styled from 'styled-components';
import { useSettings } from '../SettingsContext';

//#ffffc4 vaalea keltainen
//#e1f5eb vaalea vihreä
//#673ab7 violetti

const FooterContainer = styled.div`
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

const FooterButton = styled.button`
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

const Footer = ({ setView, currentView }) => {
  const { dayPlanEnabled } = useSettings();  
  return (
    <FooterContainer>
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
        Tuotteet
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

    </FooterContainer>
  );
};

export default Footer;
