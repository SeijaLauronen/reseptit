import React, { useState, useEffect } from 'react';
import Accordion from '../components/Accordion';
import StickyBottom from '../components/StickyBottom';
import StickyTop from '../components/StickyTop';
import { OkButton, PrimaryButton, CloseButtonComponent, CopyButton, ShareButton } from '../components/Button';
import { ShoppingListItem } from '../components/Item';
import Container, { SlideInContainerRight, ButtonGroup } from '../components/Container';
import { InputWrapper, GroupLeft, GroupRight } from '../components/Container';
import { InputQuantity, InputUnit, InputPrice } from '../components/Input';
import { getProducts, getProductById, getCategories, updateProduct, updateProducts, getProductsOnShoppingList, updateProductField } from '../controller';
import Info from '../components/Info';
import Toast from '../components/Toast';
import DisabledOverlay from '../components/DisabledOverlay';
import { importShoppinglistData } from '../utils/dataUtils';
import { useSettings } from '../SettingsContext';

const ShoppingList = ({ refresh = false, isMenuOpen }) => {
  const [products, setProducts] = useState([]); //ostolistalla olevat tuotteet
  const [allProducts, setAllProducts] = useState([]); //kaikki tuotteet
  const [categories, setCategories] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [error, setError] = useState('');
  const [shoppingListText, setShoppingListText] = useState('');
  const [importText, setImportText] = useState('');
  const { keepQuantityEnabled } = useSettings();
  const { hideQuantityUnit, hidePrice } = useSettings();
  const noCategoryName = "Ei kategoriaa";

  const handleOpenInfo = (message) => {
    if (message === 'print') {
      const listText = buildShoppingListText();
      setShoppingListText(listText);
    }
    setInfoMessage(message);
    setIsInfoOpen(true);
  };

  const handleCloseInfo = () => {
    setIsInfoOpen(false);
  };

  const handleOpenPrint = () => {
    const listText = buildShoppingListText();
    setShoppingListText(listText);
    setIsPrintOpen(true);
  };

  const handleClosePrint = () => {
    setIsPrintOpen(false);
  };

  const handleOpenImport = () => {
    setIsImportOpen(true);
  };

  const handleCloseImport = () => {
    setIsImportOpen(false);
  };

  const fetchData = async () => {
    try {
      const allProducts = await getProducts();
      const allCategories = await getCategories();
      const shoppingListProducts = allProducts.filter(product => product.onShoppingList);
      setAllProducts(allProducts);
      setProducts(shoppingListProducts);
      setCategories(allCategories);
      const selected = new Set(shoppingListProducts.filter(product => product.selected).map(product => product.id));
      setSelectedProducts(selected);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  useEffect(() => {
    if (isPrintOpen) {
      const listText = buildShoppingListText();
      setShoppingListText(listText);
    }
  }, [isPrintOpen, products, selectedProducts]); // TODO lisättävä buildShoppingListText ?



  // Listalla suljettujen kategorioitten tilat
  const [shoppingClosedCategories, setShoppingClosedCategories] = useState(() => {
    const saved = localStorage.getItem('shoppingClosedCategories');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('shoppingClosedCategories', JSON.stringify(shoppingClosedCategories));
  }, [shoppingClosedCategories]);


  const handleToggleSelect = async (id) => {
    try {
      /* Kopioidaan nykyinen tila newSet:iin, johon muutokset ja jolla korvataan selectedProducts  */
      setSelectedProducts(prevState => {
        const newSet = new Set(prevState);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });

      const product = await getProductById(id);
      product.selected = !product.selected;
      await updateProduct(id, product);
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveSelected = async () => {
    try {
      // Hae kaikki valitut tuotteet id:n perusteella
      const selectedProductIds = Array.from(selectedProducts);
      const selectedProductsArray = await Promise.all(selectedProductIds.map(id => getProductById(id)));

      // Päivitä valitut tuotteet 
      // Luo uuden olion, joka sisältää kaikki alkuperäisen product-olion kentät ja niiden arvot, jonne päivitetään uudet arvot
      const updatedProducts = selectedProductsArray.map(product => ({
        ...product,
        onShoppingList: false,
        selected: false,
        quantity: keepQuantityEnabled ? product.quantity : ""
      }));

      await updateProducts(updatedProducts);

      // Hae päivitetyt tuotteet ostoslistalta ja aseta tilaan
      const shoppingListProducts = await getProductsOnShoppingList();
      setProducts(shoppingListProducts);

      // Tyhjennä valitut tuotteet
      setSelectedProducts(new Set());
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFieldChange = async (id, field, value) => {
    try {
      await updateProductField(id, field, value);
      // Hae päivitetyt tuotteet ostoslistalta ja aseta tilaan
      const shoppingListProducts = await getProductsOnShoppingList();
      setProducts(shoppingListProducts);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleQuantityChange = (id, quantity) => handleFieldChange(id, 'quantity', quantity);
  const handleUnitChange = (id, unit) => handleFieldChange(id, 'unit', unit);
  const handlePriceChange = (id, price) => handleFieldChange(id, 'price', price); //TODO myös yhteen laskeminen

  const parsePrice = (value) => {
    if (!value) return 0;

    // hyväksyy "2", "2.5", "2,5", " 2,50 "
    const normalized = value
      .toString()
      .trim()
      .replace(',', '.');

    const num = Number(normalized);
    return isNaN(num) ? 0 : num;
  };

  const totalPrice = React.useMemo(() => {
    return products.reduce((sum, product) => {
      return sum + parsePrice(product.price);
    }, 0);
  }, [products]);

  const selectedTotalPrice = React.useMemo(() => {
    return products.reduce((sum, product) => {
      if (!selectedProducts.has(product.id)) return sum;
      return sum + parsePrice(product.price);
    }, 0);
  }, [products, selectedProducts]);

  const formatEuro = (value) =>
    value.toLocaleString('fi-FI', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const groupedProducts = categories.reduce((acc, category) => {
    const categoryProducts = products.filter(product => product.categoryId == category.id); //Tarkoituksella == eikä ===
    if (categoryProducts.length > 0) {
      acc.push({
        id: category.id,
        heading: `${category.name} (${categoryProducts.length})`,
        name: `${category.name}`,
        products: categoryProducts,
      });
    }
    return acc;
  }, []);

  // Lisätään tuotteet, joilla ei ole kategoriaa tai kategoriaId ei löydy kategorioista.
  const uncategorizedProducts = products.filter(product => !product.categoryId || !categories.some(category => category.id === product.categoryId));
  if (uncategorizedProducts.length > 0) {
    groupedProducts.unshift({
      id: 'uncategorized',
      heading: noCategoryName + ` (${uncategorizedProducts.length})`,
      name: noCategoryName,
      products: uncategorizedProducts,
    });
  }

  const buildShoppingListText = () => {
    let listText = '';
    groupedProducts.forEach(category => {
      listText += `${category.name}:\n`;
      category.products.forEach(product => {
        const prefix = selectedProducts.has(product.id) ? '*' : '-';
        listText += `${prefix} ${product.name} ${product.quantity || ''} ${product.unit || ''}\n`;
      });
      listText += '\n';
    });
    return listText;
  };

  const handleTextAreaChange = (event) => {
    setShoppingListText(event.target.value);
  };

  const handleImportTextAreaChange = (event) => {
    setImportText(event.target.value);
  };

  const handleCopy = (event) => {
    navigator.clipboard.writeText(shoppingListText);
    resetButtonState(event); // Button väri normaaliksi klikkauksen jälkeen
  };

  const handleShare = (event) => {
    if (navigator.share) {
      navigator.share({
        title: 'Ostoslista',
        text: shoppingListText,
      });
    } else {
      handleOpenInfo('Jakaminen ei ole tuettu tässä selaimessa.');
    }
    resetButtonState(event); // Button väri normaaliksi klikkauksen jälkeen
  };

  //TODO yritetään palauttaa painikkeiden väri klikkauksen jälkeen, ei toimi
  const resetButtonState = (event) => {
    const button = event.currentTarget;
    button.blur();
  };

  const handleImport = async () => {
    try {
      const { addedCategories, addedProducts, updatedProducts } = await importShoppinglistData(importText, categories, allProducts, noCategoryName); // TODO paluuarvoja ei käytetä vielä...
      fetchData();
      setImportText('');
      handleCloseImport();
    } catch (err) {
      setError(err.message);
    }
  };


  // transientti props eli is"Jotain" edessä käytetään $ ettei välity DOM:lle
  return (
    <>
      {error && (
        <Toast message={error} onClose={() => setError('')} />
      )}

      <DisabledOverlay $isDisabled={isPrintOpen || isImportOpen}>
        <Container $isMenuOpen={isMenuOpen} $isPrintOpen={isPrintOpen}>
          <StickyTop>
            <b>Ostoslista</b>
            {!hidePrice && (
              <div>Hinnat: {formatEuro(selectedTotalPrice)} / {formatEuro(totalPrice)} €</div>
            )}
          </StickyTop>
          {groupedProducts.map(category => (
            <Accordion
              key={category.id}
              title={category.heading}
              defaultExpanded={! shoppingClosedCategories.includes(String(category.id))}
              onToggle={(isExpanded) => setShoppingClosedCategories(prev =>
                isExpanded
                  ? prev.filter(id => id !== String(category.id))
                  : [...prev, String(category.id)]
              )}
              accordionmini={true}
              className='Accordion'>
              {category.products.map(product => (
                <ShoppingListItem key={product.id} className='ShoppingListItem'>
                  <InputWrapper>
                    <input
                      disabled={isPrintOpen}
                      type="checkbox"
                      checked={selectedProducts.has(product.id)}
                      onChange={() => handleToggleSelect(product.id)}
                    />
                    <span>{product.name}</span>
                  </InputWrapper>
                  {(!hideQuantityUnit || !hidePrice) && (

                    <InputWrapper className='InputWrapperLow' $low={true}>
                      {!hideQuantityUnit && (
                        <>
                          <InputQuantity
                            lang="fi-FI"  //jotta hyväksyy pisteen puhelimen näppikseltä
                            disabled={isPrintOpen}
                            type="text" //"number" ei hyväksy pistettä, siksi laitetaan text
                            inputMode="decimal"  // tällä saadaan kuitenkin numeronäppäimistö mobiilissa
                            step="any" //vaihtoehtoisesti voidaan laittaa tämä, niin hyväksyy desimaalit (?)
                            min="0"
                            value={product.quantity || ''}
                            onChange={(e) => {
                              let value = e.target.value;
                              if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
                                // ei toimi... 
                                //const value = e.target.value.replace('.', ','); // Korvaa piste pilkulla
                                // value = value.replace('.', ','); // tämä, jos target luettiin jo?
                                handleQuantityChange(product.id, value)
                                //handleQuantityChange(product.id, e.target.value)
                              }
                            }}
                            placeholder="Määrä"
                          />
                          <InputUnit
                            disabled={isPrintOpen}
                            type="text"
                            value={product.unit || ''}
                            onChange={(e) => handleUnitChange(product.id, e.target.value)}
                            placeholder="Yksikkö"
                          />
                        </>
                      )}
                      {!hidePrice && (
                        <InputPrice
                          lang="fi-FI"  //jotta hyväksyy pisteen puhelimen näppikseltä
                          disabled={isPrintOpen}
                          type="text" //"number" ei hyväksy pistettä, siksi laitetaan text
                          inputMode="decimal"  // tällä saadaan kuitenkin numeronäppäimistö mobiilissa
                          step="any" //vaihtoehtoisesti voidaan laittaa tämä, niin hyväksyy desimaalit (?)
                          min="0"
                          value={product.price || ''}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (/^[0-9]*[.,]?[0-9]*$/.test(value)) {
                              // ei toimi... 
                              //const value = e.target.value.replace('.', ','); // Korvaa piste pilkulla
                              // value = value.replace('.', ','); // tämä, jos target luettiin jo?
                              handlePriceChange(product.id, value)
                              //handleQuantityChange(product.id, e.target.value)
                            }
                          }}
                          placeholder="Hinta"
                        />
                      )}

                    </InputWrapper>
                  )}

                </ShoppingListItem>
              ))}
            </Accordion>
          ))}
          <DisabledOverlay $isDisabled={isPrintOpen}>
            <StickyBottom>
              <GroupLeft>
                <OkButton
                  disabled={selectedProducts.size === 0}
                  onClick={handleRemoveSelected}
                >
                  Poista valitut
                </OkButton>
              </GroupLeft>
              <GroupRight>
                <PrimaryButton onClick={handleOpenImport}>Tuo lista</PrimaryButton>
                <ShareButton onClick={handleOpenPrint}>Jaa lista</ShareButton>
              </GroupRight>
            </StickyBottom>
          </DisabledOverlay>
        </Container>
      </DisabledOverlay>

      <SlideInContainerRight $isOpen={isPrintOpen} className='SlideInContainerRight'>
        <CloseButtonComponent onClick={handleClosePrint}></CloseButtonComponent>

        <textarea
          value={shoppingListText}
          onChange={handleTextAreaChange}
          rows="18"
          cols="40"
        />
        <ButtonGroup>
          <GroupLeft>
            <CopyButton onClick={(event) => handleCopy(event)}>Kopioi leikepöydälle</CopyButton>
            <ShareButton onClick={(event) => handleShare(event)}>Jaa lista</ShareButton>
          </GroupLeft>
        </ButtonGroup>

      </SlideInContainerRight>

      <SlideInContainerRight $isOpen={isImportOpen}>
        <CloseButtonComponent onClick={handleCloseImport}></CloseButtonComponent>
        <textarea
          value={importText}
          onChange={handleImportTextAreaChange}
          rows="16"
          cols="40"
          placeholder="Liitä tai kirjoita ostoslista tähän..."
        />
        <ButtonGroup>
          <GroupLeft>
            <PrimaryButton onClick={handleImport}>Tuo lista</PrimaryButton>
          </GroupLeft>
        </ButtonGroup>
      </SlideInContainerRight>
      {isInfoOpen} {
        <Info isOpen={isInfoOpen} onCancel={handleCloseInfo} >
          {infoMessage}
        </Info>
      }
    </>
  );
};


export default ShoppingList;
