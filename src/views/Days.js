import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { getDays, addDay, updateDay, deleteDay, getProducts } from '../controller';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import EditDayForm from './forms/EditDayForm';
import EditMealForm from './forms/EditMealForm';
import { DayStickyTop, DayTabStickyTop } from '../components/StickyTop';
import StickyBottom from '../components/StickyBottom';
import InputAdd from '../components/Input';
import { AddButton } from '../components/Button';
import { DayContainer, ButtonGroup, GroupLeft, GroupRight, Group, IconContainer, IconWrapper } from '../components/Container';
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
//import SwitchButtonComponent {ToggleSwitchButton} from '../components/SwitchButtonCompnent';
import SwitchButtonComponent from '../components/SwitchButtonCompnent';
import { ToggleSwitchButton } from '../components/SwitchButtonCompnent';
import { PrimaryButton } from '../components/Button';
import FollowDayPlan from '../components/FollowDayPlan';
import { TabContainer, Tab } from '../components/TabComponents';
import { ClassTitleStyled, MealTitleStyled, DayTitleStyled, DayTitleWrapper } from '../components/DayComponents';
import { TextItem } from '../components/Item';

// TODO onDaySelect...
//const Days = ({ refresh = false, isMenuOpen, onDaySelect }) => {
const Days = ({ refresh = false, isMenuOpen }) => {
  //console.log('Days rendering');

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
          },
          active: true
        ]
      },
  
    ]);
    */
  const { colorCodingEnabled } = useSettings();
  const { colors, colorDefinitions } = useColors();
  const [products, setProducts] = useState([]);
  const [days, setDays] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [productClassesLoaded, setProductClassesLoaded] = useState(false);


  const [tabActive, setTabActive] = useState(() => {
    const follow = localStorage.getItem('followPlan');
    return follow === 'followPlan' ? 'Toteutus' : 'Suunnittelu';
  });

  //TODO järkeistä followPlan ja tabActive
  /*
  const [tabActive, setTabActive] = useState(() => {
    const saved = localStorage.getItem('tabActive');
    return saved || 'Suunnittelu';
  });

  const followPlan = tabActive === 'Toteutus';
  */

  // Yhdistetty data-loadaus
  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [allDays, allProducts] = await Promise.all([
        getDays(),
        getProducts(),
      ]);
      setDays(allDays);
      setProducts(allProducts);
    } catch (err) {
      console.error("loadAllData error:", err);
      setError(err.message || "Dataa ei voitu ladata");
    } finally {
      setIsLoading(false);
    }
  };


  // Lataa productClasses erikseen
  useEffect(() => {
    const loadProductClasses = async () => {
      try {
        await fetchAndSetProductClasses();
        setProductClassesLoaded(true);
      } catch (err) {
        console.error("ProductClasses load error:", err);
        setError("Tuoteluokkia ei voitu ladata");
        setProductClassesLoaded(false);
      }
    };

    loadProductClasses();
  }, []);


  useEffect(() => {
    loadAllData();
  }, [refresh]);


  const fetchAndSetDays = async () => {
    try {
      const allDays = await getDays();
      setDays(allDays);
    } catch (err) {
      setError(err.message || "Päivädataa ei voitu ladata");
    }
  };


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

  // Myös tämä käytössä vain tällä komponentilla
  const [followPlan, setFollowPlan] = useState(() => {
    const follow = localStorage.getItem('followPlan');
    return follow === 'followPlan' ? true : false;
  });

  // Tallennetaan localStorageen aina, kun tila muuttuu
  useEffect(() => {
    localStorage.setItem('followPlan', followPlan ? 'followPlan' : '');
  }, [followPlan]);

  //const [expandedStates, setExpandedStates] = useState({}); // Avattujen accordionien tilat, säilyy vain tällä komponentilla
  const [dayPlanOpenItems, setDayPlanOpenItems] = useState(() => {
    const saved = localStorage.getItem('dayPlanOpenItems');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('dayPlanOpenItems', JSON.stringify(dayPlanOpenItems));
  }, [dayPlanOpenItems]);

  /*
  const handleAccordionToggle = (id, isExpanded) => {
    setDayPlanOpenItems((prev) => ({
      ...prev,
      [id]: isExpanded,
    }));
  };

  const resetExpandedState = () => {
    setDayPlanOpenItems({});
  };
*/

  const handleAddDay = async () => {
    try {
      const newOrder = days.length ? Math.max(...days.map(day => day.order)) + 1 : 1;
      const newDayId = await addDay({ name: newDay, active: true, order: newOrder });
      setNewDay('');
      fetchAndSetDays();

      setDayPlanOpenItems((prev) => [...prev, String(newDayId)]);

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
      // Poista päivään liittyvät merkinnät localStoragesta
      setDayPlanOpenItems((prev) =>
        prev.filter(item => {
          // Poista day.id ja kaikki "day.id-meal.id" merkinnät
          return !item.startsWith(String(id)) && item !== String(id);
        })
      );

      // Sama closedItemsExecution:lle FollowDayPlanissa
      const closedItems = localStorage.getItem('closedItemsExecution');
      if (closedItems) {
        const parsed = JSON.parse(closedItems);
        const filtered = parsed.filter(item => {
          return !item.startsWith(String(id)) && item !== String(id);
        });
        localStorage.setItem('closedItemsExecution', JSON.stringify(filtered));
      }
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

    // Laske uusi order samalla tavalla kuin päivillä
    const newOrder = (day.meals && day.meals.length > 0)
      ? Math.max(...day.meals.map((meal) => meal.order ?? meal.mealId)) + 1
      : 1;

    const newMeal = {
      mealId: newMealId,
      order: newOrder,
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
      // Poista ateriaan liittyvä merkintä localStoragesta
      const mealKey = `${day.id}-${mealIdToDelete}`;

      setDayPlanOpenItems((prev) =>
        prev.filter(item => item !== mealKey)
      );

      // Sama closedItemsExecution:lle
      const closedItems = localStorage.getItem('closedItemsExecution');
      if (closedItems) {
        const parsed = JSON.parse(closedItems);
        const filtered = parsed.filter(item => item !== mealKey);
        localStorage.setItem('closedItemsExecution', JSON.stringify(filtered));
      }

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



  const handleDragEndMeals = async (dayId, result) => {
    if (!result.destination) return;

    // Etsi muokattava päivä
    const dayIndex = days.findIndex(d => d.id === dayId);
    if (dayIndex === -1) return;

    const updatedDays = Array.from(days);
    const day = { ...updatedDays[dayIndex] };
    const reorderedMeals = Array.from(day.meals || []);

    // Siirrä ateria
    const [removed] = reorderedMeals.splice(result.source.index, 1);
    reorderedMeals.splice(result.destination.index, 0, removed);

    // Päivitä order numerot
    const mealsWithOrder = reorderedMeals.map((meal, index) => ({
      ...meal,
      order: index + 1
    }));

    // Päivitä päivä uusilla aterioilla
    day.meals = mealsWithOrder;
    updatedDays[dayIndex] = day;

    setDays(updatedDays);

    try {
      // Tallenna muutokset tietokantaan
      await updateDay(dayId, day);
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

  const getSortedMealsForDay = (day) => {
    if (!day || !day.meals || day.meals.length === 0) return [];

    return [...day.meals].sort((a, b) =>
      (a.order ?? a.mealId) - (b.order ?? b.mealId)
    );
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


  const toggleFollowPlan = () => {
    setFollowPlan(!followPlan);
    setError(null);
  };

  const handleTabClick = (tabName) => () => {
    setTabActive(tabName);
    tabName === 'Toteutus' ? setFollowPlan(true) : setFollowPlan(false);
  };

  const visibleDays = showActiveDaysOnly
    ? days.filter(day => day.active)
    : days;


  const noActiveFolloMessage = "Aktivoituja päiviä ei ole, valitse kaikki päivät näkymään. " +
    "Päivän voit aktivoida klikkaamalla päivän nimen edessä olevaa painiketta.";

  const noActiveMessage = "Aktivoituja päiviä ei ole, asetetaan kaikki näkymään. " +
    "Päivän voit aktivoida klikkaamalla päivän nimen edessä olevaa painiketta.";

  const noDaysMessage = "Päiviä ei ole määriteltynä. Lisää ensin päiviä suunnittelun puolella. ";
  // Container in styled komponentti, käytetään transientti props $isJotain...
  // transientti props $isOpen ei käytetä, koska EditCategoryForm ei ole styled komponentti

  // Älä renderöi mitään ennen kuin data on ladattu


  if (isLoading || !productClassesLoaded) {
    return <div></div>;
  }

  // TODO Tämä siistimmäksi! Ei noin paljon sisäkkäisiä rakenteita
  return (
    <MyErrorBoundary>
      <>
        {error && (
          <Toast message={error} onClose={() => setError('')} />
        )}

        {visibleDays.length === 0 && showActiveDaysOnly && !followPlan && (
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

        <DayContainer $isMenuOpen={isMenuOpen} $isDayFormOpen={isDayFormOpen} className='daycontainer'>
          { /* console.log("expandedStates", expandedStates) */}
          <DayStickyTop>
            <div className="topHeader">
              <ToggleSwitchButton
                checked={showActiveDaysOnly}
                onChange={toggleActiveDaysOnly}
                leftLabel="Kaikki päivät"
                rightLabel="Vain aktivoidut"
              />
            </div>

            <div className="tab-row">
              <TabContainer className="tab-container">
                <Tab
                  $active={tabActive === 'Suunnittelu'}
                  onClick={handleTabClick('Suunnittelu')}
                >
                  Suunnittelu
                </Tab>
                <Tab
                  $active={tabActive === 'Toteutus'}
                  onClick={handleTabClick('Toteutus')}
                >
                  Toteutus
                </Tab>
              </TabContainer>
            </div>

          </DayStickyTop>
          <DayTabStickyTop />

          {followPlan ? (
            visibleDays.length > 0 ? (
              <FollowDayPlan
                days={visibleDays}
                setDays={setDays}
                productClasses={productClasses}
                allProducts={products}
                colors={colors}
                colorCodingEnabled={colorCodingEnabled}
                colorDefinitions={colorDefinitions}
                onSaveDay={handleSaveDay}
                onToggleDayActive={handleToggleDayColor}
              />
            ) : (
              days.length > 0 ?
                <div><TextItem>{noActiveFolloMessage}</TextItem></div>
                :
                <div><TextItem>{noDaysMessage}</TextItem></div>
            )
          ) : (

            days.length > 0 ? (
              <div className='daydiv'>
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
                                  <ColorItemInTitle className='ColorItemInTitle'
                                    color={null}
                                    //selected={!!day.active} //jos haluttaisiin varmistaa, että varmasti on boolean
                                    selected={day.active}
                                    onClick={() => handleToggleDayColor(day)}
                                  >
                                  </ColorItemInTitle>
                                )}
                                <DayTitleStyled $active={!!day.active}>{day.name}</DayTitleStyled>
                              </DayTitleWrapper>
                            }
                            icons={
                              <IconWrapper className='IconWrapper' onClick={() => handleEditDay(day)}>
                                <FontAwesomeIcon icon={faEdit} />
                              </IconWrapper>
                            }
                            defaultExpanded={dayPlanOpenItems.includes(String(day.id))}
                            onToggle={(isExpanded) => setDayPlanOpenItems(prev =>
                              isExpanded
                                ? [...prev, String(day.id)]
                                : prev.filter(id => id !== String(day.id))
                            )}
                            isDroppable={false}
                          >
                            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{day.info}</pre>

                            {day.meals && day.meals.length > 0 ? (
                              <DragDropContext onDragEnd={(result) => handleDragEndMeals(day.id, result)}>
                                <Droppable droppableId={`droppable-meals-${day.id}`} type="meal">
                                  {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef}>
                                      {getSortedMealsForDay(day).map((meal, mealIndex) => (
                                        meal ? (
                                          <AccordionDraggable
                                            item={{ ...meal, id: meal.mealId }}
                                            key={meal.mealId.toString()}
                                            draggableId={`meal-${day.id}-${meal.mealId}`}
                                            index={mealIndex}
                                            title={<MealTitleStyled>{meal.name}</MealTitleStyled>}
                                            defaultExpanded={dayPlanOpenItems.includes(`${day.id}-${meal.mealId}`)}
                                            onToggle={(isExpanded) => setDayPlanOpenItems(prev =>
                                              isExpanded
                                                ? [...prev, `${day.id}-${meal.mealId}`]
                                                : prev.filter(id => id !== `${day.id}-${meal.mealId}`)
                                            )}
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
                                          </AccordionDraggable>
                                        ) : (
                                          <p key={mealIndex}>Ateriaa ei löydy</p>
                                        )
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </DragDropContext>
                            ) : (
                              <>
                                {/* Aterioita ei ole määritelty */}
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
              </div>
            )
              :
              <div><TextItem>{noDaysMessage}</TextItem></div>

          )}

        </DayContainer>

        {!followPlan && (
          <StickyBottom>
            <InputAdd
              type="text"
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              placeholder="Lisää uusi päivä"
            />
            <AddButton onClick={handleAddDay} />
          </StickyBottom>
        )
        }

      </>
    </MyErrorBoundary>
  );
};

export default Days;
