import FineliService from './FineliService';

export async function calculateProductNutrition(product) {
  if (!product?.fineliId) {
    return null;
  }

  const minGrams = Number(product.fineliDose?.min);
  const maxGrams = Number(product.fineliDose?.max);

  if (
    !Number.isFinite(minGrams) &&
    !Number.isFinite(maxGrams)
  ) {
    return null;
  }

  const fineli = await FineliService.getById(product.fineliId);

  if (!fineli) {
    return null;
  }

  const calculateForGrams = grams => {
    if (!Number.isFinite(Number(grams))) {
      return null;
    }

    const result = {};

    Object.entries(fineli.nutrients || {}).forEach(
      ([code, nutrient]) => {
        const per100 = Number(nutrient?.value);

        if (!Number.isFinite(per100)) {
          return;
        }

        result[code] =
          (Number(grams) / 100) * per100;
      }
    );

    return result;
  };

  return {
    productId: product.id,
    fineliId: product.fineliId,

    minGrams: Number.isFinite(minGrams)
      ? minGrams
      : null,

    maxGrams: Number.isFinite(maxGrams)
      ? maxGrams
      : null,

    min: calculateForGrams(minGrams),
    max: calculateForGrams(maxGrams),
  };
}


export function sumNutrition(items) {
  const result = {};

  items.forEach(item => {
    if (!item) return;

    ['min', 'max'].forEach(range => {
      if (!item[range]) return;

      Object.entries(item[range]).forEach(
        ([code, value]) => {
          if (!Number.isFinite(Number(value))) {
            return;
          }

          if (!result[code]) {
            result[code] = {
              min: 0,
              max: 0
            };
          }

          result[code][range] += Number(value);
        }
      );
    });
  });

  return result;
}