import React, { createContext, useState, useContext } from 'react';

// Väriobjekti, jossa värit määritellään vaiheilla
const colors = {
    v1: { code: '#f5ec42', name: 'Yellow' },
    v2: { code: '#369e3b', name: 'Green' },
    v3: { code: '#db1616', name: 'Red' },
    /*
    v4: { code: '#00c3ff', name: 'Blue' },
    v5: { code: '#929596', name: 'Grey' },  
    */     
    k: { code: '#000', name: 'Black' },
};

// Väri konteksti
const ColorContext = createContext();

// Väri kontekstin tarjoaja
export const ColorProvider = ({ children }) => {
    // Alkuperäiset valitut värit, joissa jokainen vaihe on taulukko valituista väreistä
    const [selectedColors, setSelectedColors] = useState([]);

    const toggleColor = (color) => {
        setSelectedColors(prevColors =>
            prevColors.includes(color)
                ? prevColors.filter(c => c !== color)
                : [...prevColors, color]
        );
    };

    return (
        <ColorContext.Provider value={{ colors, selectedColors, toggleColor, setSelectedColors }}>
            {children}
        </ColorContext.Provider>
    );
};

// Väri kontekstin käyttö
export const useColors = () => useContext(ColorContext);
