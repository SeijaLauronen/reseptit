import styled from 'styled-components';

export const CountDisplay = styled.span`
  min-width: 20px;
  text-align: right;
  display: inline-block;
  color: ${({ $isFiltered }) => ($isFiltered ? 'black' : 'transparent')};
  font-size: 12px;
  margin-top: 2px;
  margin-left: 4px;
  font-weight: bold;
`;