import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { handleImportData, handleExportData, deleteAllData } from './controller';
import { SlideInContainerRight, FormContainer, ButtonGroup, GroupRight } from './components/Container'
import { PrimaryButton , CancelButton, CloseButtonComponent, OkButton, DeleteButton } from './components/Button';
import { BoldedParagraph } from './components/StyledParagraph';
import exampleData from './exampleData.json';
import helpTexts from './helpTexts';

//TODO siirrä toimintoja täältä dataUtilsiin...
//TODO siirrä tekstit täältä erilliseen tiedostoon
//TODO window.confirmin tilalle oma dialogi
// TODO BoldedParagraph teksteineen kopmponentiksi

const TextArea = styled.textarea`
  width: 80%;
  height: 200px;
  margin: 10px 0;
`;

// Styled component for file input
const FileInputContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const FileInput = styled.input`
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;

  &::file-selector-button {
    padding: 10px;
    border: none;
    border-radius: 5px;
    background-color: #673ab7;
    color: white;
    cursor: pointer;
    margin-right: 10px;
  }

  &::file-selector-button:hover {
    background-color: #512a9e;
  }
`;

// huom! aaltosulut, niin on props!!!!!
const DataManagement = ({isOpen, action, onClose}) => {

    useEffect(() => {
        if (isOpen) {
            setData('');
            setShowTextArea(false);
            setLoading(false);
            setSuccess(false);
            setSelectedFileName('');
          document.body.style.overflow = 'hidden';
        } else {
          document.body.style.overflow = 'auto';
        }
        return () => {
          document.body.style.overflow = 'auto';
        };
  }, [isOpen]);

  const [data, setData] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {

      const content = JSON.parse(e.target.result);
      setData(JSON.stringify(content, null, 2));
      setShowTextArea(true);
      if (window.confirm('Haluatko varmasti tuoda tiedot? Tämä poistaa nykyiset tiedot tietokannasta.')) {
        setLoading(true);
        await handleImportData(content);
        setLoading(false);
        setSuccess(true);        
      }
    };
    reader.readAsText(file);
  };

  //TODO tiedoston nimi ja sijainti näytetään käyttäjälle
  const handleExport = async () => {
    setLoading(true);
    const exportedData = await handleExportData();
    setData(JSON.stringify(exportedData, null, 2));
    setShowTextArea(true);
    const blob = new Blob([JSON.stringify(exportedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const date = new Date();
    const timestamp = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
    const filename = `ostokseni_${timestamp}.json`;

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
    setSuccess(true);
  };


  const handleLoadExample = async () => {
    if (window.confirm('Haluatko varmasti ladata esimerkkiaineiston? Tämä poistaa nykyiset tiedot.')) {
        setLoading(true);
        await handleImportData(exampleData);
        setLoading(false);
        setSuccess(true);
    }
  };

  const handleDeleteAllData = async () => {
    if (window.confirm('Haluatko varmasti poistaa kaikki tiedot?')) {
        setLoading(true);
        await deleteAllData();
        setLoading(false);
        setSuccess(true);
    }
  }

  return (
    <SlideInContainerRight $isOpen={isOpen}>
      <CloseButtonComponent onClick={() => onClose(success && !loading)}></CloseButtonComponent>
        <FormContainer>         
    
        {action==='import' && (
            <>            
            
            <h2>Palauta tai tuo tiedot</h2>
            <p>Voit tuoda tiedot tiedostosta. Kaikki nykyiset tiedot poistetaan ja tilalle ladataan tiedot valitsemastasi tiedostosta </p>
            <p>Mikäli olet jo tallentanut tietoja ohjelmalla, suositellaan varmuuskopion ottamista "Vie tiedot" toiminnolla.</p>

            <FileInputContainer>
              <FileInput type="file" onChange={handleFileRead} />
            </FileInputContainer>
            {loading && <BoldedParagraph>Ladataan...</BoldedParagraph>}
            {success && !loading && <BoldedParagraph>{selectedFileName} lataus onnistui!</BoldedParagraph>}

            <ButtonGroup>
                <GroupRight>
                {!success && <CancelButton onClick={() => onClose(false)}/> }
                {success && !loading && <OkButton onClick={() => onClose(true)}/>} 
                </GroupRight>
            </ButtonGroup>

            </>
        )}

        {action==='export' && (
            <>
            
            <h2>Varmuuskopioi tai vie tiedot</h2>
            <p>Kaikki sovelluksen tiedot talletetaan tiedostoon.</p>
            <p>Voit myöhemmin palauttaa tiedot sieltä tai viedä haluamaasi sijaintiin.</p>

            {loading && <BoldedParagraph>Ladataan...</BoldedParagraph>}
            {success && !loading && <BoldedParagraph>Tiedot tallennettu tiedostoon.</BoldedParagraph>}

            <ButtonGroup>
                <PrimaryButton onClick={handleExport}>Vie tiedot</PrimaryButton>
                <GroupRight>
                {!success && <CancelButton onClick={() => onClose(false)}/> }
                {success && !loading && <OkButton onClick={() => onClose(false)}/>} 
                </GroupRight>
            </ButtonGroup>
            </>
        )}
       

        {action==='load' && (
            <>
            
            <h2>Lataa esimerkkiainesto </h2>
            <p>Voit ladata esimerkkiaineiston. Kaikki nykyiset tiedot poistetaan.</p>
            <p>Mikäli olet jo tallentanut tietoja ohjelmalla, suositellaan varmuuskopion ottamista "Vie tiedot" toiminnolla.</p>
            {loading && <BoldedParagraph>Ladataan...</BoldedParagraph>}
            {success && !loading && <BoldedParagraph>Lataus onnistui!</BoldedParagraph>}
            
            {showTextArea && (
                <TextArea value={data} readOnly />
            )}
            <ButtonGroup>
                <PrimaryButton onClick={handleLoadExample}>Lataa</PrimaryButton>
                <GroupRight>
                {!success && <CancelButton onClick={() => onClose(false)}/> }
                {success && !loading && <OkButton onClick={() => onClose(true)}/>} 
                </GroupRight>
            </ButtonGroup>
            </>
        )}

        {action==='delete' && (
            <>
            
            <h2>Poista tiedot </h2>
            {helpTexts['deleteDB']}
            {loading && <BoldedParagraph>Poistetaan...</BoldedParagraph>}
            {success && !loading && <BoldedParagraph>Poisto onnistui!</BoldedParagraph>}
            
            
            <ButtonGroup>
                <DeleteButton onClick={handleDeleteAllData}>Poista kaikki tiedot</DeleteButton>
                <GroupRight>
                {!success && <CancelButton onClick={() => onClose(false)}/> }
                {success && !loading && <OkButton onClick={() => onClose(true)}/>} 
                </GroupRight>
            </ButtonGroup>
            </>
        )}

    </FormContainer>
    </SlideInContainerRight>

  );
};

export default DataManagement;
