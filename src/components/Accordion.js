import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AccordionWrapper = styled.div`

  //margin-bottom: 10px;
  //margin-bottom: ${({ $accordionmini }) => '1px' || '10px'}; /* Oletusarvo 10px */ 
  margin-bottom: ${({ $accordionmini }) => ($accordionmini ? '1px' : '10px')}; /* Oletusarvo 10px */
  border: 1px solid #ccc;
  border-radius: 4px;
  max-width: 100%;  
`;

const AccordionTitle = styled.div`
  //padding: ${({ $accordionmini }) => '3px' || '10px'}; /* Oletusarvo 10px */ 
  padding: ${({ $accordionmini }) => ($accordionmini ? '3px' : '10px')}; /* Oletusarvo 10px */
  //padding: 10px;
  cursor: pointer;  
  background-color: #efefef;  // #f7f7f7;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  word-wrap: break-word;
  word-break: break-all;
  font-weight: bold;
`;

// transientti props $isOpen, koska styled komponentti ja isJotain
const AccordionContent = styled.div`  
  padding: ${({ $accordionmini }) => ($accordionmini ? '3px' : '10px')}; /* Oletusarvo 10px */
  //padding: 10px;
  background-color: #fff;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};  
`;

//Huom! ei tarvitse antaa kaikkia propseja!! Erilainen kuin funktio. Esim colorItem voi puuttua
const Accordion = ({ title, colorItem, icons, children, defaultExpanded = false, accordionmini, isOpenExternally = null }) => {
  const [isOpen, setIsOpen] = useState(defaultExpanded);

  useEffect(() => {
    if (isOpenExternally !== null) {
      //setIsOpen(isOpenExternally);
      setIsOpen(true);
    }
  }, [isOpenExternally]);


  const toggleAccordion = () => {
    // Jos accordion avattiin ulkoisesti, annetaan käyttäjän hallita TODO...
    //if (isOpenExternally === null) {
      setIsOpen(!isOpen); // Toggle manuaalisesti käyttäjän toimesta
    //}
  };

  return (
    <AccordionWrapper className='AccordionWrapper'>
      <AccordionTitle $accordionmini={accordionmini}>
        {/* $padding={titlepadding} on transientti props, joka menee styled componentille */}
        {/* Huom! titlepadding on props, joka tulee komponentille */}
        <div style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}> {/* Vie lopun käytettävissä olevan tilan, jolloin muut pysyy oikeassa laidassa*/}
          {colorItem}
          <span style={{ marginLeft: '10px' }}>{title}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>{/* Justify oikeaan reunaan */}
          {icons}
        </div>
        <span>
          <FontAwesomeIcon onClick={toggleAccordion} style={{ marginLeft: '10px' }} icon={isOpen ? faChevronUp : faChevronDown} />
        </span>
      </AccordionTitle>
      <AccordionContent $isOpen={isOpen} $accordionmini={accordionmini}>{children}</AccordionContent>
    </AccordionWrapper>
  );
};

export default Accordion;
