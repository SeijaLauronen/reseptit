import React, { useState, useEffect, forwardRef } from 'react';
import MyErrorBoundary from './components/ErrorBoundary';
import { TopContainer } from './components/Container';
import { AddButton, CloseButtonComponent, CancelButton } from './components/Button';
import InputAdd from './components/Input';
import Toast from './components/Toast';
import { getProductclasses, addProductclass, deleteProductclass, updateProductclass } from './controller';
import { ButtonGroup, GroupRight, GroupLeft, ScrollableFormContainer } from './components/Container';
import { FaTrash } from 'react-icons/fa';
import { ProductClassItemGrabbable } from './components/Item';
import { IconContainer, IconWrapper } from './components/Container';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Accordion from './components/Accordion';


const ProductClassManagement = ({ refresh = false, isOpen, onClose }) => {


    const [error, setError] = useState(''); // Paikallinen virhetila 
    const [newProductClass, setNewProductClass] = useState('');
    const [productClasses, setProductClasses] = useState([]);

    const fetchAndSetProductClasses = async () => {
        try {
            const allProductClasses = await getProductclasses();
            setProductClasses(allProductClasses);
        } catch (err) {
            setError(err.message);
        }
    };

    //Todo tarkista, ettei nimi ole tyhjä
    const handleUpdateProductClass = async (productClass, name) => {
        //productClass.name = name; // Ei näin, vaan näin:
        const updatedProductClass = { ...productClass };
        updatedProductClass.name = name;
        try {
            await updateProductclass(updatedProductClass.id, updatedProductClass);
            fetchAndSetProductClasses();
        } catch (err) {
            setError(err.message);
        }
    };

    /*
    input-kentissä fokus karkaa jokaisen näppäinpainalluksen jälkeen, koska onChange-käsittelijä päivittää tilan,
     mikä johtaa komponentin uudelleenrenderöintiin. Tällöin React luo uusia input-elementtejä, jotka eivät säilytä aiempaa fokustaan. 
    */
    const ProductClassItemNOK = ({ productClass, onDelete }) => {
        return (
            <ProductClassItemGrabbable>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.5rem 0' }}>

                    <input
                        type="text"
                        value={productClass.name}
                        onChange={(e) => handleUpdateProductClass(productClass, e.target.value)}
                        style={{ flex: 1, marginRight: '1rem' }}
                    />
                    <GroupRight>
                        <button onClick={() => onDelete(productClass.id)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            <FaTrash color="red" />
                        </button>
                    </GroupRight>

                </div>
            </ProductClassItemGrabbable>
        );
    };

    //const ProductClassItem = ({ productClass, onDelete }) => {
    const ProductClassItem = forwardRef(({ productClass, onDelete, ...props }, ref) => {
        const [localName, setLocalName] = useState(productClass.name); //Tällä varmistetaan, että input-kenttä ei renderöidy uudelleen aina, kun productClasses-tila päivittyy.
        const handleBlur = () => {
            if (localName.trim() === '') {
                setLocalName(productClass.name); // Palauta alkuperäinen nimi
                setError('Tuoteluokan nimi ei voi olla tyhjä');
                return;
            }
            if (localName !== productClass.name) {
                handleUpdateProductClass(productClass, localName);
            }
        };
        return (
            <ProductClassItemGrabbable className='ProductClassItemGrabbable'
                ref={ref}
                {...props}

            >

                <input
                    type="text"
                    value={localName}
                    onChange={(e) => setLocalName(e.target.value)}
                    onBlur={handleBlur}
                />
                <div>
                    <IconContainer>
                        <IconWrapper onClick={() => onDelete(productClass.id)}>
                            <FaTrash color="red" />
                        </IconWrapper>
                    </IconContainer>
                </div>

            </ProductClassItemGrabbable>
        );
    });


    useEffect(() => {
        fetchAndSetProductClasses();
    }, [refresh]); //TODO Tuleeko tuo refresh tänne, ja tarvitseeko...


    useEffect(() => {
        if (isOpen) {
            setError('');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleClose = () => {
        onClose(false); // TODO
    }


    const handleDeleteProductClass = async (id) => {
        // setProductClasses((prev) => prev.filter((pc) => pc.id !== id)); // Tämä poistaisi näytöltä
        // TODO: Lisää palvelinpuolen poistologiikka
        try {
            await deleteProductclass(id);
            fetchAndSetProductClasses();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleAddProductClass = async () => {
        if (!newProductClass) {
            setError('Tuoteluokka ei voi olla tyhjä');
            return;
        }
        try {
            const newOrder = productClasses.length ? Math.max(...productClasses.map(cat => cat.order)) + 1 : 1;
            await addProductclass({ name: newProductClass, order: newOrder });
            setNewProductClass('');
            fetchAndSetProductClasses();
        } catch (err) {
            setError(err.message);
        }

    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const reorderedProductClasses = Array.from(productClasses);
        const [removed] = reorderedProductClasses.splice(result.source.index, 1);
        reorderedProductClasses.splice(result.destination.index, 0, removed);

        setProductClasses(reorderedProductClasses);

        try {
            // Päivitetään järjestys tietokantaan
            for (let i = 0; i < reorderedProductClasses.length; i++) {
                reorderedProductClasses[i].order = i + 1; // Päivitetään order kenttä
                await updateProductclass(reorderedProductClasses[i].id, reorderedProductClasses[i]);
            }
        } catch (err) {
            setError(err.message);
        }
    };


    return (

        <MyErrorBoundary>

            {error && (
                <Toast message={error} onClose={() => setError('')} />
            )}

            <TopContainer $isOpen={isOpen}>

                <CloseButtonComponent onClick={handleClose} />


                <h4>Tuoteluokkien määrittely</h4>
                <Accordion title={"Näytä / sulje ohje..."} defaultExpanded={false} accordionmini={true}>

                    Voit määritellä tuoteluokkia, esimerkiksi proteiinit, kasvikset, rasvat jne.
                    Tiedot tallentuvat välittömästi ilman erillistä tallentamista.
                    Nimeä voit muokata suoraan tekstikentässä.

                </Accordion>

                <ScrollableFormContainer style={{ padding: '2px 20px', maxHeight: '40vh' }}>

                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="droppable-productClasses">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef}>
                                    {productClasses.map((productClass, index) => (
                                        <Draggable key={productClass.id.toString()} draggableId={productClass.id.toString()} index={index}>
                                            {(provided) => (
                                                <ProductClassItem
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    key={productClass.id}
                                                    productClass={productClass}
                                                    onDelete={handleDeleteProductClass}
                                                >
                                                </ProductClassItem>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>

                </ScrollableFormContainer>

                <ButtonGroup>
                    <InputAdd
                        type="text"
                        value={newProductClass}
                        onChange={(e) => setNewProductClass(e.target.value)}
                        placeholder="Uusi tuoteluokka"
                    />
                    <AddButton onClick={handleAddProductClass} />
                </ButtonGroup>
                <ButtonGroup>
                    <GroupLeft>
                    </GroupLeft>
                    <GroupRight>
                        <CancelButton onClick={handleClose}>Sulje</CancelButton>
                    </GroupRight>
                </ButtonGroup>


            </TopContainer>
        </MyErrorBoundary>
    );
};

export default ProductClassManagement;