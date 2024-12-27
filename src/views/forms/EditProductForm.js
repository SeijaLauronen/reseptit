import React, { useState, useEffect } from 'react';
import EditForm from './EditForm';
import { InputCommon, Select, InputQuantity, InputUnit, InputTextArea } from '../../components/Input';
import Toast from '../../components/Toast';
import { getCategories } from '../../controller';
import { InputWrapper, ScrollableFormContainer } from '../../components/Container';
import { useSettings } from '../../SettingsContext';
import { useColors } from '../../ColorContext';
import { ColorItemsWrapper, ColorItemContainer, ColorItemContainerLabel, ColorItemSelection, ColorItem } from '../../components/ColorItem';
import styled from 'styled-components';
import { useProductClass } from '../../ProductClassContext';

const StyledDiv = styled.div`
  margin-bottom: 15px;
`;

const StyledInputGroup = styled.div`
  display: grid;
  grid-template-columns: 25% 65%; /* Ensimmäinen sarake on 80px leveä, toinen vie loput tilasta */
  margin-bottom: 15px;
  align-items: center; /* Keskittää sisällön pystysuunnassa */
`;

const Separator = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  background-color: lightgrey;
  height: 2px;
`;

const EditProductForm = ({ product, onSave, onCancel, onDelete, isOpen, editAmount = false }) => {
  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState(product.categoryId || '');
  const [productClassId, setProductClassId] = useState(product.classId || '');
  const [quantity, setQuantity] = useState(product.quantity);
  const [unit, setUnit] = useState(product.unit);
  const [dose, setDose] = useState(product.dose);
  const [prodinfo, setProdinfo] = useState(product.info);

  const [categories, setCategories] = useState([]);
  const { productClasses } = useProductClass(); // Hook:lla, niin pysyy ajantaiset tiedot ilman erillistä hakemista
  const [error, setError] = useState('');

  const { colorCodingEnabled } = useSettings();

  const { colors, colorDefinitions } = useColors(); //Hook
  const [productSelectedColors, setProductSelectedColors] = useState([]);

  const noColor = { code: '#FFF', name: 'White' };

  const fetchAndSetCategories = async () => {
    try {
      const allCategories = await getCategories(false); // aakkosjärjestyksessä
      setCategories(allCategories);
    } catch (err) {
      setError(err.message);
    }
  };


  useEffect(() => {
    fetchAndSetCategories();
  }, []);

  // Alustetaan valitut värit tuotteelle tallennettujen tietojen perusteella

  useEffect(() => {
    const initialProductSelectedColors = Object.keys(colors).filter(colorKey => product[colorKey]);
    setProductSelectedColors(initialProductSelectedColors);
  }, [product, colors]);

  const handleToggleEditColor = (colorKey) => {
    if (productSelectedColors.includes(colorKey)) {
      setProductSelectedColors(productSelectedColors.filter(key => key !== colorKey));
    } else {
      setProductSelectedColors([...productSelectedColors, colorKey]);
    }
  };

  const handleSave = () => {
    if (!editAmount) {
      product.name = name;
      product.categoryId = parseInt(categoryId, 10);
      product.dose = dose;
      product.classId = parseInt(productClassId, 10);
      product.info = prodinfo;
      Object.keys(colors).forEach(colorKey => {
        product[colorKey] = productSelectedColors.includes(colorKey);
      });
    }
    else {
      product.quantity = quantity;
      product.unit = unit;

    }
    onSave(product.id, product);
  };



  // transientti props $isOpen ei käytetä, koska EditForm ei ole styled komponentti
  return (

    <>
      {error && (
        <Toast message={error} onClose={() => setError('')} />
      )}

      <EditForm isOpen={isOpen} onSave={handleSave} onCancel={onCancel} onDelete={() => onDelete(product.id)} deleteEnabled={!editAmount} >
        {!editAmount && (
          <ScrollableFormContainer>
            <StyledInputGroup className='StyledInputGroup'>
              <label>Nimi: </label>
              <InputCommon
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nimi"
              />
            </StyledInputGroup>
            <StyledInputGroup className='StyledInputGroup'>
              <label>Kategoria: </label>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
              >
                <option value=''>Ei kategoriaa</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Select>
            </StyledInputGroup>

            <StyledInputGroup className='StyledInputGroup'>
              <label>Luokka: </label>
              <Select
                value={productClassId}
                onChange={(e) => setProductClassId(parseInt(e.target.value, 10))}
              >
                <option value=''>Ei luokkaa</option>
                {productClasses.map(productClass => (
                  <option key={productClass.id} value={productClass.id}>{productClass.name}</option>
                ))}
              </Select>

            </StyledInputGroup>

            <StyledInputGroup>
              <label>Annos: </label>
              <InputCommon
                type="text"
                value={dose}
                onChange={(e) => setDose(e.target.value)}
                placeholder="Annos"
              />
            </StyledInputGroup>


            {colorCodingEnabled && (
              <StyledDiv>
                <Separator className='Separator' />
                <ColorItemsWrapper className='ColorItemsWrapper'>
                  <label>Tuotteen värikoodit: </label>
                  {Object.keys(colors).map(colorKey => (
                    <ColorItemContainerLabel key={colorKey} >
                      <ColorItem color={productSelectedColors.includes(colorKey) ? colors[colorKey] : noColor} />
                    </ColorItemContainerLabel>
                  ))}
                </ColorItemsWrapper>

                <ColorItemsWrapper className='ColorItemsWrapper'>
                  <label>Valitse: </label>
                  {Object.keys(colors).map(colorKey => (
                    <ColorItemContainer key={colorKey}>

                      <ColorItemSelection
                        color={colors[colorKey]}
                        selected={productSelectedColors.includes(colorKey)}
                        onClick={() => handleToggleEditColor(colorKey)}
                      >{colorDefinitions[colorKey]?.shortname || ''}
                      </ColorItemSelection>
                    </ColorItemContainer>
                  ))}
                </ColorItemsWrapper>
                <Separator className='Separator' />

              </StyledDiv>)
            }
            
            <StyledDiv>
              <label>Muistiinpanot: </label>
              <InputTextArea
                value={prodinfo}
                onChange={(e) => setProdinfo(e.target.value)} // Muutostilan päivitys
                placeholder="Muistiinpanot"
              />
            </StyledDiv>
          </ScrollableFormContainer>
        )}
        {editAmount && (
          <>
            <div>
              <h4> {name} </h4>
            </div>
            <InputWrapper>
              <InputQuantity
                type="number"
                value={quantity || ''}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Määrä"
              />
              <InputUnit
                type="text"
                value={unit || ''}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Yksikkö"
              />
            </InputWrapper>
          </>

        )
        }
      </EditForm>

    </>
  );
};

export default EditProductForm;
