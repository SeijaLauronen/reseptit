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

const AddRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  flex-wrap: wrap;
`;

const AmountInput = styled.input`
  width: 80px;
  min-width: 80px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const ProductSelect = styled.select`
  min-width: 150px;
  max-width: 200px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
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
  padding: 6px 0;
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
  selectedProductId,
  setSelectedProductId,
  customName,
  setCustomName,
  onAddIngredient,
  onRemoveIngredient,
}) => {
  const handleAdd = () => {
    const trimmedName = customName?.trim();
    const trimmedAmount = amount?.trim();

    if (!selectedProductId && !trimmedName) {
      return;
    }

    const selectedProduct = products.find(
      (product) => String(product.id) === String(selectedProductId)
    );

    const ingredient = selectedProduct
      ? {
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          nickname: trimmedName || "",
          amount: trimmedAmount || "",
        }
      : {
          productId: null,
          productName: "",
          nickname: trimmedName || "",
          amount: trimmedAmount || "",
        };

    if (!ingredient.nickname && !ingredient.productId && !ingredient.amount) {
      return;
    }

    onAddIngredient(ingredient);

    setAmount("");
    setSelectedProductId("");
    setCustomName("");
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
              <IngredientItem key={`${getDisplayName(item)}-${index}`}>
                <IngredientName>{getDisplayName(item)}</IngredientName>
              </IngredientItem>
            ))}
          </IngredientList>
        )}
      </IngredientsWrapper>
    );
  }

  return (
    <IngredientsWrapper>
      <AddRow>
        <AmountInput
          type="text"
          value={amount || ""}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Määrä"
        />

        <ProductSelect
          value={selectedProductId || ""}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">Valitse tuote...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </ProductSelect>

        <SpeechInput
          value={customName || ""}
          onChange={(e) => setCustomName(e.target.value)}
          placeholder="Nimitys reseptissä"
        />

        <button type="button" onClick={handleAdd}>
          Lisää
        </button>
      </AddRow>

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
    </IngredientsWrapper>
  );
};

export default Ingredients;