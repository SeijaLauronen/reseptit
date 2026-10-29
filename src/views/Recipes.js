import React, { useState, useEffect } from 'react';
import MyErrorBoundary from '../components/ErrorBoundary';
import Toast from '../components/Toast';
import { RecipeContainer } from '../components/Container';
import { RecipeStickyTop } from '../components/StickyTop';
import StickyBottom from '../components/StickyBottom';
import InputAdd from '../components/Input';
import { SpeechInput } from '../components/Input';
import { AddButton } from '../components/Button';
import FilterWithCrossIcon, { SearchWithCrossIcon } from '../components/FilterIcon';
import { getRecipes, addRecipe, updateRecipe, deleteRecipe, getProducts } from '../controller';
import Accordion from '../components/Accordion';
import { InputWrapper } from '../components/Container';
import { InputTextArea } from '../components/Input';

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
        setTempInstructions(recipe.instructions || '');
    };

    const handleCancelEdit = () => {
        setEditingRecipeId(null);
        setTempInstructions('');
    };


    const handleSaveRecipe = async (recipeId) => {
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


    const handleClearFilter = () => {
        setFilter('');
        setNewRecipe('');
        setCountFoundRecipes(0);
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
                    <RecipeStickyTop className="day-sticky-top">
                        <div className="recipes-placeholder">Reseptit - toteutus kesken</div>
                    </RecipeStickyTop>


                    {recipes.length > 0 ? (
                        recipes.map((recipe) => (
                            <Accordion
                                key={recipe.id}
                                title={recipe.name}
                                icons={
                                    editingRecipeId === recipe.id ? (
                                        <>
                                            <button onClick={() => handleSaveRecipe(recipe.id)}>Tallenna</button>
                                            <button onClick={handleCancelEdit}>Peruuta</button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEditRecipe(recipe)}>Muokkaa</button>
                                    )
                                }
                            >
                                {editingRecipeId === recipe.id ? (
                                    <InputWrapper>
                                        <InputTextArea
                                            value={tempInstructions}
                                            onChange={(e) => setTempInstructions(e.target.value)}
                                            placeholder="Ohje"
                                        />
                                    </InputWrapper>
                                ) : (
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                                        {recipe.instructions || 'Ei ohjetta'}
                                    </div>
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

            </>
        </MyErrorBoundary >
    );
};

export default Recipes;