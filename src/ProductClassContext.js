import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProductclasses } from './controller';

const ProductClassContext = createContext();

export const ProductClassProvider = ({ children }) => {
    const [productClasses, setProductClasses] = useState([]);
    const [errorState, setErrorState] = useState(null);

    
    const fetchAndSetProductClasses = async () => {
        try {
            const allProductClasses = await getProductclasses();
            setProductClasses(allProductClasses);
        } catch (error) {
            console.error('Virhe haettaessa tuoteluokituksia :', error);
            setErrorState(`Virhe haettaessa tuoteluokituksia  ${error.message}`);
        }
    };

    const resetProductClasses = () => {        
        setProductClasses([]); // Tyhjennä luokkamäärittelyt        
    };
    
    return (
        <ProductClassContext.Provider value={{ 
            productClasses, 
            setProductClasses, 
            fetchAndSetProductClasses,
            resetProductClasses,
            errorState 
            }}>
            {children}
        </ProductClassContext.Provider>
    );

}

export const useProductClass = () => {
    return useContext(ProductClassContext);
}   
