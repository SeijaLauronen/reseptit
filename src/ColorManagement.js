import React, { useState, useEffect } from 'react';
import MyErrorBoundary from './components/ErrorBoundary';
import { SlideInContainerRight } from './components/Container';
import Toast from './components/Toast';
import { CloseButtonComponent, SaveButton, UndoButton } from './components/Button';
import { ColorItemSelection } from './components/ColorItem';
import { useColors } from './ColorContext';
import { InputColorShortName, InputTextArea } from './components/Input';
import { ScrollableFormContainer, ButtonGroup, GroupLeft, GroupRight, IconContainer, IconWrapper } from './components/Container';
import { CancelButton } from './components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faUndo, faChevronUp, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Accordion from './components/Accordion';
import ConfirmDialog from './components/ConfirmDialog';

const ColorManagement = ({ isOpen, onClose }) => {
    const { colors, colorDefinitions, setColorDefinition, errorState } = useColors();
    const [error, setError] = useState(''); // Paikallinen virhetila    
    const [editingColor, setEditingColor] = useState(null); // Editoitava väri
    const [tempShortName, setTempShortName] = useState(''); // Tilapäinen lyhenteen tila
    const [tempColorInfo, setTempColorInfo] = useState(''); // Tilapäinen värin selitteen tila
    const [isModified, setIsModified] = useState(false); // Seurataan, onko muutoksia tehty
    const [accordionAction, setAccordionAction] = useState(null); // Painettu värin kohdalla save tai peruuta ikonia   
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null, onCancel: null });

    //TODO Accordion ei suoraan avaudu Editillä, jos on ensin käsin suljettu, miksi...?

    useEffect(() => {
        if (errorState) {
            setError(errorState);
        }
    }, [errorState]);

    useEffect(() => {
        if (isOpen) {
            setError('');
            setEditingColor(null); // Nollataan editointi
            setIsModified(false); // Resetoidaan muutostila
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleEditColor = (colorKey, event) => {
        event.stopPropagation(); // Estetään tapahtuman eteneminen Accordionille
        setEditingColor(colorKey);
        setTempShortName(colorDefinitions[colorKey]?.shortname || ''); // Alustetaan lyhenne
        setTempColorInfo(colorDefinitions[colorKey]?.colorinfo || ''); // Alustetaan selite
        setIsModified(false); // Alustetaan muutostila  
        setAccordionAction(colorKey);
    };

    const handleSaveColor = async (colorKey, event) => {
        if (event) {
            event.stopPropagation(); // Estetään tapahtuman eteneminen Accordionille
        }
        try {
            await setColorDefinition(colorKey, { shortname: tempShortName, colorinfo: tempColorInfo });
            setEditingColor(null); // Poistutaan editointimoodista
            setIsModified(false); // Resetoidaan muutostila
        } catch (err) {
            setError(err.message);
        }
        setAccordionAction(colorKey);
    };

    const handleCancelEdit = (colorKey, event) => {
        event.stopPropagation(); // Estetään tapahtuman eteneminen Accordionille
        setEditingColor(null); // Peru editointi
        setIsModified(false); // Resetoidaan muutostila
        setAccordionAction(colorKey);
    };


    const handleClose = () => {
        if (isModified) {
            setConfirmDialog({
                isOpen: true,
                message: 'Olet tehnyt muutoksia. Haluatko tallentaa muutokset ennen sulkemista?',
                onConfirm: () => {
                    if (editingColor) {
                        handleSaveColor(editingColor);
                    }
                    setConfirmDialog({ isOpen: false, message: '', onConfirm: null, onCancel: null });
                    setEditingColor(null);
                    setIsModified(false);
                    onClose(false);

                },
                onCancel: () => {
                    setConfirmDialog({ isOpen: false, message: '', onConfirm: null, onCancel: null });
                },
            });

        } else {
            onClose(false); // Suljetaan ilman tallennusta, jos peruutetaan tai muutoksia ei ole tehty TODO Tarkista vielä, mitä tämä tekee
        }
    }

    const handleUndoConfirm = () => {
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null, onCancel: null });
        setEditingColor(null);
        setIsModified(false);
        onClose(false);
    }

    const handleFieldChange = (setter) => (e) => {
        setter(e.target.value);
        setIsModified(true); // Päivitetään muutostila
    };


    return (
        <MyErrorBoundary>
            {error && (
                <Toast message={error} onClose={() => setError('')} />
            )}

            <SlideInContainerRight $isOpen={isOpen}>
                <CloseButtonComponent onClick={handleClose} />
                <h2>Värien määrittely</h2>

                <ScrollableFormContainer>
                    {Object.keys(colors).map(colorKey => (
                        <Accordion
                            key={colorKey}
                            colorItem={
                                <ColorItemSelection
                                    className='colordefinition'
                                    color={colors[colorKey]}
                                    selected={true}
                                />
                            }
                            title={colorDefinitions[colorKey]?.shortname || ''}
                            icons={
                                <>
                                    {editingColor === null && (
                                        <IconContainer>
                                            <IconWrapper onClick={(event) => handleEditColor(colorKey, event)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </IconWrapper>
                                        </IconContainer>
                                    )}

                                    {editingColor === colorKey && (
                                        <>
                                            <IconContainer>
                                                <IconWrapper onClick={(event) => handleSaveColor(colorKey, event)}>
                                                    <FontAwesomeIcon
                                                        icon={faSave}
                                                        style={{ color: 'green' }}
                                                    />
                                                </IconWrapper>
                                                <IconWrapper onClick={(event) => handleCancelEdit(colorKey, event)}>
                                                    <FontAwesomeIcon
                                                        icon={faUndo}
                                                        style={{ color: 'blue' }}
                                                    />
                                                </IconWrapper>
                                            </IconContainer>
                                        </>
                                    )}
                                </>
                            }
                            isOpenExternally={accordionAction === colorKey || editingColor === colorKey} // Avataan Accordion kun kyseistä väriä editoidaan. TODO No tämä taas aiheuttaa sen, että sulkeutuu, kun editoitu                            
                            defaultExpanded={true}
                            disabled={editingColor !== null && editingColor !== colorKey} // Disable other accordions, TODO ei tämä tainnut toimia
                        >
                            {editingColor === colorKey ? (
                                <>
                                    <label><strong>Lyhenne:</strong></label>
                                    <InputColorShortName
                                        value={tempShortName}
                                        onChange={handleFieldChange(setTempShortName)} // Muutostilan päivitys
                                        placeholder="Lyhenne"
                                    />
                                    <br /><label><strong>Selite:</strong></label><br />
                                    <InputTextArea
                                        value={tempColorInfo}
                                        onChange={handleFieldChange(setTempColorInfo)} // Muutostilan päivitys
                                        placeholder="Selite"
                                    />
                                </>
                            ) : (
                                <>
                                    <strong>Lyhenne:</strong> {colorDefinitions[colorKey]?.shortname || ''}<br />
                                    <strong>Selite:</strong> {colorDefinitions[colorKey]?.colorinfo || ''}
                                </>
                            )}
                        </Accordion>
                    ))}
                </ScrollableFormContainer>

                <ButtonGroup>
                    <GroupLeft />
                    <GroupRight>
                        <CancelButton onClick={handleClose}>Sulje</CancelButton>
                    </GroupRight>
                </ButtonGroup>

                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={confirmDialog.onCancel}
                    LeftButtonComponent={SaveButton}
                    leftButtonText=' '
                    MiddleButtonComponent={UndoButton}
                    middleButtonText='Hylkää'
                    onMiddleButtonAction={handleUndoConfirm}
                />

            </SlideInContainerRight>
        </MyErrorBoundary>
    );
};

export default ColorManagement;
