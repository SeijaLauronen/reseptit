
import React, { useState, useEffect } from 'react';
import EditForm from './EditForm';
import { ScrollableFormContainer } from '../../components/Container';
import ItemToggle, { ItemToggleContainer } from '../../components/ItemToggle';

const EditFollowDayForm = ({
    isOpen,
    onCancel,
    onSave,
    onDelete,
    title,
    products,           // kaikki tuotteet
    selectedProductIds, // tämän mealClassin products-lista
    classId
}) => {

    // Local selection pidetään numeerisena ja ilman duplikaatteja
    const [localSelection, setLocalSelection] = useState([]);


    // Kun ikkuna avataan TAI selectedProductIds muuttuu, synkataan localSelection
    useEffect(() => {
        if (isOpen) {


            setLocalSelection(
                Array.isArray(selectedProductIds)
                    ? selectedProductIds.map(Number)
                    : []
            );

            //Toka yritys:
            /*
             const arr = Array.isArray(selectedProductIds) ? selectedProductIds.map(Number) : [];
             setLocalSelection(Array.from(new Set(arr.filter(n => !Number.isNaN(n)))));
 
             */
            //console.log("useEffect1", selectedProductIds);

        }
    }, [isOpen, selectedProductIds]);


    // Lisätty synkronointi myös silloin kun propsit muuttuvat vaikka dialogi olisi jo auki

    useEffect(() => {
        const arr = Array.isArray(selectedProductIds) ? selectedProductIds.map(Number) : [];
        const normalized = Array.from(new Set(arr.filter(n => !Number.isNaN(n))));
        // vain jos todellakin erilainen, päivitä
        const same = normalized.length === localSelection.length &&
            normalized.every(id => localSelection.includes(id));
        if (!same) setLocalSelection(normalized);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedProductIds]); // intentionally not listing localSelection



    // Robust toggle: jos ItemToggle antaa isSelected (boolean) käytämme sitä,
    // muuten päätämme tilan kääntämällä nykyisen valinnan.
    const handleToggle = (product, isSelectedFromToggle) => {
        const id = Number(product?.id);
        if (Number.isNaN(id)) return;

        const currentlySelected = localSelection.includes(id);
        const shouldSelect = typeof isSelectedFromToggle === 'boolean' ? isSelectedFromToggle : !currentlySelected;

        setLocalSelection(prev => {
            if (shouldSelect) {
                if (prev.includes(id)) return prev;
                return [...prev, id];
            } else {
                return prev.filter(x => x !== id);
            }
        });
    };


    const handleSave = () => {
        // palauta numeroina ilman duplikaatteja
        const normalized = Array.from(new Set(localSelection.map(Number).filter(n => !Number.isNaN(n))));
        //console.log("EditFollowDayForm handleSave", normalized);
        onSave(normalized);
    };

    return (
        <EditForm
            isOpen={isOpen}
            onSave={handleSave}
            onCancel={onCancel}
            onDelete={onDelete}
            deleteEnabled={false}
        >
            <h3>{title}</h3>

            <ScrollableFormContainer>
                <ItemToggleContainer>
                    {products.map(product => {
                        /*console.log(
                            "Product:", product.id,
                            "type:", typeof product.id,
                            "LocalSelection:", localSelection,
                            "Contains:", localSelection.includes(Number(product.id)),
                            "selectedProductIds:", selectedProductIds
                        );
                        */                        
                        return (
                            <ItemToggle
                                key={product.id}
                                item={product}
                                print={`${product.name} ${product.dose || ''}`}
                                //isItemSelected={localSelection.includes(product.id)}
                                isItemSelected={localSelection.includes(Number(product.id))}
                                onSelect={(item, isSelected) =>
                                    handleToggle(item, isSelected)
                                }
                            />
                        );
                    })}
                </ItemToggleContainer>
            </ScrollableFormContainer>
        </EditForm>
    );
};

export default EditFollowDayForm;


/*
import React, { useState, useEffect } from 'react';
import EditForm from './EditForm';
import { ScrollableFormContainer } from '../../components/Container';
import { CheckboxItem } from '../../components/Item';

//TODO pitää vielä filtteröidä värin mukaan, jos se on valittu!
const EditFollowDayForm = ({
    isOpen,
    onCancel,
    onSave,
    onDelete,
    title,
    products,          // kaikki tuotteet
    selectedProductIds, // tämän mealClassin products-lista
    classId
}) => {

    const [localSelection, setLocalSelection] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setLocalSelection(selectedProductIds || []);
        }
    }, [isOpen, selectedProductIds]);

    const toggleProduct = (productId) => {
        setLocalSelection(prev =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleSave = () => {
        onSave(localSelection);
    };

    // suodatetaan tuotteet productClass.classId:n perusteella
    const filteredProducts = products.filter(p => p.classId === classId);

    return (
        <EditForm
            isOpen={isOpen}
            onSave={handleSave}
            onCancel={onCancel}
            onDelete={onDelete}
            deleteEnabled={false}
        >
            <h3>{title}</h3>

            <ScrollableFormContainer>
                {filteredProducts.map(product => (
                    <>
                        <input type="checkbox"
                            key={product.id}
                            label={product.name}
                            checked={localSelection.includes(product.id)}
                            onChange={() => toggleProduct(product.id)}
                        />
                        <span>{product.name}</span>
                    </>
                ))}
            </ScrollableFormContainer>
        </EditForm>
    );
};

export default EditFollowDayForm;
*/