import React, { useEffect, useState } from 'react';
import {
    calculateProductNutrition,
    sumNutrition
} from './fineli/FineliCalculator';
import { nutrientDefinitions } from './fineli/nutrients';

function formatValue(value) {
    if (!Number.isFinite(Number(value))) {
        return '-';
    }

    return Number(value).toFixed(1);
}

function formatAmount(product) {
    const amount = product.fineliAmount;
    const unit = product.fineliUnit;

    if (!amount || !unit) {
        return '-';
    }

    const min = amount.min;
    const max = amount.max;
    const unitName = unit.name || unit.code || '';

    if (min === max) {
        return `${min} ${unitName}`;
    }

    return `${min}–${max} ${unitName}`;
}

function formatGrams(product) {
    const dose = product.fineliDose;

    if (!dose) {
        return '';
    }

    if (dose.min === dose.max) {
        return `(${dose.min} g)`;
    }

    return `(${dose.min}–${dose.max} g)`;
}


function groupProducts(products) {
    const grouped = {};

    products.forEach(product => {
        if (!product?.fineliDose) {
            return;
        }

        const id = product.id;

        if (!grouped[id]) {
            grouped[id] = {
                product,
                min: 0,
                max: 0
            };
        }

        grouped[id].min += Number(product.fineliDose.min) || 0;
        grouped[id].max += Number(product.fineliDose.max) || 0;
    });

    return Object.values(grouped);
}

function getMissingFineliProducts(day, products) {
    const included = new Map();

    (day?.meals || []).forEach(meal => {
        (meal.mealClasses || []).forEach(mealClass => {
            const productIds = mealClass.products
                ? String(mealClass.products)
                    .replace(/[{}]/g, '')
                    .split(',')
                    .map(Number)
                    .filter(Boolean)
                : [];

            productIds.forEach(productId => {
                const product = products.find(
                    p =>
                        p.id === productId &&
                        (mealClass.classId === p.classId || mealClass.classId === -1)
                );

                if (product && !included.has(product.id)) {
                    included.set(product.id, product);
                }
            });
        });
    });

    return [...included.values()].filter(product => {
        const hasMapping =
            product?.fineliId &&
            product?.fineliUnit &&
            product?.fineliAmount &&
            product?.fineliDose;

        return !hasMapping;
    });
}

export default function DayNutrition({ day, products, onOpenEditProduct }) {
    const [nutrition, setNutrition] = useState(null);
    const [nutritionItems, setNutritionItems] = useState([]);
    const missingProducts = getMissingFineliProducts(day, products);

    useEffect(() => {
        let cancelled = false;

        const calculate = async () => {
            const items = [];

            (day?.meals || []).forEach(meal => {
                (meal.mealClasses || []).forEach(mealClass => {
                    const productIds = mealClass.products
                        ? String(mealClass.products)
                            .replace(/[{}]/g, '')
                            .split(',')
                            .map(Number)
                        : [];

                    productIds.forEach(productId => {
                        const product = products.find(
                            p =>
                                p.id === productId &&
                                (
                                    mealClass.classId === p.classId ||
                                    mealClass.classId === -1
                                )
                        );

                        if (product) {
                            items.push(product);
                        }
                    });
                });
            });

            const calculatedItems = [];

            for (const product of items) {
                const result = await calculateProductNutrition(product);

                if (result) {
                    calculatedItems.push(result);
                }
            }

            const total = sumNutrition(calculatedItems);

            if (!cancelled) {
                setNutrition(total);
                setNutritionItems(items);
            }
        };

        if (day && products?.length) {
            calculate();
        } else {
            setNutrition(null);
            setNutritionItems([]);
        }

        return () => {
            cancelled = true;
        };
    }, [day, products]);

    if (!nutrition || Object.keys(nutrition).length === 0) {
        return null;
    }

    return (
        <div>
            <h3>Päivän tuotteet</h3>


            <ul>
                {groupProducts(nutritionItems).map(({ product, min, max }) => (
                    <li key={product.id}
                        style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
                    >
                        <span>
                            {product.name || product.title || `Tuote ${product.id}`}
                            {': '}
                            {min === max
                                ? `${min} g`
                                : `${min}–${max} g`}
                        </span>
                        <button
                            type="button"
                            onClick={() => onOpenEditProduct?.(product)}
                        >
                            Muokkaa
                        </button>

                    </li>
                ))}
            </ul>

            {missingProducts.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                    <h4>Puuttuva Fineli-vastaavuus</h4>
                    <ul>
                        {missingProducts.map(product => (
                            <li
                                key={product.id}
                                style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}
                            >
                                <span>
                                    {product.name || product.title || `Tuote ${product.id}`}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => onOpenEditProduct?.(product)}
                                >
                                    Hae
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <h3>Päivän ravintotiedot</h3>

            <table>
                <thead>
                    <tr>
                        <th>Ravintoaine</th>
                        <th>Min</th>
                        <th>Max</th>
                    </tr>
                </thead>

                <tbody>
                    {(() => {
                        const ordered = Object.entries(nutrition).sort(([aCode, aValues], [bCode, bValues]) => {
                            const aIdx = nutrientDefinitions.findIndex(item => item.code === aCode);
                            const bIdx = nutrientDefinitions.findIndex(item => item.code === bCode);

                            const aKnown = aIdx !== -1;
                            const bKnown = bIdx !== -1;

                            if (aKnown && bKnown) return aIdx - bIdx;
                            if (aKnown) return -1;
                            if (bKnown) return 1;

                            return aCode.localeCompare(bCode);
                        });

                        return ordered.map(([code, values]) => {
                            const definition = nutrientDefinitions.find(item => item.code === code);

                            // Tulostetaan toistaiseksi vain ne ravintoaineet, joilla on määritelty nimi
                            if (!definition?.name) {
                                return null;
                            }

                            return (
                                <tr key={code}>
                                    <td>
                                        {definition?.name || code}
                                        {definition?.unit ? ` (${definition.unit})` : ''}
                                    </td>
                                    <td>{formatValue(values.min)}</td>
                                    <td>{formatValue(values.max)}</td>
                                </tr>
                            );
                        });
                    })()}


                </tbody>
            </table>
        </div>
    );
}

