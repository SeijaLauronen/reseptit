// DataManagement.js

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { handleImportData, handleExportData, handleLoadExample } from './controller';
import { SlideInContainerRight, FormContainer, ButtonGroup, GroupLeft } from './components/Container'
import { CloseButtonComponent } from './components/Button';
import exampleData from './exampleData.json';


const TextArea = styled.textarea`
  width: 80%;
  height: 200px;
  margin: 10px 0;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  border-radius: 5px;
  background-color: #673ab7;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #512a9e;
  }
`;

// huom! aaltosulut, niin on props!!!!!
const DataManagement = ({isOpen, action, onClose}) => {

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

  const [data, setData] = useState('');
  const [showTextArea, setShowTextArea] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      /*
      const content = e.target.result;
      setData(content);
      */
      const content = JSON.parse(e.target.result);
      setData(JSON.stringify(content, null, 2));
      setShowTextArea(true);
      // Implement data validation and import logic here
      if (window.confirm('Haluatko varmasti tuoda tiedot? Tämä poistaa nykyiset tiedot tietokannasta.')) {
        setLoading(true);
        await handleImportData(content);
        setLoading(false);
        setSuccess(true);
        //onRefresh(); // Päivittää näkymän 
      }
    };
    reader.readAsText(file);
  };

  const handleExport = async () => {
    setLoading(true);
    const exportedData = await handleExportData();
    setData(JSON.stringify(exportedData, null, 2));
    setShowTextArea(true);
    const blob = new Blob([JSON.stringify(exportedData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exported_data.json';
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
        //onRefresh(); // Päivittää näkymän  
    }
  };



  return (
    <SlideInContainerRight $isOpen={isOpen}>
      <CloseButtonComponent onClick={onClose}></CloseButtonComponent>
        <FormContainer>         
    
        {action==='import' && (
            <>
            {loading && <p>Ladataan...</p>}
            {success && !loading && <p>Lataus onnistui!</p>}
            <h2>Valitse tiedosto, josta tiedot tuodaan </h2>
            <input type="file" onChange={handleFileRead} />
            </>
        )}

        {action==='export' && (
            <>
            {loading && <p>Ladataan...</p>}
            {success && !loading && <p>Tiedot tallennettu tiedostoon..</p>}
            <h2>Ladataan tiedot kannasta </h2>
            <Button onClick={handleExport}>Vie tiedot</Button>
            </>
        )}
       

        {action==='load' && (
            <>
            {loading && <p>Ladataan...</p>}
            {success && !loading && <p>Lataus onnistui!</p>}
            <h2>Ladataan esimerkkitiedostosta tiedot </h2>
            <Button onClick={handleLoadExample}>Lataa esimerkkiaineisto</Button>
            {showTextArea && (
                <TextArea value={data} readOnly />
            )}
            </>
      )}

    </FormContainer>
    </SlideInContainerRight>

  );
};

export default DataManagement;
