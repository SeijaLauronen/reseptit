import React, { useState, useRef, useEffect } from 'react';
import EditForm from './EditForm';
import { InputName, InputTextArea } from '../../components/Input';
import { ProductClassSelectItem, ProductClassSelectionHeader } from '../../components/Item';
import { useProductClass } from '../../ProductClassContext';

const EditMealForm = ({ day, meal, onSave, onCancel, onDelete, isOpen }) => {
  const [name, setName] = useState(meal.name);
  const [mealInfo, setMealInfo] = useState(meal.info);
  const { productClasses } = useProductClass();

  // Luodaan extendedProductClasses, joka sisältää alkuperäiset productClasses ja uuden luokan "Ei luokkaa"
  const [extendedProductClasses, setExtendedProductClasses] = useState(() => [
    ...(productClasses || []),
    { id: -1, name: "Vapaa valinta" },
  ]);

  useEffect(() => {
    // Päivitetään extendedProductClasses aina, kun productClasses muuttuu
    setExtendedProductClasses([
      ...productClasses,
      { id: -1, name: "Vapaa valinta" }
    ]);
  }, [productClasses]); // Vain silloin, kun productClasses muuttuu


  // Alustetaan valinnat: katsotaan, mitkä luokat on tallennettu mealClasses:ssa
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initialState = {};
    extendedProductClasses.forEach((productClass) => {
      const existingClass = meal.mealClasses.find((mc) => mc.classId === productClass.id) || {};
      initialState[productClass.id] = {
        selected: !!existingClass.classId, // On valittu, jos classId löytyy mealClasses:sta
        optional: !!existingClass.optional, // On valinnainen, jos optional on true
      };
    });
    return initialState;
  });

  const infoRefs = useRef({});

  const handleSave = () => {
    const updatedMealClasses = Object.keys(selectedOptions)
      .filter((classId) => selectedOptions[classId].selected) // Vain valitut luokat
      .map((classId) => {
        // Etsi olemassa oleva mealClass, jos se on olemassa
        const existingClass = meal.mealClasses.find((mc) => mc.classId === parseInt(classId, 10)) || {};

        // Palauta yhdistetty objekti, jossa uudet arvot korvaavat vain tarvittavat kentät!
        return {
          ...existingClass, // Olemassa olevat tiedot
          classId: parseInt(classId, 10), // Päivitä aina classId
          optional: selectedOptions[classId].optional, // Korvaa tai lisää "optional"
          info: infoRefs.current[classId]?.value || "", // Korvaa tai lisää "info"
        };
      });

    const updatedMeal = {
      ...meal,
      name,
      info:mealInfo,
      mealClasses: updatedMealClasses,
    };

    onSave(day, updatedMeal);
  };


  const handleCheckboxChange = (classId, type) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [classId]: {
        selected: true, // Valinta on tehty
        optional: type === "optional",
      },
    }));
  };

  const handleDeselect = (classId) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [classId]: { selected: false, optional: false },
    }));
  };

  return (
    <EditForm isOpen={isOpen} onSave={handleSave} onCancel={onCancel} onDelete={() => onDelete(day, meal.mealId)}>
      <div>
        <label>Aterian nimi:</label>
        <InputName
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Aamiainen, lounas,..."
        />
        <div>
          <p>Valitse aterian koostavat luokat joko pakollisena (P) tai valinnaisena (V)</p>
        </div>

        <ProductClassSelectionHeader>
          <div></div> {/* Tyhjä paikka nimelle */}
          <span>P</span>
          <span>V</span>
          <div>Lisätieto, esim. annos muu kuin 1</div>
        </ProductClassSelectionHeader>

        {extendedProductClasses.map((productClass) => (
          <ProductClassSelectItem key={productClass.id}>
            <input
              type="checkbox"
              checked={selectedOptions[productClass.id]?.selected && !selectedOptions[productClass.id]?.optional}
              onChange={(e) => {
                if (e.target.checked) {
                  handleCheckboxChange(productClass.id, "mandatory");
                } else {
                  handleDeselect(productClass.id);
                }
              }}
            />
            <input
              type="checkbox"
              checked={selectedOptions[productClass.id]?.optional}
              onChange={(e) => {
                if (e.target.checked) {
                  handleCheckboxChange(productClass.id, "optional");
                } else {
                  handleDeselect(productClass.id);
                }
              }}
            />
            <input
              type="text"
              ref={(el) => (infoRefs.current[productClass.id] = el)} // Tallenna ref
              placeholder="Lisätieto"
              defaultValue={
                meal.mealClasses.find((mc) => mc.classId === productClass.id)?.info || ""
              } // Näytä olemassa oleva tieto
            />
            <div>{productClass.name}</div>
          </ProductClassSelectItem>
        ))}
      </div>
      <div>
        <label>Muistiinpanot: </label>
        <InputTextArea
          value={mealInfo}
          onChange={(e) => setMealInfo(e.target.value)} // Muutostilan päivitys
          placeholder="Muistiinpanot"
          style={{
            maxHeight: "60px", // Maksimikorkeus            
          }}
        />
      </div>
    </EditForm>
  );
};

export default EditMealForm;
