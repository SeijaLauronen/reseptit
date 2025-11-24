import React, { useState, useEffect } from 'react';
import Accordion from './Accordion';

const FollowDayPlan = ({ days, productClasses, products }) => {

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
                                                            { productClass ? productClass.name : '- ' }
                                                            {mealClass.products && mealClass.products.length > 0 ? (
                                                                <ul>
                                                                    {selectedProducts.map((product, pIndex) => (
                                                                        <li key={pIndex}>{product.name} {product.dose ? product.dose: ''}</li>                                                                        
                                                                    ))}
                                                                </ul>
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