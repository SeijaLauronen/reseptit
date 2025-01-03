import React, { useState } from 'react';
import EditForm from './EditForm';
import { InputName, InputTextArea } from '../../components/Input';
import { useColors } from '../../ColorContext';
import { ColorItemContainer, ColorItemSelection, ColorItemDroppable } from '../../components/ColorItem';
import { DropdownButton, DropdownMenu, DropdownWrapper, SelectedItem } from '../../components/DropDown';

const EditDayForm = ({ day, onSave, onCancel, onDelete, isOpen }) => {
  const [name, setName] = useState(day.name);
  const [info, setInfo] = useState(day.info);
  const { colors, colorDefinitions } = useColors();
  const [selectedColor, setSelectedColor] = useState(day.color || null);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const handleSave = () => {
    day.name = name;
    day.info = info;
    day.color = selectedColor;
    onSave(day.id, day);
  };


  const handleColorSelect = (colorKey) => {
    setSelectedColor(colorKey);
    setDropdownOpen(false);
  };


  // Ei transientti props $isOpen, koska EditForm ei ole styled komponentti
  return (
    <EditForm isOpen={isOpen} onSave={handleSave} onCancel={onCancel} onDelete={() => onDelete(day.id)}>
      <h4>Päivän tiedot</h4>
      <div>
        <label>Nimi:</label>
        <InputName
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label>Valitse päivälle väri:</label>
        <DropdownWrapper>
          <DropdownButton onClick={() => setDropdownOpen(!isDropdownOpen)}>
            {selectedColor ? (
              <SelectedItem>
                <ColorItemDroppable
                  color={colors[selectedColor]}
                  style={{ pointerEvents: 'none' }} // Estää valitun värin klikkauksen
                  selected={true}
                >
                  {colorDefinitions[selectedColor]?.shortname || 'Väritön'}
                </ColorItemDroppable>
              </SelectedItem>
            ) : (
              <ColorItemContainer>
                <ColorItemDroppable selected={true}>-</ColorItemDroppable>
              </ColorItemContainer>
            )}
          </DropdownButton>
          {isDropdownOpen && (
            <DropdownMenu>
              <ColorItemContainer>
                <ColorItemDroppable
                  onClick={() => handleColorSelect('')}
                  selected={true}
                >-
                </ColorItemDroppable>
              </ColorItemContainer>

              {Object.keys(colors).map((colorKey) => (
                <ColorItemContainer key={colorKey} onClick={() => handleColorSelect(colorKey)}>
                  <ColorItemDroppable
                    color={colors[colorKey]}
                    selected={true}
                  >
                    {colorDefinitions[colorKey]?.shortname || ''}
                  </ColorItemDroppable>
                </ColorItemContainer>
              ))}


            </DropdownMenu>
          )}
        </DropdownWrapper>
      </div>


      {/*}
      <div>
        <ColorItemsWrapper>
          {Object.keys(colors).map(colorKey => (
            <ColorItemContainer key={colorKey} className='CIContainer'>
              <ColorItemSelection
                className='CISelection'
                color={colors[colorKey]}
                selected={day.color === colorKey}
                //onClick={() => handleToggleDayColor(colorKey)}
              > {colorDefinitions[colorKey]?.shortname || ''}
              </ColorItemSelection>
            </ColorItemContainer>
          ))}
          <ColorItemContainer className='CIContainer'>
            <ColorItemSelection
              className='CISelection'
              color={noColor}
              selected={ !!day.color  || day.color === ''}
              //onClick={() => handleToggleDayColor('noColor')}
            >Väritön
            </ColorItemSelection>
          </ColorItemContainer>
        </ColorItemsWrapper>
      </div>
*/}

      <div>
        <label>Muistiinpanot: </label>
        <InputTextArea
          value={info}
          onChange={(e) => setInfo(e.target.value)} // Muutostilan päivitys
          placeholder="Muistiinpanot"
        />
      </div>
    </EditForm>
  );
};

export default EditDayForm;
