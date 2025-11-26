import styled from 'styled-components';


export const TabContainer = styled.div`
  display: flex;
  //border-bottom: 1px solid #ddd;
  border-bottom: none;
  //margin-bottom: 1rem;
  margin-bottom: 0px;
  margin-right: 5px;
  //background-color: #f8f9fa; // Tästä tulee tabin väri, joka ei ole valittuna
  background-color: #e1f5eb; // Tästä tulee tabin väri, joka ei ole valittuna
  border-radius: 4px 4px 0 0;
  width: 100%; /* Täyttää koko leveyden */
  //background-color: transparent; /* Tausta on nyt DayTabRow:ssa */
  
`;

export const Tab = styled.button`
  padding: 12px 24px;
  border: none;
  //background: ${props => props.$active ? '#007bff' : 'transparent'};
  //background: ${props => props.$active ? '#007bff' : 'white'}; // #fdfdf1ff; // hyvin vaalea keltainen
  background: ${props => props.$active ? '#fdfdf1ff' : '#e9ecef'};
  //color: ${props => props.$active ? 'white' : '#666'};
//   color: ${props => props.$active ? 'black' : '#666'};
  color: 'black';
  cursor: pointer;
  box-shadow: 2px 0px 8px rgba(0, 0, 0, 0.2);
  border-radius: 12px 12px 0 0;
  margin-right: 1px;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  transition: all 0.2s ease-in-out;
  position: relative;
  
  &:hover {
    //background: ${props => props.$active ? '#0056b3' : '#e9ecef'};
    //color: ${props => props.$active ? 'white' : '#333'};
  }
  
  &:focus {
    //outline: none;
    //box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  // Aktiivisen tabin alareunan indikaattori
  &::after {
    /*
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => props.$active ? '#007bff' : 'transparent'};
    border-radius: 2px 2px 0 0;
    */
  }
`;

// Vaihtoehtoinen malli pyöristetyillä tab-eilla
export const RoundedTabContainer = styled(TabContainer)`
  border-bottom: none;
  background: transparent;
  gap: 4px;
`;

export const RoundedTab = styled(Tab)`
  border-radius: 20px;
  margin-right: 0;
  
  &::after {
    display: none;
  }
  
  &:hover {
    transform: ${props => props.$active ? 'none' : 'translateY(-1px)'};
  }
`;

export const StickyTabHeader = styled.div`
  position: sticky;
  top: 0;
  background: white;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

export const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
`;

export const StickyTabContainer = styled(TabContainer)`
  margin-bottom: 0;
  border-radius: 0;
  background: white;
`;


