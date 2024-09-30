import React, { useState, useEffect } from 'react';
import MyErrorBoundary from './components/ErrorBoundary';
import { SlideInContainerRight } from './components/Container';
import Toast from './components/Toast';
import { CloseButtonComponent } from './components/Button';
import { ColorItemSelection } from './components/ColorItem';
import { useColors } from './ColorContext';
import { InputColorShortName, InputTextArea } from './components/Input';
import { ScrollableFormContainer, ButtonGroup, GroupLeft, GroupRight, IconContainer, IconWrapper } from './components/Container';
import { CancelButton } from './components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import Accordion from './components/Accordion';

const ColorManagement = ({ isOpen, onClose }) => {
    const [error, setError] = useState(''); // Paikallinen virhetila
    const { colors, colorDefinitions, setColorDefinition, errorState } = useColors();
    const [editingColor, setEditingColor] = useState(null); // Editoitava väri
    const [tempShortName, setTempShortName] = useState(''); // Tilapäinen lyhenteen tila
    const [tempColorInfo, setTempColorInfo] = useState(''); // Tilapäinen värin selitteen tila
    const [isModified, setIsModified] = useState(false); // Seurataan, onko muutoksia tehty

    useEffect(() => {
        if (errorState) {
            setError(errorState);
        }
    }, [errorState]);

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

    const handleEditColor = (colorKey, event) => {
        event.stopPropagation(); // Estetään tapahtuman eteneminen Accordionille
        setEditingColor(colorKey);
        setTempShortName(colorDefinitions[colorKey]?.shortname || ''); // Alustetaan lyhenne
        setTempColorInfo(colorDefinitions[colorKey]?.colorinfo || ''); // Alustetaan selite
        setIsModified(false); // Alustetaan muutostila
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
    };

    const handleCancelEdit = (event) => {
        event.stopPropagation(); // Estetään tapahtuman eteneminen Accordionille
        setEditingColor(null); // Peru editointi
        setIsModified(false); // Resetoidaan muutostila
    };

    const handleClose = () => {
        if (isModified) {
            const confirmClose = window.confirm("Olet tehnyt muutoksia. Haluatko tallentaa muutokset ennen sulkemista?");
            if (confirmClose) {
                if (editingColor) {
                    handleSaveColor(editingColor);
                }
            } else {
                setEditingColor(null); // Poistutaan editointitilasta
            }
        }
        onClose(false); // Suljetaan ilman tallennusta, jos peruutetaan tai muutoksia ei ole tehty
    };

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
                            title={
                                <>
                                    {colors[colorKey].name}
                                    {editingColor === null && (
                                        <IconWrapper onClick={(event) => handleEditColor(colorKey, event)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </IconWrapper>
                                    )}

                                    {editingColor === colorKey && (
                                        <>
                                            <IconContainer>
                                                <IconWrapper onClick={(event) => handleSaveColor(colorKey, event)}>
                                                    <FontAwesomeIcon icon={faSave} />
                                                </IconWrapper>
                                                <IconWrapper onClick={(event) => handleCancelEdit(event)}>
                                                    <FontAwesomeIcon icon={faTimes} />
                                                </IconWrapper>
                                            </IconContainer>
                                        </>
                                    )}
                                </>
                            }
                            defaultExpanded={true}
                            disabled={editingColor !== null && editingColor !== colorKey} // Disable other accordions
                        >
                            {editingColor === colorKey ? (
                                <>
                                    <label>Värin lyhenne:</label>
                                    <InputColorShortName
                                        value={tempShortName}
                                        onChange={handleFieldChange(setTempShortName)} // Muutostilan päivitys
                                        placeholder="Lyhenne"
                                    />
                                    <label>Värin selite:</label>
                                    <InputTextArea
                                        value={tempColorInfo}
                                        onChange={handleFieldChange(setTempColorInfo)} // Muutostilan päivitys
                                        placeholder="Selite"
                                    />
                                </>
                            ) : (
                                <>
                                    <p><strong>Lyhenne:</strong> {colorDefinitions[colorKey]?.shortname || 'Ei määritelty'}</p>
                                    <p><strong>Selite:</strong> {colorDefinitions[colorKey]?.colorinfo || 'Ei määritelty'}</p>
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
            </SlideInContainerRight>
        </MyErrorBoundary>
    );
};

export default ColorManagement;
