import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { clearDB } from '../database';

const MenuButton = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  background: none;
  border: none;
  cursor: pointer;
`;

const MenuContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${props => (props.open ? '0' : '-250px')};
  width: 250px;
  height: 100%;
  background: #333;
  color: #fff;
  transition: left 0.3s ease;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const MenuItem = styled.div`
  margin: 10px 0;
  cursor: pointer;
`;

const Menu = () => {
  const [open, setOpen] = useState(false);

  const handleClearDB = async () => {
    await clearDB();
    alert('Tietokanta tyhjennetty');
  };

  return (
    <>
      <MenuButton onClick={() => setOpen(!open)}>
        <FontAwesomeIcon icon={faBars} size="2x" />
      </MenuButton>
      <MenuContainer open={open}>
        <MenuItem onClick={handleClearDB}>Tyhjennä tietokanta</MenuItem>
        {/* Lisää muita menuvalintoja */}
      </MenuContainer>
    </>
  );
};

export default Menu;
