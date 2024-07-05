import styled from 'styled-components';

const StickyTop = styled.div`
    position: fixed;
    top: 52px;
    left: 0;
    width: -webkit-fill-available;
    background-color: #f0f5ed;
    padding: 6px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 999;
`;

export default StickyTop;


