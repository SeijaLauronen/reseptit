import React, { useState, useEffect } from 'react';
import Accordion from './Accordion';
import Item, { DayProductItem, DayClassItem } from './Item';
import { InputWrapper } from '../components/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ChangeButton } from './Button';
import EditFollowDayForm from '../views/forms/EditFollowDayForm';
// TODO allProducts ??

const FollowDayPlan = ({ days = [], setDays, productClasses = [], allProducts = [] }) => {

    const [editPlannedMeal, setPlannedMeal] = useState({
        open: false,
        dayId: null,
        mealId: null,
        mealName: '',
        classIndex: null,
        classId: null,
        className: ''
    });


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

    //(day.id, meal.mealId, meal.name, mcIndex, productClass.id, productClass.name)}
    // const handlechangeProducts = (dayId, mealId, melaName, mealIndex, productClassId, productClassName) => {
    //alert(`Ei vielä toteutettu: Vaihdetaan tuotteita päivä: ${dayId}, ateria: ${mealId}`);
    //alert(`Ei vielä toteutettu: Vaihdetaan tuotteita päivä: ${dayId}, ateria: ${mealId} ${melaName}, mealIndex: ${mealIndex}, tuoteluokka: ${productClassId} ${productClassName}`);

    //  }
    const handlechangeProducts = (dayId, mealId, mealName, classIndex, classId, className) => {
        setPlannedMeal({
            open: true,
            dayId,
            mealId,
            mealName,
            classIndex,
            classId,
            className
        });
    };

    const isProductChecked = (dayId, mealId, productId) => {
        const key = `${dayId}-${mealId}-${productId}`;
        return checkedProducts.includes(key);
    }

    // Apufunktio: palauta kaikki tuotteiden id:t yhdestä mealista
    const getProductIdsFromMeal = (meal) => {
        if (!meal || !meal.mealClasses) return [];
        const ids = meal.mealClasses.flatMap(mc =>
            mc.products
                ? String(mc.products).replace(/[{}]/g, '').split(',').map(s => Number(s)).filter(n => !Number.isNaN(n))
                : []
        );
        // poista duplikaatit
        return Array.from(new Set(ids));
    };

    // Tarkistaa ovatko KAIKKI aterian tuotteet valittuna
    const isDayMealProductsChecked = (dayId, mealId) => {
        // etsi päivä ja ateria
        const day = days.find(d => d.id === dayId);
        if (!day) return false;
        const meal = day.meals?.find(m => m.mealId === mealId);
        if (!meal) return false;

        const allProductIds = getProductIdsFromMeal(meal);
        if (allProductIds.length === 0) return false;

        return allProductIds.every(pid => checkedProducts.includes(`${dayId}-${mealId}-${pid}`));
    };

    // OMA
    const filterProductsForChange = (classId) => {
        const productsForChange = allProducts.filter(p => (classId === -1 ? true : p.classId === classId));
        console.log("filterProductsForChange", classId, productsForChange);
        return productsForChange;
    }

    // Toggle: lisää kaikki tuotteet jos ei kaikki valittu, muuten poistaa kaikki
    const handleToggleCheckedDayMeal = (dayId, mealId) => {
        // etsi päivä ja ateria
        const day = days.find(d => d.id === dayId);
        if (!day) return;
        const meal = day.meals?.find(m => m.mealId === mealId);
        if (!meal) return;

        const productIds = getProductIdsFromMeal(meal);
        if (productIds.length === 0) return;

        // muodosta avaimet
        const mealKeys = productIds.map(pid => `${dayId}-${mealId}-${pid}`);

        setCheckedProducts(prev => {
            const prevSet = new Set(prev);

            const allPresent = mealKeys.every(k => prevSet.has(k));

            if (allPresent) {
                // poista kaikki mealKeys
                const newArr = prev.filter(item => !mealKeys.includes(item));
                return newArr;
            } else {
                // lisää ne, jotka puuttuvat
                const newSet = new Set(prev);
                mealKeys.forEach(k => newSet.add(k));
                return Array.from(newSet);
            }
        });
    };


    // TODO tallennus kantaan asti
    const handleSavePlannedMealChanges = (dialog, newProductIds) => {
        const { dayId, mealId, classIndex } = dialog;

        setDays(prevDays =>
            prevDays.map(day => {
                if (day.id !== dayId) return day;

                return {
                    ...day,
                    meals: day.meals.map(meal => {
                        if (meal.mealId !== mealId) return meal;

                        return {
                            ...meal,
                            mealClasses: meal.mealClasses.map((mc, idx) => {
                                if (idx !== classIndex) return mc;

                                return {
                                    ...mc,
                                    products: newProductIds
                                };
                            })
                        };
                    })
                };
            })
        );

        setPlannedMeal({ open: false });
    };


    const day = days.find(d => d.id === editPlannedMeal.dayId);
    const meal = day?.meals.find(m => m.mealId === editPlannedMeal.mealId);
    const selectedClass = meal?.mealClasses.find(
        mc => mc.classId === editPlannedMeal.classId
    );
    const selectedProductIds = selectedClass?.products || [];
    // console.log("FollowDayPlan selectedProductIds", selectedProductIds);

    return (
        <div>

            <EditFollowDayForm
                isOpen={editPlannedMeal.open}
                title={editPlannedMeal.className}
                classId={editPlannedMeal.classId}
                products={filterProductsForChange(editPlannedMeal.classId)} // suodatetut tuotteet
                selectedProductIds2={days[editPlannedMeal.dayId]
                    ?.meals[editPlannedMeal.mealId]
                    ?.mealClasses.find(mc => mc.classId === editPlannedMeal.classId)
                    ?.products}
                selectedProductIds3={getProductIdsFromMeal(days[editPlannedMeal.dayId]
                    ?.meals[editPlannedMeal.mealId])}
                selectedProductIds={selectedProductIds}
                onCancel={() => setPlannedMeal({ ...editPlannedMeal, open: false })}
                onSave={(newIds) => handleSavePlannedMealChanges(editPlannedMeal, newIds)}
            />


            {days.map((day, index) => (

                <Accordion key={index} title={day.name} defaultExpanded={true} className='Accordion'>
                    <div key={index}>

                        {day.meals && day.meals.length > 0 ? (
                            <>
                                {day.meals.map((meal, mealIndex) => (
                                    <Accordion
                                        key={mealIndex}
                                        title={
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isDayMealProductsChecked(day.id, meal.mealId)}
                                                    onChange={() => handleToggleCheckedDayMeal(day.id, meal.mealId)}
                                                />
                                                <span>{meal.name}</span>
                                            </div>
                                        }
                                        defaultExpanded={true}
                                        accordionmini={true}
                                        className='Accordion'
                                    >
                                        {meal.mealClasses && meal.mealClasses.length > 0 ? (
                                            <>
                                                {meal.mealClasses.map((mealClass, mcIndex) => { /* huom return, koska aaltosulut ja monta lauseketta */
                                                    const productClass = productClasses.find((pc) => pc.id === mealClass.classId);
                                                    // Muunnetaan mealClass.products lista-arvoksi, ettei löydäm 3:sta, jos listalla on esim. 2,34,64 jne
                                                    const productIds = mealClass.products
                                                        ? String(mealClass.products).replace(/[{}]/g, '').split(',').map(Number)
                                                        : [];
                                                    // Suodatetaan tuotteet, jotka kuuluvat tähän mealClass-luokkaan tai luokkana on vapaa valinta: -1
                                                    // TODO kts onko allProducts vai jokin muu...
                                                    let selectedProducts = allProducts?.filter(
                                                        (product) => productIds.includes(product.id) && (mealClass.classId === product.classId || mealClass.classId === -1)
                                                    );

                                                    return (

                                                        <span key={`${day.id}-${meal.mealId}-${mcIndex}`}>
                                                            <DayClassItem>
                                                                <ChangeButton
                                                                    onClick={() => handlechangeProducts(day.id, meal.mealId, meal.name, mcIndex, productClass ? productClass.id : -1, productClass ? productClass.name : "Vapaa valinta")}
                                                                />
                                                                {productClass ? productClass.name : '- '}
                                                                {mealClass.info ? ' ' + mealClass.info + ': ' : ''}
                                                            </DayClassItem>

                                                            {mealClass.products && mealClass.products.length > 0 ? (
                                                                <>
                                                                    {selectedProducts.map((product, pIndex) => (
                                                                        <DayProductItem key={`${day.id}-${meal.mealId}-${product.id}`}>
                                                                            <InputWrapper>
                                                                                <input

                                                                                    type="checkbox"
                                                                                    checked={isProductChecked(day.id, meal.mealId, product.id)}
                                                                                    onChange={() => handleToggleCheckedProduct(day.id, meal.mealId, product.id)}
                                                                                />
                                                                                <span>{product.name} {product.dose ? product.dose : ''}</span>
                                                                            </InputWrapper>

                                                                        </DayProductItem>
                                                                    ))}
                                                                </>

                                                            ) : (
                                                                <span> </span>
                                                            )}

                                                        </span>
                                                    );
                                                })}
                                            </>
                                        ) : (
                                            <p> </p>
                                        )}

                                    </Accordion>
                                ))}
                            </>
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