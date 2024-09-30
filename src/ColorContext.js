import React, { createContext, useState, useContext, useEffect } from 'react';
import { upsertColorDefinition as controllerUpsertColorDefinition, getColorDefinition as controllerGetColorDefinition } from './controller';

// Väriobjekti, jossa värit määritellään vaiheilla
const colors = {
    c1: { code: '#f5ec42', name: 'Yellow' },
    c2: { code: '#369e3b', name: 'Green' },
    c3: { code: '#db1616', name: 'Red' },
    /*
    c4: { code: '#00c3ff', name: 'Blue' },
    grey: { code: '#929596', name: 'Grey' },
    */
    black: { code: '#000', name: 'Black' },
};

// Väri konteksti
const ColorContext = createContext();

// Väri kontekstin tarjoaja
export const ColorProvider = ({ children }) => {
    // Alkuperäiset valitut värit, joissa jokainen vaihe on taulukko valituista väreistä
    const [selectedColors, setSelectedColors] = useState([]);
    const [colorDefinitions, setColorDefinitions] = useState({});
    const [errorState, setErrorState] = useState(null);

    const toggleColor = (color) => {
        setSelectedColors(prevColors =>
            prevColors.includes(color)
                ? prevColors.filter(c => c !== color)
                : [...prevColors, color]
        );
    };


    // Funktio värin lisämääreen asettamiseen ja tallentamiseen
    const setColorDefinition = async (colorId, definition) => {
        try {
            // Päivitä paikallinen tila
            setColorDefinitions(prevDefinitions => ({
                ...prevDefinitions,
                [colorId]: definition
            }));

            // Lisää tai päivitä IndexedDB:ssä käyttämällä controllerin funktiota
            await controllerUpsertColorDefinition(colorId, definition);
        } catch (error) {
            console.error('Virhe tallennettaessa värin määrittelyä:', error);
            //setErrorState(`Virhe tallennettaessa väriä ${colorId}: ${error.message}`);            
            throw new Error('Virhe tallennettaessa värin määrittelyä: ' + error);
        }
    };

    // Funktio haetaan värin lisämääre, jos sellainen on tallennettu
    const loadColorDefinition = async (colorId) => {
        try {
            const definition = await controllerGetColorDefinition(colorId);
            if (definition) {
                setColorDefinitions(prevDefinitions => ({
                    ...prevDefinitions,
                    [colorId]: definition
                }));
            }
        } catch (error) {
            console.error('Virhe haettaessa värin määrittelyä:', error);
            setErrorState(`Virhe haettaessa värin määrittelyä ${colorId}: ${error.message}`);
            //throw new Error('Virhe haettaessa värin määrittelyä: ' + error);
            
        }

    };


    //TODO, ei ladata tässä
    
    useEffect(() => {
        // Esimerkki siitä, miten voi ladata värin lisämääreitä, kun komponentti ladataan
        Object.keys(colors).forEach(colorId => {
            loadColorDefinition(colorId);
        });
        
    }, []);
    

    return (
        <ColorContext.Provider value={{
            colors,
            selectedColors,
            toggleColor,
            setSelectedColors,
            setColorDefinition,
            colorDefinitions,
            errorState
        }}>
            {children}
        </ColorContext.Provider>
    );
};

// Väri kontekstin käyttö
export const useColors = () => useContext(ColorContext);
