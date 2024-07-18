import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { handleImportData, handleExportData, handleLoadExample } from './controller';
import { SlideInContainerRight, FormContainer, ButtonGroup, GroupRight, GroupLeft } from './components/Container'
import { PrimaryButton , SecondaryButton, CancelButton, CloseButtonComponent, OkButton } from './components/Button';
import exampleData from './exampleData.json';

//TODO siirrä toimintoja täältä dataUtilsiin...

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

const FileInputLabel = styled.label`
  margin-bottom: 5px;
  color: #333;
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
      // Implement data validation and import logic here
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
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exported_data.json'; //TODO nimeen aikaleima yms
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setLoading(false);
    setSuccess(true);
  };


  const handleLoadExample = async () => {
    if (window.confirm('Haluatko varmasti ladata esimerkkiaineiston? Tämä poistaa nykyiset tiedot tietokannasta.')) {
        setLoading(true);
        await handleImportData(exampleData);
        setLoading(false);
        setSuccess(true);
    }
  };



  return (
    <SlideInContainerRight $isOpen={isOpen}>
      <CloseButtonComponent onClick={() => onClose(success && !loading)}></CloseButtonComponent>
        <FormContainer>         
    
        {action==='import' && (
            <>            
            
            <h2>Tuo tiedot</h2>
            <p>Voit tuoda tiedot tiedostosta. Kaikki nykyiset tiedot poistetaan ja tilalle ladataan tiedot valitsemastasi tiedostosta </p>
            <p>Mikäli olet jo tallentanut tietoja ohjelmalla, suositellaan varmuuskopion ottamista "Vie tiedot" toiminnolla.</p>

            <FileInputContainer>
              <FileInput type="file" onChange={handleFileRead} />
            </FileInputContainer>
            {loading && <p>Ladataan...</p>}
            {success && !loading && <p>{selectedFileName} lataus onnistui!</p>}

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
            
            <h2>Vie tiedot</h2>
            <p>Kaikki sovelluksen tiedot talletetaan tiedostoon.</p>

            {loading && <p>Ladataan...</p>}
            {success && !loading && <p>Tiedot tallennettu tiedostoon.</p>}

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
            {loading && <p>Ladataan...</p>}
            {success && !loading && <p>Lataus onnistui!</p>}
            
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

    </FormContainer>
    </SlideInContainerRight>

  );
};

export default DataManagement;
