import React, { useCallback, createContext, useState, useContext, useEffect } from 'react';
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

const noColor = { code: '#e1f5eb', name: 'NoColor' }; // Taustan värinen

// Väri konteksti
const ColorContext = createContext();

// Väri kontekstin tarjoaja
export const ColorProvider = ({ children }) => {
    // Alkuperäiset valitut värit, joissa jokainen vaihe on taulukko valituista väreistä
    const [selectedColors, setSelectedColors] = useState([]);
    const [colorDefinitions, setColorDefinitions] = useState({});
    const [errorState, setErrorState] = useState(null);

    // Funktio kaikkien värien tilan resetointiin
    const resetColors = () => {
        setSelectedColors([]); // Tyhjennä valitut värit
        setColorDefinitions({}); // Tyhjennä värimäärittelyt        
    };

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


    // Funktio kaikkien värimäärittelyjen lataamiseen
    //const loadColorDefinitions = async () => {
    const loadColorDefinitions = useCallback(async () => {
        try {
            console.log('Ladataan värimäärittelyt...');
            for (const colorId of Object.keys(colors)) {
                await loadColorDefinition(colorId); // Lataa värin määrittely
            }
            console.log('Värimäärittelyt ladattu.');
        } catch (error) {
            console.error('Virhe värimäärittelyjen latauksessa:', error);
        }
        //};
    }, []); // EI lisätä colors-riippuvuutta, koska colors ei muutu, se on vakio. Tyhjä taulukko kuitenkin lisätty

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
    /*
    useEffect-hookin riippuvuustaulukossa pitäisi olla kaikki hookin sisällä käytettävät muuttujat ja funktiot, jotka ovat komponentin ulkopuolella tai uudelleenluotavia. Tässä tapauksessa loadColorDefinitions on määritelty komponentin sisällä.
    loadColorDefinitions-funktio luodaan joka kerta, kun komponentti renderöidään. useEffect ei tiedä, onko funktio muuttunut, jos sitä ei ole lisätty riippuvuustaulukkoon.
    Huom! käytettävä useCallback loadColorDefinitions:ssa.  Sinne EI lisätä colors-riippuvuutta, koska colors ei muutu, se on vakio
    */

    useEffect(() => {
        loadColorDefinitions();
    }, [loadColorDefinitions]);


    return (
        <ColorContext.Provider value={{
            colors,
            selectedColors,
            toggleColor,
            setSelectedColors,
            setColorDefinition,
            colorDefinitions,
            resetColors,
            loadColorDefinitions,
            noColor,
            errorState
        }}>
            {children}
        </ColorContext.Provider>
    );
};

// Väri kontekstin käyttö
export const useColors = () => useContext(ColorContext);
