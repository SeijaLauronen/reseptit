import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ScrollableFormContainer, SlideInContainerRight, FormContainer } from './components/Container';
import { CloseButtonComponent, CancelButton } from './components/Button';
import { ButtonGroup, GroupLeft, GroupRight } from './components/Container';
import SwitchButtonComponent from './components/SwitchButtonCompnent';
import { useSettings } from './SettingsContext';

const SettingCard = styled.div`
margin-bottom: 5px;
background-color: white;
box-shadow: 
    inset 0 4px 6px rgba(0, 0, 0, 0.1),  /* Sisäinen yleinen varjo */
    inset 0 1px 3px rgba(0, 0, 0, 0.08); /* Sisäinen hieno varjo */
`

const CardHeader = styled.div`
padding: 5px;
    font-weight: bold;
    border-bottom: 2px solid #ccc; /* Selkeä alaosan viiva */
    box-shadow: 
    inset 0 4px 6px rgba(0, 0, 0, 0.1),  /* Sisäinen yleinen varjo */
    inset 0 1px 3px rgba(0, 0, 0, 0.08); /* Sisäinen hieno varjo */
`
const SettingHeader = styled.span`
    font-weight: bold;
`
const SettingRow = styled.span`
 display: flex;
 justify-content: space-between;
 align-items: center;
 gap: 20px; // elementtien väli
 margin: 10px;
`

const SettingsManagement = ({ isOpen, onClose }) => {
    const { keepQuantityEnabled, toggleKeepQuantity, openQuantityByLongPress, toggleOpenQuantityByLongPress, showProductClass, toggleShowProductClass, showDose, toggleShowDose } = useSettings();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isOpen]);

    const handleClose = () => {
        onClose(false);
    }

    return (
        <SlideInContainerRight $isOpen={isOpen}>
            <CloseButtonComponent onClick={handleClose} />
            <h2>Yleiset määrittelyt</h2>

            <ScrollableFormContainer style={{ backgroundColor: 'lightyellow' }}>
                <SettingCard>
                    <CardHeader>Ostoslista - näkymä</CardHeader>
                    <SettingRow>
                        <label>Säilytä viimeksi käytetty <SettingHeader>määrä</SettingHeader> ostoskorissa, kun ostos poistetaan listalta.
                        </label>

                        <SwitchButtonComponent
                            checked={keepQuantityEnabled}
                            onChange={toggleKeepQuantity}
                        /*
                        onColor="#00ff00"
                        offColor="#ff0000"
                        onHandleColor="#0000ff"
                        offHandleColor="#ffffff"
                        */
                        />
                    </SettingRow>
                </SettingCard>
                <SettingCard>
                    <CardHeader>Tuote - näkymä</CardHeader>
                    <SettingRow>
                        <label>Määrä annetaan vasta <SettingHeader>klikkaamalla ostoskoria pitkään</SettingHeader>.</label>
                        <SwitchButtonComponent
                            checked={openQuantityByLongPress}
                            onChange={toggleOpenQuantityByLongPress}
                        /*
                        onColor="#00ff00"
                        offColor="#ff0000"
                        onHandleColor="#0000ff"
                        offHandleColor="#ffffff"
                        */
                        />
                    </SettingRow>

                    <SettingRow>
                        <label>Näytä <SettingHeader>annos</SettingHeader> tuoterivillä.
                        </label>

                        <SwitchButtonComponent
                            checked={showDose}
                            onChange={toggleShowDose}
                        /*
                        onColor="#00ff00"
                        offColor="#ff0000"
                        onHandleColor="#0000ff"
                        offHandleColor="#ffffff"
                        */
                        />
                    </SettingRow>
                    <SettingRow>
                        <label>Näytä <SettingHeader>tuotteen luokitus</SettingHeader> tuoterivillä.</label>

                        <SwitchButtonComponent
                            checked={showProductClass}
                            onChange={toggleShowProductClass}
                        /*
                        onColor="#00ff00"
                        offColor="#ff0000"
                        onHandleColor="#0000ff"
                        offHandleColor="#ffffff"
                        */
                        />
                    </SettingRow>
                </SettingCard>
            </ScrollableFormContainer>
            <ButtonGroup>
                <GroupLeft />
                <GroupRight>
                    <CancelButton onClick={handleClose}>Sulje</CancelButton>
                </GroupRight>
            </ButtonGroup>

        </SlideInContainerRight>
    );

};

export default SettingsManagement;