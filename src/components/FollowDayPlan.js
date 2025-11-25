import React, { useState, useEffect } from 'react';
import Accordion from './Accordion';
import DayProductItem from './Item';
import { InputWrapper } from '../components/Container';


const FollowDayPlan = ({ days =[], productClasses=[], products=[] }) => {
    const [checkedProducts, setCheckedProducts] = useState([]);
    const [initialized, setInitialized] = useState(false);

    // Lataa tallennetut valinnat localStoragesta KERRAN komponentin alussa    
    useEffect(() => {
        const saved = localStorage.getItem('followedPlan');
        if (saved) {
            const savedProducts = JSON.parse(saved);            
            setCheckedProducts(savedProducts);
        }
        setInitialized(true);
    }, []); // Tyhjä riippuvuuslista = suoritetaan vain kerran
    
    
    // Siivoa vanhentuneet tuotteet KUN days on saatavilla JA komponentti on alustettu
    useEffect(() => {
        if (initialized && days.length > 0) {
            const cleanedProducts = cleanCheckedProducts(checkedProducts, days);
            // Varmista että on muutoksia ennen kuin päivität statea, TODO onko pituuden tarkistaminen riittävä...
            if (cleanedProducts.length !== checkedProducts.length) {
                setCheckedProducts(cleanedProducts);
            }
        }
    }, [days, initialized]); // Suoritetaan kun days tai initialized muuttuu
    

 // Tallenna aina kun checkedProducts muuttuu
 
    useEffect(() => {
        if (initialized) {
            localStorage.setItem('followedPlan', JSON.stringify(checkedProducts));
        }
    }, [checkedProducts, initialized]);


      // Siivoaa vanhentuneet tuotteet checkedProducts-taulukosta
    const cleanCheckedProducts = (checkedArray, currentDays) => {
        return checkedArray.filter(key => {
            const [dayId, mealId, productId] = key.split('-').map(Number);
            
            // Etsitään päivä
            const day = currentDays.find(d => d.id === dayId);
            if (!day) return false; // Poistetaan jos päivää ei löydy
            
            // Etsitään ateria
            const meal = day.meals?.find(m => m.mealId === mealId);
            if (!meal) return false; // Poistetaan jos ateriaa ei löydy
            
            // Etsitään tuote aterian mealClassesista
            const productExists = meal.mealClasses?.some(mealClass => {
                const productIds = mealClass.products
                    ? String(mealClass.products).replace(/[{}]/g, '').split(',').map(Number)
                    : [];
                return productIds.includes(productId);
            });
            
            return productExists; // Säilytetään vain jos tuote löytyy
        });
    };

    const handleToggleCheckedProduct = (dayId, mealId, productId) => {
        const key = `${dayId}-${mealId}-${productId}`;
        setCheckedProducts(prev =>
            prev.includes(key)
                ? prev.filter(item => item !== key)
                : [...prev, key]
        );
    }

    const isProductChecked = (dayId, mealId, productId) => {
        const key = `${dayId}-${mealId}-${productId}`;
        return checkedProducts.includes(key);
    }

    return (
        <div>

            {days.map((day, index) => (

                <Accordion key={index} title={day.name} defaultExpanded={true} className='Accordion'>
                    <div key={index}>

                        {day.meals && day.meals.length > 0 ? (
                            <ul>
                                {day.meals.map((meal, mealIndex) => (


                                    <Accordion key={mealIndex} title={meal.name} defaultExpanded={true} accordionmini={true} className='Accordion'>


                                        {meal.mealClasses && meal.mealClasses.length > 0 ? (
                                            <ul>
                                                {meal.mealClasses.map((mealClass, mcIndex) => { /* huom return, koska aaltosulut ja monta lauseketta */
                                                    const productClass = productClasses.find((pc) => pc.id === mealClass.classId);
                                                    // Muunnetaan mealClass.products lista-arvoksi, ettei löydäm 3:sta, jos listalla on esim. 2,34,64 jne
                                                    const productIds = mealClass.products
                                                        ? String(mealClass.products).replace(/[{}]/g, '').split(',').map(Number)
                                                        : [];
                                                    // Suodatetaan tuotteet, jotka kuuluvat tähän mealClass-luokkaan tai luokkana on vapaa valinta: -1
                                                    let selectedProducts = products?.filter(
                                                        (product) => productIds.includes(product.id) && (mealClass.classId === product.classId || mealClass.classId === -1)
                                                    );

                                                    return (
                                                        <li key={mcIndex}>
                                                            {mealClass.info ? mealClass.info + ': ' : ''}
                                                            {productClass ? productClass.name : '- '}
                                                            {mealClass.products && mealClass.products.length > 0 ? (
                                                                <>
                                                                    {selectedProducts.map((product, pIndex) => (
                                                                        <DayProductItem key={pIndex}>
                                                                            <InputWrapper>
                                                                                <input

                                                                                    type="checkbox"
                                                                                    checked={isProductChecked(day.id, meal.mealId, product.id)}
                                                                                    onChange={() => handleToggleCheckedProduct(day.id, meal.mealId, product.id)}
                                                                                />
                                                                                <span>{product.name} {product.dose ? product.dose : ''}</span>
                                                                                <span>{day.id},{meal.mealId},{product.id}</span>
                                                                            </InputWrapper>

                                                                        </DayProductItem>
                                                                    ))}
                                                                </>

                                                            ) : (
                                                                <span> </span>
                                                            )}

                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        ) : (
                                            <p> </p>
                                        )}

                                    </Accordion>
                                ))}
                            </ul>
                        ) : (
                            <p> - </p>
                        )}
                    </div>
                </Accordion>
            ))}
        </div>
    );
};

export default FollowDayPlan;