import styled from 'styled-components';

const StickyTop = styled.div`

    position: fixed;
    top: 52px;
    left: 0;
    background-color: #ffffc4;
    padding: 6px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;    
    width: 100%;
    box-sizing: border-box; /* Ensure padding is included in width */
    min-height: 50px;
    z-index: 999;

`;

export default StickyTop;


