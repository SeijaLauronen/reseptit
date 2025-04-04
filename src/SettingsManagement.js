import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ScrollableFormContainer, SlideInContainerRight } from './components/Container';
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
const SettingRowX = styled.span`
 display: flex;
 justify-content: space-between;
 align-items: center;
 gap: 20px; // elementtien väli
 margin: 10px;
 //flex-wrap: wrap; // Sallii rivittäytymisen, OnePlus varten tämä rivi, ei hyvä

 // OnePlus varten tämä:
 
 labelX {
    flex: 1;          // Vie saatavilla olevan tilan 
    min-width: 0;     // Pakottaa tekstin kunnollisen rivittäytymisen 
 }
    
`
//OnePlus:aa varten kokeillaan tätä:
const SettingRow = styled.span`
  display: grid;
  grid-template-columns: 1fr auto; //Teksti vasemmalle, kytkin oikealle 
  align-items: center;
  gap: 20px;
  margin: 10px;
`


const SettingsManagement = ({ isOpen, onClose }) => {
    const { keepQuantityEnabled, toggleKeepQuantity, openQuantityByLongPress, toggleOpenQuantityByLongPress, showProductClass, toggleShowProductClass, showDose, toggleShowDose, filterSearchProducts, toggleFilterSearchProducts, hideQuantityUnit, toggleHideQuantityUnit } = useSettings();

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
                    <SettingRow>
                        <label>Piilota <SettingHeader>määrä</SettingHeader> ja <SettingHeader>yksikkö</SettingHeader> ostoslistalta.
                        </label>

                        <SwitchButtonComponent
                            checked={hideQuantityUnit}
                            onChange={toggleHideQuantityUnit}
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
                    <SettingRow>
                        <label><SettingHeader>Suodata</SettingHeader> tuotteet, kun niitä etsitään.</label>

                        <SwitchButtonComponent
                            checked={filterSearchProducts}
                            onChange={toggleFilterSearchProducts}
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

/* 
Syötä OnePlus Nord N10 5G:n tiedot:
Device Name: OnePlus Nord N10 5G
Width: 1080
Height: 2400
Device pixel ratio: 2.5 (tarkista jos eri)
User Agent: Mozilla/5.0 (Linux; Android 11; ONEPLUS N10 5G) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36


Näyttö: 6.49", 1080x2400 px (~405 ppi)

Android: 11 (OxygenOS 11)

Käytä tätä CSS-media querya:
@media (device-width: 1080px) and (device-height: 2400px) and (-webkit-device-pixel-ratio: 2.5)


DeepSeek:

Tämä on klassinen flexbox-tekstin ylivuoto-ongelma, joka johtuu siitä, että flex-containerissa oleva teksti 
ei osaa rivittyä oikein tietyissä tilanteissa. OnePlus-laitteissa on joskus omituisia tekstinrenderöintiongelmia.

1.Käytä flex-wrap: wrap ja aseta oikea width/min-width:
const SettingRow = styled.span`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin: 10px;
  flex-wrap: wrap; // Sallii rivittäytymisen 
  `;

  label {
    flex: 1;          // Vie saatavilla olevan tilan 
    min-width: 0;     // Pakottaa tekstin kunnollisen rivittäytymisen 
  }

2.Lisää eksplisiittinen overflow ja text-overflow:
label {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal; // Sallii useamman rivin 
}

3.Varmista, että <SettingHeader> ei aiheuta ongelmia:
const SettingHeader = styled.span`
  font-weight: bold;
  display: inline; // Varmistaa, että se ei riko tekstin virtaa 
  `

4.Kokeile lisätä negatiivinen word-spacing korjataksesi ylimääräiset välit:
label {
  word-spacing: -0.5px; // Korjaa oudot välit 
}


5.Käytä display: grid sijasta (jos flex jatkaa ongelmia):
const SettingRow = styled.span`
  display: grid;
  grid-template-columns: 1fr auto; //Teksti vasemmalle, kytkin oikealle 
  align-items: center;
  gap: 20px;
  margin: 10px;
`

6. Tarkista laitteen oma tekstiskalaus:
Lisää tämä HTML-headiin:
<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">

Vielä:
Kokeile lisätä väliaikaisesti reunuksia nähdäksesi, miten elementit asettuvat:
border: 1px solid red; // Kaikille osille 

*/