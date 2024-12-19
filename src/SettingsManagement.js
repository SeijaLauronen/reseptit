import React, { useEffect } from 'react';
import styled from 'styled-components';
import { SlideInContainerRight } from './components/Container';
import { CloseButtonComponent, CancelButton } from './components/Button';
import { ButtonGroup, GroupLeft, GroupRight } from './components/Container';
import SwitchButtonComponent from './components/SwitchButtonCompnent';
import { useSettings } from './SettingsContext';

const SettingRow = styled.div`
 display: flex;
 justify-content: space-between;
 align-items: center;
 gap: 20px; // elementtien väli
 margin: 10px;
`

const SettingsManagement = ({ isOpen, onClose }) => {
    const { keepQuantityEnabled, toggleKeepQuantity, openQuantityByLongPress, toggleOpenQuantityByLongPress } = useSettings();    

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


            <h4>Ostoskorin oletusmäärä:</h4>
            <SettingRow>
                <label>Säilytä viimeksi käytetty määrä ostoskorissa, kun ostos poistetaan listalta.
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

            <h4>Tuotenäkymässä määrän antaminen ostoskoriin</h4>
            <SettingRow>
                <label>Avaa vasta pitkällä painalluksella.
                </label>

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