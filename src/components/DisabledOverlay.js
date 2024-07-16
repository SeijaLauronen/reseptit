import styled from "styled-components";

const DisabledOverlay = styled.div`
  pointer-events: ${({ $isDisabled }) => ($isDisabled ? 'none' : 'auto')};
  opacity: ${({ $isDisabled }) => ($isDisabled ? 0.5 : 1)};
`;

export default DisabledOverlay;