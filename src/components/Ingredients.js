import React from "react";
import styled from "styled-components";
import { SpeechInput } from "./Input";

const IngredientsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  margin: 10px 0;
`;

const AddRowX = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
`;

const AmountInput = styled.input`
  width: 60px;
  min-width: 60px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-left: 10px;
`;

const SearchWrapX = styled.div`
  position: relative;
  width: 100%;
`;

const AddRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  flex-wrap: nowrap;
`;

const SearchWrapZ = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
  max-width: 100%;
`;

const AddButton = styled.button`
  flex-shrink: 0;
`;

const SearchResultsZ = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 100%;
  margin-top: 2px;
  padding: 6px;
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const SearchResults = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: 95%;  
  max-height: 200px;
  overflow-y: auto;
  margin-top: 2px;
  margin-left: 2px;
  padding: 6px;
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
`;

const SearchResultsX = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 80%;
  margin-top: 4px;
  margin-left: 80px;
  
`;

const ProductOption = styled.button`
  width: 100%;
  text-align: left;
  background: #f4f4f4;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 8px 10px;
  cursor: pointer;
`;

const IngredientList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;
`;

const IngredientItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #eee;
  margin-left: 10px;
  padding: 6px 0;
`;

const IngredientItemReadOnly = styled.div`
  display: flex;
  //justify-content: space-between;
  align-items: center;
  gap: 1px;
  //border-bottom: 1px solid #eee;
  margin: 0px 0px 0px 50px;
  line-height: 1.0;
`;

const IngredientName = styled.div`
  flex: 1;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: none;
  color: #d11a2a;
  cursor: pointer;
  font-weight: bold;
`;

const Ingredients = ({
    products = [],
    items = [],
    isEditing = false,
    amount,
    setAmount,
    query,
    setQuery,
    onAddIngredient,
    onRemoveIngredient,
    onCreateProduct,
}) => {
    const normalizedQuery = (query || "").trim().toLowerCase();

    const filteredProducts = normalizedQuery
        ? products.filter((product) =>
            product.name.toLowerCase().includes(normalizedQuery)
        )
        : [];

    const handleAddCustomIngredient = () => {
        const trimmedName = (query || "").trim();
        const trimmedAmount = (amount || "").trim();

        if (!trimmedName && !trimmedAmount) return;

        onAddIngredient({
            productId: null,
            productName: "",
            nickname: trimmedName || "",
            amount: trimmedAmount || "",
        });

        setQuery("");
        setAmount("");
    };

    const handleSelectProduct = (product) => {
        const trimmedAmount = (amount || "").trim();

        onAddIngredient({
            productId: product.id,
            productName: product.name,
            nickname: "",
            amount: trimmedAmount || "",
        });

        setQuery("");
        setAmount("");
    };

    const handleCreateProductX = async () => {
        const trimmedName = (query || "").trim();
        if (!trimmedName) return;

        const created = await onCreateProduct(trimmedName);

        if (created) {
            onAddIngredient({
                productId: created.id,
                productName: created.name,
                nickname: "",
                amount: (amount || "").trim() || "",
            });

            setQuery("");
            setAmount("");
        }
    };

    const handleCreateProduct = async () => {
        const trimmedName = (query || "").trim();
        if (!trimmedName) return;

        await onCreateProduct(trimmedName);

        setQuery("");
        setAmount("");
    };

    const getDisplayName = (item) => {
        const amountText = item.amount ? `${item.amount} ` : "";
        if (item.nickname) return `${amountText}${item.nickname}`;
        if (item.productName) return `${amountText}${item.productName}`;
        return `${amountText}Tuote`;
    };

    if (!isEditing) {
        return (
            <IngredientsWrapper>
                {items.length === 0 ? (
                    <div>Ei tuotteita</div>
                ) : (
                    <IngredientList>
                        {items.map((item, index) => (
                            <IngredientItemReadOnly key={`${getDisplayName(item)}-${index}`}>
                                <IngredientName>{getDisplayName(item)}</IngredientName>
                            </IngredientItemReadOnly>
                        ))}
                    </IngredientList>
                )}
            </IngredientsWrapper>
        );
    }

    return (
        <IngredientsWrapper>
            {items.length === 0 ? (
                <div>Ei tuotteita</div>
            ) : (
                <IngredientList>
                    {items.map((item, index) => (
                        <IngredientItem key={`${getDisplayName(item)}-${index}`}>
                            <IngredientName>{getDisplayName(item)}</IngredientName>
                            <RemoveButton
                                type="button"
                                onClick={() => onRemoveIngredient(index)}
                            >
                                x
                            </RemoveButton>
                        </IngredientItem>
                    ))}
                </IngredientList>
            )}

            <AddRow>
                <AmountInput
                    type="text"
                    value={amount || ""}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Määrä"
                />

                <SearchWrap>
                    <SpeechInput
                        value={query || ""}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Hae tuotetta tai kirjoita nimitys"
                    />

                    {normalizedQuery && (
                        <SearchResults>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <ProductOption
                                        key={product.id}
                                        type="button"
                                        onClick={() => handleSelectProduct(product)}
                                    >
                                        {product.name}
                                    </ProductOption>
                                ))
                            ) : (                                                                    
                                    <ProductOption type="button" onClick={handleCreateProduct}>
                                        Lisää reseptille ja tuotteisiin "{query.trim()}"
                                    </ProductOption>                                
                            )}
                        </SearchResults>
                    )}
                </SearchWrap>

                <AddButton type="button" onClick={handleAddCustomIngredient}>
                    Reseptiin
                </AddButton>
            </AddRow>



        </IngredientsWrapper>
    );
};

export default Ingredients;