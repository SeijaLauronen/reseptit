import React, { useState } from 'react';
import styled from 'styled-components';

const AccordionSection = styled.div`
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
`;

const AccordionTitle = styled.div`
  padding: 10px;
  background-color: #e2e2e2;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AccordionContent = styled.div`
  padding: 10px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`;

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <AccordionSection>
      <AccordionTitle onClick={toggleAccordion}>
        <span>{title}</span>
        <span>{isOpen ? '-' : '+'}</span>
      </AccordionTitle>
      <AccordionContent isOpen={isOpen}>
        {children}
      </AccordionContent>
    </AccordionSection>
  );
};

export default Accordion;
