import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { handleImportData, handleExportData, deleteAllData } from './controller';
import { SlideInContainerRight, ButtonGroup, GroupRight, GroupLeft } from './components/Container'
import { PrimaryButton, CancelButton, CloseButtonComponent, OkButton, DeleteButton, CopyButton } from './components/Button';
import { BoldedParagraph } from './components/StyledParagraph';
import exampleData from './exampleData.json';
import helpTexts from './helpTexts';
import ConfirmDialog from './components/ConfirmDialog';

//TODO siirrä tekstit täältä erilliseen tiedostoon
//TODO BoldedParagraph teksteineen kopmponentiksi
//TODO showTextArea ei taida tehdä oikeasti mitään..

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
const DataManagement = ({ isOpen, action, onClose }) => {

  const [data, setData] = useState('');
  const [showTextArea, setShowTextArea] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });
  const [showJsonTextArea, setShowJsonTextArea] = useState(false);
  const [savedFilename, setSavedFilename] = useState('');

  useEffect(() => {

    if (isOpen) {
      setData('');
      setShowTextArea(false);
      setLoading(false);
      setSuccess(false);
      setSelectedFileName('');
      setSavedFilename('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleExportToText = async () => {
      setLoading(true);
      const exportedData = await handleExportData();
      setData(JSON.stringify(exportedData, null, 2));
      setLoading(false);
    };

    if (isOpen && action === 'export') {
      handleExportToText();
    }
  }, [isOpen, action]);


  const handleFileRead = async (event) => {
    const file = event.target.files[0];
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (e) => {

      const content = JSON.parse(e.target.result);
      setData(JSON.stringify(content, null, 2));
      setShowTextArea(true);      

      setConfirmDialog({
        isOpen: true,
        message: 'Haluatko varmasti tuoda tiedot? Tämä poistaa nykyiset tiedot tietokannasta.',
        onConfirm: async () => {
          setLoading(true);
          await handleImportData(content);
          setLoading(false);
          setSuccess(true);
          setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
        },
      });

    };
    reader.readAsText(file);
  };


  const handleExport = async () => {
    //Tiedot ovat jo data:ssa ja niitä on voitu muuttaa tekstikentässä, ei haeta uudestaan.
    const blob = new Blob([data], { type: 'application/json' });
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
    setSavedFilename(filename);
  };




  const handleLoadExample = async () => {

    setConfirmDialog({
      isOpen: true,
      message: 'Haluatko varmasti ladata esimerkkiaineiston? Tämä poistaa nykyiset tiedot.',
      onConfirm: async () => {
        setLoading(true);
        await handleImportData(exampleData);
        setLoading(false);
        setSuccess(true);
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      },
    });
  };

  const handleDeleteAllData = async () => {
    setConfirmDialog({
      isOpen: true,
      message: 'Haluatko varmasti poistaa kaikki tiedot?',
      onConfirm: async () => {
        setLoading(true);
        await deleteAllData();
        setLoading(false);
        setSuccess(true);
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      },
    });
  };

  const handleExportJsonChange = (event) => {
    setData(event.target.value);
  };

  const handleCopy = (event) => {
    navigator.clipboard.writeText(data);
  };

  const handleImportFromTextArea = async () => {
    try {
      const content = JSON.parse(data);
      setConfirmDialog({
        isOpen: true,
        message: 'Haluatko varmasti tuoda tiedot? Tämä poistaa nykyiset tiedot tietokannasta.',
        onConfirm: async () => {
          setLoading(true);
          await handleImportData(content);
          setLoading(false);
          setSuccess(true);
          setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
        },
      });
    } catch (error) {
      alert('Virheellinen JSON-data.');
    }
  };

  const handleJsonCheckedChange = () => {    
    setShowJsonTextArea(!showJsonTextArea) 
  };

  const JsonCheckbox = () => {
    return (
      <label>
        <input
          type="checkbox"
          checked={showJsonTextArea}    
          onChange={handleJsonCheckedChange}    
        />
        Näytä tiedot
      </label>
    )
  }

  return (
    <SlideInContainerRight $isOpen={isOpen}>
      <CloseButtonComponent onClick={() => onClose(success && !loading)}></CloseButtonComponent>

      {action === 'import' && (
        <>

          <h2>Palauta tai tuo tiedot</h2>
          <p>Voit tuoda tiedot tiedostosta. Kaikki nykyiset tiedot poistetaan ja tilalle ladataan tiedot valitsemastasi tiedostosta </p>
          <p>Mikäli olet jo tallentanut tietoja ohjelmalla, suositellaan varmuuskopion ottamista "Vie tiedot" toiminnolla.</p>

          {!success &&
            <FileInputContainer>
              <FileInput type="file" onChange={handleFileRead} />
            </FileInputContainer>
          }

          {loading && <BoldedParagraph>Ladataan...</BoldedParagraph>}
          {success && !loading && <BoldedParagraph>{selectedFileName} lataus onnistui!</BoldedParagraph>}

          <ButtonGroup>
            <GroupRight>
              {!success && <CancelButton onClick={() => onClose(false)} />}
              {success && !loading && <OkButton onClick={() => onClose(true)} />}
            </GroupRight>
          </ButtonGroup>

        </>
      )}

      {action === 'export' && (
        <>
          <h2>Varmuuskopioi tai vie tiedot</h2>
          <p>Voit tallentaa kaikki sovelluksen tiedot tiedostoon tai kopioida ne leikepöydälle.</p>
          <JsonCheckbox/>
          {showJsonTextArea &&
            <TextArea
              value={data}
              onChange={handleExportJsonChange}
              rows="18"
              cols="40"
            />
          }

          {loading && <BoldedParagraph>Ladataan...</BoldedParagraph>}
          {success && !loading && <BoldedParagraph>Tiedot tallennettu tiedostoon: {savedFilename}.</BoldedParagraph>}

          <ButtonGroup>
            <GroupLeft>
              <OkButton onClick={handleExport}>Tiedostoon</OkButton>
              <CopyButton onClick={(event) => handleCopy(event)}>Kopioi</CopyButton>
            </GroupLeft>
            <GroupRight>
              {!success && <CancelButton onClick={() => onClose(false)} />}
              {success && !loading && <CancelButton onClick={() => onClose(false)}>Sulje</CancelButton>}
            </GroupRight>
          </ButtonGroup>

        </>
      )}


      {action === 'load' && (
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
            {!success && <PrimaryButton onClick={handleLoadExample}>Lataa</PrimaryButton>}
            <GroupRight>
              {!success && <CancelButton onClick={() => onClose(false)} />}
              {success && !loading && <OkButton onClick={() => onClose(true)} />}
            </GroupRight>
          </ButtonGroup>
        </>
      )}

      {action === 'delete' && (
        <>

          <h2>Poista tiedot </h2>
          {helpTexts['deleteDB']}
          {loading && <BoldedParagraph>Poistetaan...</BoldedParagraph>}
          {success && !loading && <BoldedParagraph>Poisto onnistui!</BoldedParagraph>}

          <ButtonGroup>
            {!success && <DeleteButton onClick={handleDeleteAllData}>Poista kaikki tiedot</DeleteButton>}
            <GroupRight>
              {!success && <CancelButton onClick={() => onClose(false)} />}
              {success && !loading && <OkButton onClick={() => onClose(true)} />}
            </GroupRight>
          </ButtonGroup>
        </>
      )}


      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })}
      />

    </SlideInContainerRight>

  );
};

export default DataManagement;
