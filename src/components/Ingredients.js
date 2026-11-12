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


const AmountInput = styled.input`
  width: 60px;
  min-width: 60px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin-left: 10px;
`;


const AddRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  flex-wrap: nowrap;
`;

const EditRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 80%;
  flex-wrap: nowrap;
  background-color: #cbe3a3;
`;

const EditFields = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1 1 auto;
  min-width: 0;
`;

const EditActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
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

const ActionButtons = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
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
    selectedProductId,
    setSelectedProductId,
    editingIndex,
    tempIngredient,
    setTempIngredient,
    onStartEdit,
    onCancelEdit,
    onSaveEdit,
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

    const handleCreateProduct = async () => {
        const trimmedName = (query || "").trim();
        if (!trimmedName) return;

        await onCreateProduct(trimmedName);
    };

    const handleAddSelectedIngredient = () => {
        const trimmedAmount = (amount || "").trim();

        if (!selectedProductId && !(query || "").trim()) return;

        if (selectedProductId) {
            const product = products.find(
                (p) => String(p.id) === String(selectedProductId)
            );

            if (product) {
                onAddIngredient({
                    productId: product.id,
                    productName: product.name,
                    nickname: "",
                    amount: trimmedAmount || "",
                });
            }
        } else {
            const trimmedName = (query || "").trim();
            if (!trimmedName) return;

            onAddIngredient({
                productId: null,
                productName: "",
                nickname: trimmedName,
                amount: trimmedAmount || "",
            });
        }

        setQuery("");
        setAmount("");
        setSelectedProductId("");
    };

    const getDisplayName = (item) => {
        const amountText = item.amount ? `${item.amount} ` : "";
        if (item.nickname) return `${amountText}${item.nickname}`;
        if (item.productName) return `${amountText}${item.productName}`;
        return `${amountText}Tuote`;
    };


    const renderIngredientRow = (item, index) => {
        const isEditingThis = editingIndex === index;

        if (isEditingThis && tempIngredient) {
            const editValue = tempIngredient.nickname || tempIngredient.productName || "";
            const filteredEditProducts = editValue.trim()
                ? products.filter((product) =>
                    product.name.toLowerCase().includes(editValue.trim().toLowerCase())
                )
                : [];

            return (

                <EditRow key={`${item.productName || item.nickname || "ingredient"}-${index}`}>
                    <IngredientName style={{ display: "flex", gap: 8, alignItems: "center", width: "100%" }}>
                        <EditFields>
                            <AmountInput
                                type="text"
                                value={tempIngredient.amount || ""}
                                onChange={(e) =>
                                    setTempIngredient(prev => ({ ...prev, amount: e.target.value }))
                                }
                                placeholder="Määrä"
                            />

                            <SearchWrap style={{ flex: 1 }}>
                                <SpeechInput
                                    value={editValue}
                                    onChange={(e) =>
                                        setTempIngredient(prev => ({
                                            ...prev,
                                            nickname: e.target.value,
                                            productName: "",
                                            productId: "",
                                        }))
                                    }
                                    placeholder="Tuote tai nimitys"
                                />

                                {editValue && (
                                    <SearchResults>
                                        {filteredEditProducts.length > 0 ? (
                                            filteredEditProducts.map((product) => (
                                                <ProductOption
                                                    key={product.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setTempIngredient(prev => ({
                                                            ...prev,
                                                            productId: product.id,
                                                            productName: product.name,
                                                            nickname: "",
                                                        }))
                                                    }
                                                >
                                                    {product.name}
                                                </ProductOption>
                                            ))
                                        ) : (
                                            <ProductOption
                                                type="button"
                                                onClick={async () => {
                                                    const created = await onCreateProduct(editValue.trim());
                                                    if (created) {
                                                        setTempIngredient(prev => ({
                                                            ...prev,
                                                            productId: created.id,
                                                            productName: created.name,
                                                            nickname: "",
                                                        }));
                                                    }
                                                }}
                                            >
                                                Lisää tuotteisiin: "{editValue.trim()}"
                                            </ProductOption>
                                        )}
                                    </SearchResults>
                                )}
                            </SearchWrap>
                        </EditFields>
                    </IngredientName>

                    <EditActions>
                        <button type="button" onClick={() => onSaveEdit(index)}>Tallenna</button>
                        <button type="button" onClick={onCancelEdit}>Peru</button>
                    </EditActions>

                </EditRow>
            );
        }

        return (
            <IngredientItem key={`${item.productName || item.nickname || "ingredient"}-${index}`}>
                <IngredientName>{getDisplayName(item)}</IngredientName>

                <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={() => onStartEdit(index, item)}>Muokkaa</button>
                    <RemoveButton type="button" onClick={() => onRemoveIngredient(index)}>x</RemoveButton>
                </div>
            </IngredientItem>
        );
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
                <>
                    <IngredientList>
                        {items.map((item, index) => renderIngredientRow(item, index))}
                    </IngredientList>
                    {/*
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
                    */}
                </>
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
                        placeholder="Hae tai anna ainesosa"
                    />

                    {normalizedQuery && (
                        <>
                            <SearchResults>
                                {filteredProducts.length > 0 ? (
                                    filteredProducts.map((product) => (
                                        <ProductOption
                                            key={product.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedProductId(String(product.id));
                                                setTempIngredient(prev => ({
                                                    ...prev,
                                                    productId: product.id,
                                                    productName: product.name,
                                                    nickname: "",
                                                }));
                                                setQuery(product.name);
                                            }}
                                        >
                                            {product.name}
                                        </ProductOption>
                                    ))
                                ) : (
                                    <ProductOption
                                        type="button"
                                        onClick={async () => {
                                            const created = await onCreateProduct(query.trim());
                                            if (created) {
                                                setTempIngredient(prev => ({
                                                    ...prev,
                                                    productId: created.id,
                                                    productName: created.name,
                                                    nickname: "",
                                                }));
                                            }
                                            setQuery("");
                                        }}
                                    >
                                        Lisää tuotteeseen: "{query.trim()}"
                                    </ProductOption>
                                )}
                            </SearchResults>
                            {/*
                        <SearchResults>
                            {filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <ProductOption
                                        key={product.id}
                                        type="button"
                                        //onClick={() => handleSelectProduct(product)}
                                        onClick={() => {
                                            setQuery(product.name);
                                            setSelectedProductId(String(product.id));
                                        }}
                                    >
                                        {product.name}
                                    </ProductOption>
                                ))
                            ) : (
                                <ProductOption type="button" onClick={handleCreateProduct}>
                                    Lisää tuotteisiin "{query.trim()}"
                                </ProductOption>
                            )}
                        </SearchResults>
                        */}
                        </>
                    )}
                </SearchWrap>

                <AddButton type="button"
                    //onClick={handleAddCustomIngredient}
                    onClick={handleAddSelectedIngredient}
                >
                    Reseptiin
                </AddButton>
            </AddRow>



        </IngredientsWrapper >
    );
};

export default Ingredients;