import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { getDays, addDay, updateDay, deleteDay, getProducts } from '../controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import EditDayForm from './forms/EditDayForm';
import EditMealForm from './forms/EditMealForm';
import { DayStickyTop } from '../components/StickyTop';
import StickyBottom from '../components/StickyBottom';
import InputAdd from '../components/Input';
import { AddButton } from '../components/Button';
import Container, { ButtonGroup, GroupLeft, GroupRight, Group, IconContainer, IconWrapper } from '../components/Container';
import Toast from '../components/Toast';
import MyErrorBoundary from '../components/ErrorBoundary';
import Accordion from '../components/Accordion';
import AccordionDraggable from '../components/AccordionDraggable';
import ItemToggle, { ItemToggleContainer } from '../components/ItemToggle';
import { ColorItemSelection, ColorItemInTitle } from '../components/ColorItem';
import { useProductClass } from '../ProductClassContext'; // Hook
import { useColors } from '../ColorContext'; // Hook
import { useSettings } from '../SettingsContext';
import styled from 'styled-components';
import SwitchButtonComponent from '../components/SwitchButtonCompnent';


const ClassTitleStyled = styled.span`
  font-weight: bold;
  font-size: medium;
  //color: #1f227a;
  color: #3d43e3;
`;

const MealTitleStyled = styled.span`
  font-weight: bold;
  font-size: large;
`;

const DayTitleStyled = styled.span`
  font-weight: bold;
  font-size: larger;
  color: ${(props) => (props.$active ? 'black' : 'grey')};
`;

const DayTitleWrapper = styled.div` 
  display: flex;  
  align-items: center;  

  .activemark {    
    cursor: pointer;
    margin-right: 14px;
    display: inline-flex;
    align-items: center;                             
  }
`;

