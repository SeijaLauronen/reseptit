import React, { useState, useEffect } from 'react';
import EditForm from './EditForm';
import { InputName, Select, InputQuantity, InputUnit } from '../../components/Input';
import Toast from '../../components/Toast';
import { getCategories } from '../../controller';
import { InputWrapper } from '../../components/Container';
import { useSettings } from '../../SettingsContext';
import { useColors } from '../../ColorContext';
import { ColorItemsWrapper, ColorItemContainer, ColorItemContainerLabel, ColorItemSelection, ColorCheckbox, ColorItem } from '../../components/ColorItem';
import styled from 'styled-components';

const StyledDiv = styled.div`
  margin-bottom: 15px;
`;

const EditProductForm = ({ product, onSave, onCancel, onDelete, isOpen, editAmount = false }) => {
  const [name, setName] = useState(product.name);
  const [categoryId, setCategoryId] = useState(product.categoryId || '');
  const [quantity, setQuantity] = useState(product.quantity);
  const [unit, setUnit] = useState(product.unit);

  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  const { colorCodingEnabled } = useSettings();

  const { colors } = useColors(); //Hook
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
  /*
  useEffect(() => {
    const initialSelectedColors = Object.keys(colors).filter(colorKey => product[colorKey]);
    setSelectedColors(initialSelectedColors);
  }, [product, colors, setSelectedColors]);
  */

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
          <>
            <StyledDiv>
              <label>Nimi </label>
              <InputName
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nimi"
              />
            </StyledDiv>
            <StyledDiv>
              <label>Kategoria </label>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
              >
                <option value=''>Ei kategoriaa</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </Select>
            </StyledDiv>
            {colorCodingEnabled && (
              <StyledDiv>

                <ColorItemsWrapper>
                  <label>Valitse:</label>
                  {Object.keys(colors).map(colorKey => (
                    <ColorItemContainer key={colorKey}>

                      <ColorItemSelection
                        color={colors[colorKey]}
                        selected={productSelectedColors.includes(colorKey)}
                        onClick={() => handleToggleEditColor(colorKey)}
                      />
                    </ColorItemContainer>
                  ))}
                </ColorItemsWrapper>

                <ColorItemsWrapper>
                  <label>Tuotteen värikoodit:</label>
                  {Object.keys(colors).map(colorKey => (

                    <ColorItemContainerLabel key={colorKey} >
                      <ColorItem color={productSelectedColors.includes(colorKey) ? colors[colorKey] : noColor}>
                        {/*colorKey || ''*/}
                      </ColorItem>
                    </ColorItemContainerLabel>

                  ))}
                </ColorItemsWrapper>




              </StyledDiv>)
            }
          </>
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
