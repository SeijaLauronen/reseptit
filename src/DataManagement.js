import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { handleImportData, handleExportData, deleteAllData } from './controller';
import { SlideInContainerRight, ButtonGroup, GroupRight, GroupLeft } from './components/Container'
import { PrimaryButton, CancelButton, CloseButtonComponent, OkButton, DeleteButton, CopyButton, PasteButton } from './components/Button';
import { BoldedParagraph } from './components/StyledParagraph';
import exampleData from './exampleData.json';
import helpTexts from './helpTexts';
import ConfirmDialog from './components/ConfirmDialog';
import Toast from './components/Toast';
import MyErrorBoundary from './components/ErrorBoundary';
import { useSettings } from './SettingsContext';
import { useColors } from './ColorContext';
import { useProductClass } from './ProductClassContext';


//TODO BoldedParagraph teksteineen komponentiksi

const TextArea = styled.textarea`
  width: 80%;
  height: 180px;
  margin: 2px 15px;
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
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });
  const [showJsonTextArea, setShowJsonTextArea] = useState(false);
  const [savedFilename, setSavedFilename] = useState('');
  const [error, setError] = useState('');
  const { fetchAndSetProductClasses, resetProductClasses } = useProductClass();

  useEffect(() => {

    if (isOpen) {
      setData('');
      setLoading(false);
      setSuccess(false);
      setSelectedFileName('');
      setSavedFilename('');
      setError('');
      setShowJsonTextArea(false);
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

  const { deleteLocalStorage, setLocalStorageDefaults } = useSettings();
  const { resetColors, loadColorDefinitions } = useColors(); //Hook

  const handleLoadExample = async () => {

    setConfirmDialog({
      isOpen: true,
      message: 'Haluatko varmasti ladata esimerkkiaineiston? Tämä poistaa nykyiset tiedot.',
      onConfirm: async () => {
        setLoading(true);
        await handleImportData(exampleData);
        //setColorCodingEnabled(true); // Ota värikoodit käyttöön latauksen jälkeen
        
        setLocalStorageDefaults(); // Asetetaan localStore-määrittelyt, mm värikoodit käyttöön
        setTimeout(() => {
          loadColorDefinitions(); // Ladataan värimäärittelyt kontekstiin
        }, 0); // Odotetaan, että localStorage päivittyy. Tkeeköhän tämä oikeasti mitään....
        
        fetchAndSetProductClasses();  //Ladataan tuoteryhmät kontekstiin
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
        resetColors(); //Värimäärittelyt tyhjennetään kontekstista
        resetProductClasses();  //Tyhjennetään tuoteluokittelukonteksti
        deleteLocalStorage();// Poistetaan kaikki localStore-määrittelyt
        setLoading(false);
        setSuccess(true);
        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
      },
    });
  };

  const handleJsonTextChange = (event) => {
    setData(event.target.value);
  };

  const handleCopy = (event) => {
    navigator.clipboard.writeText(data);
  };

  // async, koska palauttaa lupauksen (Promise)
  const handlePaste = async (event) => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      setData(clipboardText);
    } catch (err) {
      setError('Leikepöydän lukeminen epäonnistui. \n' + err.message);
    }
  };

  //TODO tämä ei saa kiinni virhettä ennenkuin se jo kaataa sivun, jos antaa esim samat avaimet tuotteille.
  // Käytä errorbounderya
  const handleImportFromTextArea = async () => {
    try {
      const content = JSON.parse(data);
      setConfirmDialog({
        isOpen: true,
        message: 'Haluatko varmasti tuoda tiedot? Tämä poistaa nykyiset tiedot tietokannasta.',
        onConfirm: async () => {
          try {
            setLoading(true);
            await handleImportData(content);
            loadColorDefinitions(); //ladataan värimäärittelyt kontekstiin
            fetchAndSetProductClasses();  //Ladataan tuoteryhmät kontekstiin TODO tämä ei päivity editproductformille heti!!
            setLoading(false);
            setSuccess(true);
            setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
          } catch (err) {
            setLoading(false);
            setError('Virhe tietojen tuomisessa: ' + err.message);
            setConfirmDialog({ isOpen: false, message: '', onConfirm: null }); // Suljetaan dialogi virheen yhteydessä
          }
        },
      });
    } catch (err) {
      setError('Virheellinen JSON-data. \n' + err.message);
    }
  };

  const handleJsonCheckedChange = () => {
    setShowJsonTextArea(!showJsonTextArea)
  };

  const JsonCheckbox = () => {
    const labelText = action === 'import' ? "Tuo tekstikentästä" : "Näytä tiedot";
    return (
      <label>
        <input
          type="checkbox"
          checked={showJsonTextArea}
          onChange={handleJsonCheckedChange}
        />
        {labelText}
      </label>
    )
  }

  const jsonPlaceholder = `
Malli json tekstistä:

  {
    "categories": [
      {
        "name": "Kategoria 1",
        "order": 1,
        "id": 1
      }
    ],
    "products": [
      {
        "name": "Tuote 1",
        "categoryId": 1,
        "id": 1,
      },
      {
        "name": "Tuote 2",
        "categoryId": 1,
        "id": 2
      }
    ]
  }
  `

  return (
    <MyErrorBoundary>
      {error && (
        <Toast message={error} onClose={() => setError('')} />
      )}

      <SlideInContainerRight $isOpen={isOpen}>
        <CloseButtonComponent onClick={() => onClose(success && !loading)}></CloseButtonComponent>

        {action === 'import' && (
          <>
            <h2>Palauta tai tuo tiedot</h2>
            {helpTexts['importDB']}

            <JsonCheckbox />
            {showJsonTextArea &&
              <>
                {helpTexts['showImportDB']}
                <TextArea
                  value={data}
                  onChange={handleJsonTextChange}
                  rows="18"
                  cols="40"
                  placeholder={jsonPlaceholder}
                />
              </>
            }

            {!success && !showJsonTextArea &&
              <FileInputContainer>
                <FileInput type="file" onChange={handleFileRead} />
              </FileInputContainer>
            }

            {loading && <BoldedParagraph>Ladataan...</BoldedParagraph>}
            {success && !loading && <BoldedParagraph>{selectedFileName} lataus onnistui!</BoldedParagraph>}

            <ButtonGroup>
              <GroupLeft>
                {showJsonTextArea &&
                  <>
                    <PasteButton onClick={(event) => handlePaste(event)}>Liitä</PasteButton>
                    <OkButton
                      onClick={handleImportFromTextArea}
                      disabled={!data || data.trim() === ''}  // Disabloi, jos `data` on tyhjä merkkijono
                    >
                      Lataa tiedot
                    </OkButton>
                  </>
                }
              </GroupLeft>
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
            {helpTexts['exportDB']}
            <JsonCheckbox />
            {showJsonTextArea &&
              <>
                {helpTexts['showExportDB']}
                <TextArea
                  value={data}
                  onChange={handleJsonTextChange}
                  rows="18"
                  cols="40"
                />
              </>
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
            {helpTexts['loadExampleDB']}
            {loading && <BoldedParagraph>Ladataan...</BoldedParagraph>}
            {success && !loading && <BoldedParagraph>Lataus onnistui!</BoldedParagraph>}

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
    </MyErrorBoundary>
  );
};

export default DataManagement;