// TODO onDaySelect...
const Days = ({ refresh = false, isMenuOpen, onDaySelect }) => {

  /*
    const [days, setDays] = useState([
      {
        id: 1,
        name: 'Vaihe 1',
        color: 'c1',
        order: 1,
        meals: [
          {
            mealId: 1, name: 'Aamupala', color: 'c1',
            mealClasses:
              [{ classId: 1, obligator: true, info: "1/2 annosta", products:{3,5,6}  },
              { classId: 4, obligator: false, info: "", products:{1,9}  },
              { classId: 5, obligator: false, info: "" }],
          },
          {
            mealId: 2, name: 'Lounas', color: 'c1',
            mealClasses:
              [{ classId: 1, obligator: true, info: "" },
              { classId: 4, obligator: false, info: "2 annosta" },
              { classId: 5, obligator: false, info: "" }]
          }
        ]
      },
  
      {
        id: 2,
        name: 'Vaihe 2',
        color: 'c2',
        order: 2,
        meals: [
          {
            mealId: 1, name: 'Aamupala', color: 'c1',
            mealClasses:
              [{ classId: 1, obligator: true, info: "1 annosta" },
              { classId: 2, obligator: false, info: "" },
              { classId: 5, obligator: false, info: "" }],
          },
          {
            mealId: 2, name: 'Välipala', color: 'c1',
            mealClasses:
              [{ classId: 1, obligator: true, info: "" },
              { classId: 3, obligator: false, info: "2 annosta" },
              { classId: 5, obligator: false, info: "" }]
          }
        ]
      },
  
    ]);
    */
  const { colorCodingEnabled } = useSettings();
  const { colors, colorDefinitions } = useColors();
  const [products, setProducts] = useState([]);

  const fetchAndSetProducts = async () => {
    try {
      const allProducts = await getProducts();
      setProducts(allProducts);

    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAndSetProducts();
  }, [refresh]); //TODO onkohan tämä ok

  const [days, setDays] = useState([]);

  const fetchAndSetDays = async () => {
    try {
      const allDays = await getDays();
      setDays(allDays);
    } catch (err) {
      setError(err.message);
    }
  };


  useEffect(() => {
    fetchAndSetDays();
  }, [refresh]);


  const [newDay, setNewDay] = useState('');
  const [editingDay, setEditingDay] = useState(null);
  const [isDayFormOpen, setIsDayFormOpen] = useState(false);

  const [newMeal, setNewMeal] = useState('');
  const [editingMeal, setEditingMeal] = useState(null);
  const [isMealFormOpen, setIsMealFormOpen] = useState(false);
  const [error, setError] = useState('');


  // TODO pitäisikö tämä haku tehdä siellä komponenetissa kertaalleen... Tarkista
  const { fetchAndSetProductClasses } = useProductClass();  //Käytetään Hook:ia, että saadaan mahdollisesti päivitetyt tiedot käyttöön heti. itemissä käytetään suoraan productClasses, ei välitetä täältä
  const { productClasses } = useProductClass();
  useEffect(() => {
    fetchAndSetProductClasses(); // Haetaan tuoteryhmät kertaalleen, kun tullaan tälle näkymälle. Hookin kautta päivittyvät,, jos niitä on muutettu
  }, []); // TODO pitääkö laittaa fetchAndSetProductClasses


  // Lähes kaikki muut setting:sit ovat tuolla SettinsContextissa, mutta tätä käytetään vain tässä paikallisesti....
  // Tila alustetaan localStoragesta, jossa etsitään 'dayView' arvoa
  const [showActiveDaysOnly, setShowActiveDaysOnly] = useState(() => {
    const saved = localStorage.getItem('dayView');
    // Tarkistetaan, sisältääkö saved-arvo 'showByCategory'
    return saved === 'showActiveDaysOnly' ? true : false;
  });

  // Tallennetaan localStorageen aina, kun tila muuttuu
  useEffect(() => {
    localStorage.setItem('dayView', showActiveDaysOnly ? 'showActiveDaysOnly' : '');
  }, [showActiveDaysOnly]);

  const [expandedStates, setExpandedStates] = useState({}); // TODO ei tällä oikeasti taida olla tällä hetkellä mitään virkaa...

  const handleAccordionToggle = (id, isExpanded) => {
    setExpandedStates((prev) => ({
      ...prev,
      [id]: isExpanded,
    }));
  };

  const resetExpandedState = () => {
    setExpandedStates({});
  };


  const handleAddDay = async () => {
    try {
      const newOrder = days.length ? Math.max(...days.map(day => day.order)) + 1 : 1;
      await addDay({ name: newDay, order: newOrder });
      setNewDay('');
      fetchAndSetDays();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditDay = (day) => {
    setIsDayFormOpen(true);
    setEditingDay(day);
  };

  const resetForm = () => {
    fetchAndSetDays();
    setEditingDay(null);
    setIsDayFormOpen(false);
    setEditingMeal(null);
    setIsMealFormOpen(false);
  }

  const handleDeleteDay = async (id) => {
    try {
      await deleteDay(id);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };


  const handleSaveDay = async (id, updatedDay) => {
    try {
      await updateDay(id, updatedDay);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  // TODO yhdistä AddMeal ja EditMeal...
  const handleAddMeal = (day) => {

    // Laske uusi mealId päivän nykyisten aterioiden perusteella
    const newMealId = (day.meals && day.meals.length > 0)
      ? Math.max(...day.meals.map((meal) => meal.mealId)) + 1
      : 1;

    const newMeal = {
      mealId: newMealId,
      name: '',
      mealClasses: []
    };
    setIsMealFormOpen(true);
    setEditingMeal(newMeal);
    setEditingDay(day);
    setNewMeal(null);
  };

  const handleEditMeal = (day, meal) => {
    setIsMealFormOpen(true);
    setEditingMeal(meal);
    setEditingDay(day);
  };

  const handleSaveMeal = async (day, updatedMeal) => {
    try {

      // Varmista, että day.meals on aina taulukko
      const meals = Array.isArray(day.meals) ? day.meals : [];
      // const mealExists = (day.meals && day.meals.length > 0) && day.meals.some((meal) => meal.mealId === updatedMeal.mealId);
      const mealExists = meals.some((meal) => meal.mealId === updatedMeal.mealId);

      // Päivitä päivän ateriat
      const updatedDay = {
        ...day,
        meals: mealExists
          ? meals.map((meal) =>
            meal.mealId === updatedMeal.mealId ? updatedMeal : meal
          ) //Päivitä olemassa oleva ateria, käy koko meals-taulukon läpi... Huom ei käy find!!
          :
          [...meals, updatedMeal], // Lisää uuden aterian
      };

      await handleSaveDay(day.id, updatedDay)
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMeal = async (day, mealIdToDelete) => {
    try {
      // Suodata pois ateria, jonka id vastaa mealIdToDelete
      const updatedDay = {
        ...day,
        meals: day.meals.filter((meal) => meal.mealId !== mealIdToDelete),
      };
      await handleSaveDay(day.id, updatedDay)
    } catch (err) {
      setError(err.message); // Tallenna virheviesti
    }
  };

  const handleDragEndDays = async (result) => {
    if (!result.destination) return;
    const reorderedDays = Array.from(days);
    const [removed] = reorderedDays.splice(result.source.index, 1);
    reorderedDays.splice(result.destination.index, 0, removed);

    setDays(reorderedDays);

    try {
      // Päivitetään järjestys tietokantaan
      for (let i = 0; i < reorderedDays.length; i++) {
        reorderedDays[i].order = i + 1; // Päivitetään order kenttä
        await updateDay(reorderedDays[i].id, reorderedDays[i]);
      }
    } catch (err) {
      setError(err.message);
    }
  };


  //Debuggausta varten vain
  /*
  useEffect(() => {
    if (isDayFormOpen && editingDay) {
      alert('auki');
    }
  }, [isDayFormOpen, editingDay]);
*/

  const handleProductSelect = (day, meal, mealClass, product, isProductSelected) => {
    const updatedMealClass = { ...mealClass };
    if (isProductSelected) {
      updatedMealClass.products = updatedMealClass.products || [];
      updatedMealClass.products.push(product.id);
    } else {
      updatedMealClass.products = updatedMealClass.products?.filter(
        (id) => id !== product.id
      );
    }

    // TODO
    // Päivitä mealClasses-tiedot tarvittaessa

    //handleSaveMeal
    const updatedMeal = {
      ...meal,
      mealClasses: meal.mealClasses.map((cls) =>
        cls.classId === updatedMealClass.classId ? updatedMealClass : cls
      ),
    };

    const updatedDay = {
      ...day,
      meals: day.meals.map((m) =>
        m.mealId === updatedMeal.mealId ? updatedMeal : m
      ),
    };

    handleSaveDay(updatedDay.id, updatedDay);

    //console.log('Updated Meal Class:', updatedMealClass);
  };


  const getSortedMealClasses = (mealClasses, productClasses) => {
    if (!mealClasses || !productClasses) return mealClasses; // Jos dataa puuttuu, palautetaan alkuperäinen lista.

    return [...mealClasses].sort((a, b) => {
      // Etsitään productClasses-taulukosta vastaavat productClassit
      const orderA = productClasses.find((pc) => pc.id === a.classId)?.order ?? Infinity;
      const orderB = productClasses.find((pc) => pc.id === b.classId)?.order ?? Infinity;
      // Käytetään numeerista vertailua order-arvoille
      return orderA - orderB;
    });
  };


  // Vaihdetaan päivän aktiivisuus tilaa, eli värikoodia
  const handleToggleDayColor = async (day) => {
    try {
      const updatedDay = {
        ...day,
        active: !day.active, // Vaihda tila
      };

      console.log('Toggling active for', day.name, '->', updatedDay.active);
      await updateDay(day.id, updatedDay);
      // Päivitä tila manuaalisesti, jotta viiveet minimoidaan
      setDays((prevDays) =>
        prevDays.map((d) => (d.id === day.id ? updatedDay : d))
      );
    } catch (err) {
      console.error('Virhe päivitettäessä päivän aktiivisuutta:', err);
      setError('Päivän aktiivisuutta ei voitu tallentaa');
    }
  };

  const toggleActiveDaysOnly = () => {
    setShowActiveDaysOnly(!showActiveDaysOnly);
    setError(null);
  };

  const visibleDays = showActiveDaysOnly
    ? days.filter(day => day.active)
    : days;

  const noActiveMessage = "Valittuja päiviä ei ole, asetetaan kaikki näkymään. " +
  (colorCodingEnabled ? "Päivän voit valita klikkaamalla päivän nimen edessä olevaa painiketta." : "");
  // Container in styled komponentti, käytetään transientti props $isJotain...
  // transientti props $isOpen ei käytetä, koska EditCategoryForm ei ole styled komponentti
  return (
    <MyErrorBoundary>
      <>
        {error && (
          <Toast message={error} onClose={() => setError('')} />
        )}

        {visibleDays.length === 0 && showActiveDaysOnly && (
          <Toast message={noActiveMessage} onClose={toggleActiveDaysOnly} />
        )}

        {isDayFormOpen && editingDay && (

          <EditDayForm
            day={editingDay}
            onSave={handleSaveDay}
            onCancel={() => {
              setEditingDay(null);
              setIsDayFormOpen(false);
            }}
            onDelete={handleDeleteDay}
            isOpen={isDayFormOpen}
          />
        )}

        {isMealFormOpen && editingMeal && (

          <EditMealForm
            day={editingDay}
            meal={editingMeal}
            onSave={handleSaveMeal}
            onCancel={() => {
              setEditingMeal(null);
              setIsMealFormOpen(false);
            }}
            onDelete={handleDeleteMeal}
            isOpen={isMealFormOpen}
          />
        )}

        <Container $isMenuOpen={isMenuOpen} $isDayFormOpen={isDayFormOpen}>
          { /* console.log("expandedStates", expandedStates) */}
          <DayStickyTop>
            <div className="day-header">
              <b>Päiväsuunnitelmat</b>
            </div>

            <div className="day-switch">
              <label>
                Vain valitut
              </label>
              <SwitchButtonComponent
                checked={showActiveDaysOnly}
                onChange={toggleActiveDaysOnly}
              />

            </div>
            <div></div>

          </DayStickyTop>

          <DragDropContext
            onDragEnd={handleDragEndDays}
            onBeforeCapture={(start) => {
              if (start.draggableId.includes("meal")) {
                //if (start.type === "meal") {
                // Estetään ulompi konteksti, kun sisempi alkaa
                document.body.style.pointerEvents = "none";
              }
            }}
            onBeforeDragEnd={() => {
              // Palautetaan normaali tila, kun raahaus loppuu
              document.body.style.pointerEvents = "auto";
            }}
          >
            <Droppable droppableId="droppable-days" type="day">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {visibleDays.map((day, index) => (
                    <AccordionDraggable
                      item={day}
                      key={day.id.toString()}
                      draggableId={'day-' + day.id.toString()}
                      index={index}
                      title={
                        <DayTitleWrapper>
                          {colorCodingEnabled ? (
                            <ColorItemInTitle className='ColorItemInTitle'
                              color={colors[day.color]}
                              //selected={!!day.active} //jos haluttaisiin varmistaa, että varmasti on boolean
                              selected={day.active}
                              onClick={() => handleToggleDayColor(day)}
                            >
                              {colorDefinitions[day.color]?.shortname || ''}
                            </ColorItemInTitle>
                          ) : (
                            <span className='activemark'
                              onClick={() => handleToggleDayColor(day)}
                            >
                              <input
                                type="checkbox"
                                checked={!!day.active}
                                readOnly
                                style={{ pointerEvents: 'none' }}
                              />
                            </span>
                          )}
                          <DayTitleStyled $active={!!day.active}>{day.name}</DayTitleStyled>
                        </DayTitleWrapper>
                      }
                      icons={
                        <IconWrapper className='IconWrapper' onClick={() => handleEditDay(day)}>
                          <FontAwesomeIcon icon={faEdit} />
                        </IconWrapper>
                      }
                      //defaultExpanded={day.order === 1} //ylin päivä oletuksena auki
                      defaultExpanded={true}
                      isExpanded={expandedStates[day.id] || false} // Jos ei ole tallennettua tilaa, oletuksena kiinni
                      onToggle={(isExpanded) => handleAccordionToggle(day.id, isExpanded)}
                      isDroppable={false}
                    >
                      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{day.info}</pre>
                      {day.meals && day.meals.length > 0 ? (
                        day.meals.map((meal, mealIndex) => (
                          meal ? (
                            <Accordion
                              item={meal}
                              key={meal.mealId.toString()}
                              title={<MealTitleStyled>{meal.name}</MealTitleStyled>}
                              defaultExpanded={true}
                              icons={
                                <IconContainer>
                                  <IconWrapper onClick={() => handleEditMeal(day, meal)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                  </IconWrapper>
                                </IconContainer>
                              }
                            >
                              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{meal.info}</pre>
                              {getSortedMealClasses(meal.mealClasses, productClasses)?.map((mealClass) => {
                                //{meal.mealClasses?.map((mealClass) => {
                                const productClass = productClasses.find((p) => p.id === mealClass.classId);
                                const name = productClass?.name || "Vapaa valinta";
                                const info = mealClass.info ? ` ${mealClass.info}` : ""; // Lisätään väli vain, jos info on olemassa
                                const classTitle = mealClass.optional ? `(${name}${info})` : `${name}${info}`;

                                // Muunnetaan mealClass.products lista-arvoksi, ettei löydäm 3:sta, jos listalla on esim. 2,34,64 jne
                                const productIds = mealClass.products
                                  ? String(mealClass.products).replace(/[{}]/g, '').split(',').map(Number)
                                  : [];

                                // Suodatetaan tuotteet, jotka kuuluvat tähän mealClass-luokkaan tai luokkana on vapaa valinta: -1
                                let selectedProducts = products?.filter(
                                  (product) => productIds.includes(product.id) && (mealClass.classId === product.classId || mealClass.classId === -1)
                                );

                                // TODO värikoodilla suodatus myös valittuihin tuotteisiin, eivät siis näy, vaikka olisi valittu                                
                                if (colorCodingEnabled && day.color && day.color !== '') {
                                  selectedProducts = selectedProducts?.filter(
                                    (product) => product[day.color] === true
                                  );
                                };


                                // Luodaan tuotteista nimet ja annokset sisältävä merkkijono                                
                                const selectedProductDetails = selectedProducts
                                  ?.map((product) => {
                                    const details = [product.name, product.dose].filter(Boolean).join(" ");
                                    return details;
                                  })
                                  .join(", "); // Yhdistetään pilkulla erotetuksi merkkijonoksi


                                //const content = `${name} ${info} ${selectedProductDetails || ''}`;

                                // Rakennetaan otsikon sisältö
                                const titleContent = (
                                  <span>
                                    <ClassTitleStyled>{classTitle}</ClassTitleStyled>
                                    {selectedProductDetails ? `: ${selectedProductDetails}` : ""}
                                  </span>
                                );


                                return (
                                  <Accordion classnames="mealClassAccordion"
                                    key={mealClass.classId}
                                    //title={mealClass.optional ? `(${titleContent})` : titleContent}
                                    //title={name}
                                    accordionmini={true}
                                    title={titleContent}
                                    defaultExpanded={false}
                                  >

                                    <ItemToggleContainer>
                                      {products?.map((product) => {
                                        // Muunnetaan mealClass.products lista-arvoksi, ettei löydä esim 3:sta, jos listalla on esim. 2,34,64 jne

                                        let show = true;
                                        if (colorCodingEnabled && day.color && day.color !== '' && product[day.color] !== true) {
                                          show = false;
                                        }

                                        return show &&
                                          (mealClass.classId === product.classId || mealClass.classId === -1) && (
                                            <ItemToggle
                                              key={product.id}
                                              item={product}
                                              print={`${product.name} ${product.dose || ''}`}
                                              isItemSelected={productIds.includes(product.id)}
                                              onSelect={(product, isProductSelected) =>
                                                handleProductSelect(day, meal, mealClass, product, isProductSelected)
                                              }
                                            />
                                          );
                                      })}
                                    </ItemToggleContainer>

                                  </Accordion>
                                );
                              })}
                            </Accordion>
                          ) : (
                            <p key={mealIndex}>Ateriaa ei löydy</p>
                          )
                        ))
                      ) : (
                        <>
                          {/* */}
                        </>

                      )}
                      <GroupRight>
                        <AddButton onClick={() => handleAddMeal(day)}>Lisää ateria</AddButton>
                      </GroupRight>



                    </AccordionDraggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Container>

        <StickyBottom>
          <InputAdd
            type="text"
            value={newDay}
            onChange={(e) => setNewDay(e.target.value)}
            placeholder="Lisää uusi päivä"
          />
          <AddButton onClick={handleAddDay} />
        </StickyBottom>
      </>
    </MyErrorBoundary>
  );
};

export default Days;
