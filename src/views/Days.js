import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import { getDays, addDay, updateDay, deleteDay } from '../controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import EditDayForm from './forms/EditDayForm';
import EditMealForm from './forms/EditMealForm';
import StickyTop from '../components/StickyTop';
import StickyBottom from '../components/StickyBottom';
import InputAdd from '../components/Input';
import { AddButton } from '../components/Button';
import Container, { ButtonGroup, GroupLeft, GroupRight, Group, IconContainer, IconWrapper } from '../components/Container';
import Toast from '../components/Toast';
import MyErrorBoundary from '../components/ErrorBoundary';
import Accordion from '../components/Accordion';
import AccordionDraggable from '../components/AccordionDraggable';
import { useProductClass } from '../ProductClassContext'; // Hook


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
              [{ classId: 1, obligator: true, info: "1/2 annosta" },
              { classId: 4, obligator: false, info: "" },
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
      name: 'Uusi ateria',
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
        //await updateDay(reorderedDays[i].id, reorderedDays[i]);
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


  // Container in styled komponentti, käytetään transientti props $isJotain...
  // transientti props $isOpen ei käytetä, koska EditCategoryForm ei ole styled komponentti
  return (
    <MyErrorBoundary>
      <>
        {error && (
          <Toast message={error} onClose={() => setError('')} />
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
          <StickyTop>
            <b>Päiväsuunnitelma</b>
          </StickyTop>

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
                  {days.map((day, index) => (
                    <AccordionDraggable
                      item={day}
                      key={day.id.toString()}
                      draggableId={'day-' + day.id.toString()}
                      index={index}
                      title={day.name}
                      icons={
                        <IconContainer>
                          <IconWrapper onClick={() => handleEditDay(day)}>
                            <FontAwesomeIcon icon={faEdit} />
                          </IconWrapper>
                        </IconContainer>
                      }
                      //defaultExpanded={day.order === 1} //ylin päivä oletuksena auki
                      defaultExpanded={true}
                      isDroppable={false}
                    >

                      {day.meals && day.meals.length > 0 ? (
                        day.meals.map((meal, mealIndex) => (
                          meal ? (
                            <Accordion
                              item={meal}
                              key={meal.mealId.toString()}
                              title={<b>{meal.name}</b>}
                              defaultExpanded={true}
                              icons={
                                <IconContainer>
                                  <IconWrapper onClick={() => handleEditMeal(day, meal)}>
                                    <FontAwesomeIcon icon={faEdit} />
                                  </IconWrapper>
                                </IconContainer>
                              }
                            >
                              {meal.mealClasses?.map((mealClass) => {
                                const productClass = productClasses.find((p) => p.id === mealClass.classId);
                                const name = productClass?.name || "Nimetön luokka";
                                const info = mealClass.info || "";
                                const content = `${name} ${info}`;

                                return (
                                  <Accordion
                                    key={mealClass.classId}
                                    title={mealClass.optional ? `(${content})` : content}
                                    defaultExpanded={false}
                                  >
                                    <div>
                                      Tulossa: Tähän listataan vielä luokan tuotteet
                                    </div>
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
                      
                      <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{day.info}</pre>


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
