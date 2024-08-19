import styled from 'styled-components';
//#ffffc4 vaalea keltainen
//#e1f5eb vaalea vihreä
//#673ab7 violetti
//#daf7f7 vaalea turkoosi

const StickyBottom = styled.div`
  position: fixed;
  bottom: 58px; /* Position above the footer */
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #e1f5eb;
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  box-sizing: border-box; /* Ensure padding is included in width */
  overflow-x: auto; /* Enable horizontal scrolling if needed */
`;

export default StickyBottom;