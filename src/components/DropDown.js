import styled from 'styled-components';

export const DropdownWrapper = styled.div`
  position: relative;
  display: inline-block;
  //width: 80px; // Onko tarpeen?
  width: 150;
  margin-left: 5px;
`;

export const DropdownButton = styled.div`
  border: 1px solid #ccc;
  padding: 0px 30px 0px 0px;
  cursor: pointer;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  &::after {
  content: '▼';
  font-size: 0.8em;
  color: #666;
  position: absolute;
  right: 10px;
  pointer-events: none;
}
`;

export const SelectedItem = styled.div`
  display: flex;
  align-items: center;
`;


export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  border: 1px solid #ccc;
  background-color: white;
  z-index: 1000;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;
