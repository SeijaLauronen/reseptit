import styled from 'styled-components';

const StickyBottom = styled.div`
  position: fixed;
  bottom: 58px; /* Position above the footer */
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #ffffc4;//#f0f5ed;/*#ffffe0;*/ /*#f8f8f8;*/
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  box-sizing: border-box; /* Ensure padding is included in width */
  overflow-x: auto; /* Enable horizontal scrolling if needed */
`;

export default StickyBottom;