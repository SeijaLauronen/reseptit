import styled from 'styled-components';

const HeaderContainer = styled.div`
    position: fixed;
    top: 52px;
    left: 0;
    width: -webkit-fill-available;
    //width: 100%; // Korjattu leveyden määrittely
    background-color: #f0f5ed;
    //background-color: white;
    padding: 6px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;
`;

export default HeaderContainer;

export const HeaderInput = styled.input`
    //
    //width: 100%; // Korjattu leveyden määrittely
    width: -webkit-fill-available;
    padding-left: 10px;
    padding-top: 5px;
    padding-bottom: 5px;        
`;
