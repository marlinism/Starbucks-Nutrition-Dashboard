export const drinkNutritionFields = [
    { key: 'calories', label: 'Calories' },
    { key: 'total_fat', label: 'Total Fat' },
    { key: 'trans_fat', label: 'Trans Fat' },
    { key: 'saturated_fat', label: 'Saturated Fat' },
    { key: 'sodium', label: 'Sodium' },
    { key: 'carbohydrates', label: 'Carbohydrates' },
    { key: 'cholesterol', label: 'Cholesterol' },
    { key: 'fiber', label: 'Fiber' },
    { key: 'sugars', label: 'Sugars' },
    { key: 'protein', label: 'Protein' },
    { key: 'vitaminA', label: 'Vitamin A' },
    { key: 'vitaminC', label: 'Vitamin C' },
    { key: 'calcium', label: 'Calcium' },
    { key: 'iron', label: 'Iron' },
    { key: 'caffeine', label: 'Caffeine' }
];

export const formatLabel = (key) =>
    key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());