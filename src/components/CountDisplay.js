import styled from 'styled-components';

export const CountDisplay = styled.span`
  min-width: 10px;
  text-align: right;
  display: inline-block;
  color: ${({ isFiltered }) => (isFiltered ? 'black' : 'transparent')};
`;