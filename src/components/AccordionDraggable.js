import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DraggableArea from './DraggableArea';
import { IconContainer, IconWrapper } from './Container';

const AccordionWrapper = styled.div`
  margin-bottom: 6px;
  border: 2px solid #ccc;
  border-radius: 4px;  
`;

const AccordionTitle = styled.div`
  padding: 6px 0px 6px 6px;
  cursor: pointer;
  //background-color: #f7f7f7;
  //background-color:rgb(243, 243, 217);
  //background-color: lightcyan;
  //: #edfcfc;
  //background-color: #f7fafc;
  background-color: #f5fdff; //hento sininen
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  // Tämä katkaisee kesken sanan:
  // word-wrap: break-word; // että teksti jakaantuu riveille eikä ylitä leveyttä
  //word-break: break-all; // että teksti jakaantuu riveille eikä ylitä leveyttä 
  // Tekstin rivittymisen asetukset paremmin:
  overflow-wrap: break-word; // Mieluummin katkaisee sanojen välistä
  word-break: break-word; // Katkaisee sanan keskeltä vain tarvittaessa

//box-shadow: [x-offset] [y-offset] [blur-radius] [spread-radius] [color] [inset];
  box-shadow: 
    inset 0 4px 6px rgba(0, 0, 0, 0.1),  /* Sisäinen yleinen varjo */
    inset 0 1px 3px rgba(0, 0, 0, 0.08); /* Sisäinen hieno varjo */   
`;

const AccordionContent = styled.div`
  padding: 10px;
  //background-color: #fff;
  //background-color: lightcyan;
  //background-color: #edfcfc;
  background-color: #f7fafc;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};

  box-shadow: 
    inset 0 -4px 6px rgba(0, 0, 0, 0.1),  /* Sisäinen yleinen varjo alareunaan */
    inset 0 -1px 3px rgba(0, 0, 0, 0.08); /* Sisäinen hieno varjo alareunaan */
`;

const AccordionDraggable = ({
    item,
    index,
    children,
    isDroppable = false, // Toggle droppable behavior
    droppableId,
    onDragEnd,
    title,
    icons,
    isExpanded, // Ulkoinen tila
    defaultExpanded = false, // Alkuperäinen tila, jos isExpandedia ei anneta
    onToggle, // Lisätty onToggle-proppi
}) => {
    //const [isOpen, setIsOpen] = useState(defaultExpanded);
    const [isOpen, setIsOpen] = useState(isExpanded ?? defaultExpanded);

    //const toggleAccordion = () => setIsOpen(!isOpen);
    const toggleAccordion = () => {
        const newIsOpen = !isOpen;
        setIsOpen(newIsOpen);

        // Ilmoita tilan muutoksesta vanhemmalle komponentille
        if (onToggle) {
            onToggle(newIsOpen);
            //console.log('AccordionDraggable: onToggle', newIsOpen);
        }
    };

    // Päivitä tila, jos isExpanded muuttuu
    useEffect(() => {
        if (isExpanded !== undefined) {
            setIsOpen(isExpanded);
        }
    }, [isExpanded]);

    return (
        <Draggable key={item.id.toString()} draggableId={item.id.toString()} index={index}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps} >
                    <AccordionWrapper>
                        <AccordionTitle>
                            <DraggableArea className='DraggableArea' {...provided.dragHandleProps}>
                                <span>{title || item.name}</span>
                            </DraggableArea>
                            <IconContainer className='IconContainer'>
                                {icons && <>{icons}</>}
                                <IconWrapper className='IconWrapper'>
                                    <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} onClick={toggleAccordion} />
                                </IconWrapper>
                            </IconContainer>
                        </AccordionTitle>
                        <AccordionContent $isOpen={isOpen}>
                            {isDroppable && droppableId ? (
                                <Droppable droppableId={droppableId}>
                                    {(provided) => (
                                        <div {...provided.droppableProps} ref={provided.innerRef}>
                                            {children}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            ) : (
                                children
                            )}
                        </AccordionContent>

                    </AccordionWrapper>
                </div>
            )}
        </Draggable>
    );
};

export default AccordionDraggable;

