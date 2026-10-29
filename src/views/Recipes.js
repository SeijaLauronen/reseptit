import React, { useState, useEffect } from 'react';
import MyErrorBoundary from '../components/ErrorBoundary';
import Toast from '../components/Toast';
import { RecipeContainer, IconContainer, IconContainerRight, IconWrapper } from '../components/Container';
import { RecipeStickyTop } from '../components/StickyTop';
import StickyBottom from '../components/StickyBottom';
import InputAdd from '../components/Input';
import { SpeechInput, InputName } from '../components/Input';
import { AddButton } from '../components/Button';
import FilterWithCrossIcon, { SearchWithCrossIcon } from '../components/FilterIcon';
import { getRecipes, addRecipe, updateRecipe, deleteRecipe, getProducts, addProduct } from '../controller';
import Accordion from '../components/Accordion';
import { InputWrapper } from '../components/Container';
import { InputTextArea } from '../components/Input';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSave, faUndo, faTrash } from '@fortawesome/free-solid-svg-icons';
import ConfirmDialog from '../components/ConfirmDialog';
import Ingredients from '../components/Ingredients';

const Recipes = ({ refresh = false, isMenuOpen }) => {
    const [error, setError] = useState('');
    const [newRecipe, setNewRecipe] = useState('');
    const [filter, setFilter] = useState('');
    const [countFoundRecipes, setCountFoundRecipes] = useState(0);
    const [products, setProducts] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingRecipeId, setEditingRecipeId] = useState(null);
    const [tempInstructions, setTempInstructions] = useState('');
    const [tempRecipe, setTempRecipe] = useState(null);
    const [ingredientDraft, setIngredientDraft] = useState("");
    const [ingredientAmount, setIngredientAmount] = useState("");
    const [ingredientQuery, setIngredientQuery] = useState("");
    const [selectedProductId, setSelectedProductId] = useState("");
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        message: '',
        onConfirm: null,
        onCancel: null,
    });

    // Yhdistetty data-loadaus
    const loadAllData = async () => {
        setIsLoading(true);

        try {
            const [allRecipes, allProducts] = await Promise.all([
                getRecipes(),
                getProducts(),
            ]);

            setRecipes(allRecipes);
            setProducts(allProducts);
        } catch (err) {
            console.error("loadAllData error:", err);
            setError(err.message || "Dataa ei voitu ladata");
        } finally {
            setIsLoading(false);
        }
    };



    useEffect(() => {
        loadAllData();
    }, [refresh]);

    const fetchAndSetRecipes = async () => {
        try {
            const allRecipes = await getRecipes();
            setRecipes(allRecipes);
        } catch (err) {
            setError(err.message || "Reseptidataa ei voitu ladata");
        }
    };


    const handleRecipeTextChange = (recipeId, value) => {
        setRecipes(prev =>
            prev.map(recipe =>
                recipe.id === recipeId
                    ? { ...recipe, instructions: value }
                    : recipe
            )
        );
    };


    const handleInputChange = (e) => {
        setNewRecipe(e.target.value);
        setError('');
    };

    const handleEditRecipe = (recipe) => {
        setEditingRecipeId(recipe.id);
        setTempRecipe({
            ...recipe,
            ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
            instructions: recipe.instructions || '',
        });
        setIngredientDraft("");
        setSelectedProductId("");
    };

    const handleCancelEdit = () => {
        setEditingRecipeId(null);
        setTempRecipe(null);
    };

    const handleEditRecipeX = (recipe) => {
        setEditingRecipeId(recipe.id);
        setTempInstructions(recipe.instructions || '');
    };

    const handleCancelEditX = () => {
        setEditingRecipeId(null);
        setTempInstructions('');
    };


    const handleSaveRecipe = async (recipeId) => {
        const recipeToUpdate = recipes.find(recipe => recipe.id === recipeId);

        if (!recipeToUpdate || !tempRecipe) return;

        try {
            await updateRecipe(
                recipeId,
                {
                    ...recipeToUpdate,
                    ...tempRecipe,
                }
            );

            setRecipes(prev =>
                prev.map(recipe =>
                    recipe.id === recipeId
                        ? { ...recipe, ...tempRecipe }
                        : recipe
                )
            );

            setEditingRecipeId(null);
            setTempRecipe(null);
        } catch (err) {
            setError(err.message || 'Reseptin tallennus epäonnistui');
        }
    };

    const handleSaveRecipeX = async (recipeId) => {
        const recipeToUpdate = recipes.find(recipe => recipe.id === recipeId);
        // TODO onkohan ihan hyvä laittaa tuo id menemään erikseen, ja tuosta muuttujasta, tarkista
        if (!recipeToUpdate) return;

        try {
            await updateRecipe(
                recipeId,
                {
                    ...recipeToUpdate,
                    instructions: tempInstructions,
                });

            setRecipes(prev =>
                prev.map(recipe =>
                    recipe.id === recipeId
                        ? { ...recipe, instructions: tempInstructions }
                        : recipe
                )
            );

            setEditingRecipeId(null);
            setTempInstructions('');
        } catch (err) {
            setError(err.message || 'Reseptin tallennus epäonnistui');
        }
    };


    const handleAddRecipe = async () => {
        try {

            const newRecipeId = await addRecipe({
                name: newRecipe,
                instructions: '',
            });

            setNewRecipe('');
            fetchAndSetRecipes();
            setFilter(''); // Clear the filter after adding a new recipe

        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteRecipe = (recipe) => {
        setConfirmDialog({
            isOpen: true,
            message: `Haluatko varmasti poistaa reseptin "${recipe.name}"?`,
            onConfirm: async () => {
                try {
                    await deleteRecipe(recipe.id);
                    setRecipes(prev => prev.filter(item => item.id !== recipe.id));
                    setEditingRecipeId(null);
                    setConfirmDialog({ isOpen: false, message: '', onConfirm: null, onCancel: null });
                } catch (err) {
                    setError(err.message || 'Reseptin poisto epäonnistui');
                    setConfirmDialog({ isOpen: false, message: '', onConfirm: null, onCancel: null });
                }
            },
            onCancel: () => {
                setConfirmDialog({ isOpen: false, message: '', onConfirm: null, onCancel: null });
            },
        });
    };

    const handleClearFilter = () => {
        setFilter('');
        setNewRecipe('');
        setCountFoundRecipes(0);
    };


    const handleAddIngredient = (ingredient) => {
        setTempRecipe((prev) => {
            const current = Array.isArray(prev?.ingredients) ? prev.ingredients : [];
            return {
                ...prev,
                ingredients: [...current, ingredient],
            };
        });
    };

    const handleRemoveIngredient = (index) => {
        setTempRecipe((prev) => {
            const current = Array.isArray(prev?.ingredients) ? prev.ingredients : [];
            return {
                ...prev,
                ingredients: current.filter((_, i) => i !== index),
            };
        });
    };


    const handleCreateProductX = async (prodName) => {
        //TODO tämä pitää tarkistaa, että menee niinkuin pitää
        // jos olet jo pannut productin luontifunktion controlleriin:
        // const created = await addProduct({ name });
        // return created;

        let newProdId = null;
        try {
            const addedProdId = await addProduct({ name: prodName });
            newProdId = addedProdId;
        } catch (err) {
            setError(err.message);
        }

        const newProduct = {
            newProdId,
            prodName,
        };

        setProducts((prev) => [...prev, newProduct]);
        return newProduct;
    };


    const handleCreateProductZ = async (prodName) => {
        try {
            const addedProdId = await addProduct({ name: prodName });

            const newProduct = {
                id: addedProdId,
                name: prodName,
            };

            setProducts(prev => [...prev, newProduct]);

            setTempRecipe(prev => ({
                ...prev,
                ingredients: [
                    ...(Array.isArray(prev?.ingredients) ? prev.ingredients : []),
                    {
                        productId: addedProdId,
                        productName: prodName,
                        nickname: "",
                        amount: ingredientAmount || "",
                    }
                ]
            }));

            setIngredientAmount("");
            setIngredientQuery("");
            return newProduct;
        } catch (err) {
            setError(err.message || 'Tuotteen luonti epäonnistui');
            return null;
        }
    };


    const handleCreateProduct = async (prodName) => {
        try {
            const addedProdId = await addProduct({ name: prodName });

            const newProduct = {
                id: addedProdId,
                name: prodName,
            };

            setProducts((prev) => [...prev, newProduct]);

            const ingredientToAdd = {
                productId: addedProdId,
                productName: prodName,
                nickname: "",
                amount: ingredientAmount || "",
            };

            setTempRecipe((prev) => {
                const current = Array.isArray(prev?.ingredients) ? prev.ingredients : [];
                return {
                    ...prev,
                    ingredients: [...current, ingredientToAdd],
                };
            });

            setIngredientAmount("");
            setIngredientQuery("");
            return newProduct;
        } catch (err) {
            setError(err.message || 'Tuotteen luonti epäonnistui');
            return null;
        }
    };


    return (
        <MyErrorBoundary>
            <>
                {error && (
                    <Toast
                        message={error}
                        onClose={() =>
                            setError('')
                        }
                    />
                )}


                <RecipeContainer $isMenuOpen={isMenuOpen} className='recipecontainer'>
                    <RecipeStickyTop className="recipe-sticky-top">
                        <div className="recipes-placeholder">Reseptit - toteutus kesken</div>
                    </RecipeStickyTop>


                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <Accordion
                                key={recipe.id}
                                title={recipe.name}
                                //defaultExpanded={editingRecipeId === recipe.id}
                                isOpenExternally={editingRecipeId === recipe.id}
                                icons={
                                    editingRecipeId === recipe.id ? (
                                        <IconContainer>
                                            <IconWrapper onClick={handleCancelEdit}>
                                                <FontAwesomeIcon
                                                    icon={faUndo}
                                                    style={{ color: 'blue' }}
                                                />
                                            </IconWrapper>

                                        </IconContainer>
                                    ) : (
                                        <IconContainer>
                                            <IconWrapper onClick={() => handleEditRecipe(recipe)}>
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                />
                                            </IconWrapper>
                                        </IconContainer>
                                    )
                                }
                            >
                                {editingRecipeId === recipe.id ? (
                                    <>
                                        <div>
                                            <IconContainerRight>
                                                <IconWrapper onClick={() => handleDeleteRecipe(recipe)}>
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                        color="red"
                                                    />
                                                </IconWrapper>
                                                <IconWrapper onClick={(event) => handleSaveRecipe(recipe.id, event)}>
                                                    <FontAwesomeIcon
                                                        icon={faSave}
                                                        style={{ color: 'green' }}
                                                    />
                                                </IconWrapper>

                                            </IconContainerRight>
                                        </div>

                                        <InputWrapper style={{ width: '80%' }}>
                                            <InputName
                                                type="text"
                                                value={tempRecipe?.name || ''}
                                                onChange={(e) =>
                                                    setTempRecipe(prev => ({ ...prev, name: e.target.value }))
                                                }
                                            />
                                        </InputWrapper>

                                        <Ingredients
                                            products={products}
                                            items={tempRecipe?.ingredients || []}
                                            isEditing={true}
                                            amount={ingredientAmount}
                                            setAmount={setIngredientAmount}
                                            query={ingredientQuery}
                                            setQuery={setIngredientQuery}
                                            onAddIngredient={handleAddIngredient}
                                            onRemoveIngredient={handleRemoveIngredient}
                                            onCreateProduct={handleCreateProduct}
                                        />


                                        <InputWrapper style={{ width: '100%' }}>
                                            <InputTextArea
                                                value={tempRecipe?.instructions || ''}
                                                onChange={(e) =>
                                                    setTempRecipe(prev => ({ ...prev, instructions: e.target.value }))
                                                }
                                                placeholder="Ohje"
                                            />
                                        </InputWrapper>

                                    </>
                                ) : (
                                    <>
                                        <h4>{recipe.name}</h4>
                                        <Ingredients
                                            products={products}
                                            items={recipe.ingredients || []}
                                            isEditing={false}
                                        />
                                        <h4>Ohje</h4>
                                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                                            {recipe.instructions || ''}
                                        </div>
                                    </>
                                )}


                            </Accordion>
                        ))
                    ) : (
                        <div className="no-recipes">Ei reseptejä</div>
                    )}


                    <StickyBottom>

                        <FilterWithCrossIcon className='FilterWithCrossIcon"'
                            $filterEnabled={newRecipe.trim() !== ''}
                            onClick={handleClearFilter}
                            //count={countFoundProducts}
                            //filtertext={newProduct ? `Lkm: ${countFoundProducts}` : ' '}
                            filtertext={' '}
                        />

                        <SpeechInput
                            value={newRecipe}
                            onChange={handleInputChange}
                            placeholder="Etsi tai lisää resepti"
                        />

                        <AddButton onClick={handleAddRecipe} />
                    </StickyBottom>
                </RecipeContainer>
                <ConfirmDialog
                    isOpen={confirmDialog.isOpen}
                    message={confirmDialog.message}
                    onConfirm={confirmDialog.onConfirm}
                    onCancel={confirmDialog.onCancel}
                />

            </>
        </MyErrorBoundary >
    );
};

export default Recipes;