import React, { useState } from 'react';
import styled from 'styled-components';

const AccordionWrapper = styled.div`
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AccordionTitle = styled.div`
  padding: 10px;
  cursor: pointer;
  background-color: #f7f7f7;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-wrap: break-word;
  word-break: break-all;
`;

// transientti props $isOpen, koska styled komponentti ja isJotain
const AccordionContent = styled.div`
  padding: 10px;
  background-color: #fff;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

const Accordion = ({ title, children, defaultExpanded = false }) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionWrapper>
      <AccordionTitle onClick={toggleAccordion}>
        {title}
        <span>{isOpen ? '-' : '+'}</span>
      </AccordionTitle>
      <AccordionContent $isOpen={isOpen}>{children}</AccordionContent>
    </AccordionWrapper>
  );
};

export default Accordion;
