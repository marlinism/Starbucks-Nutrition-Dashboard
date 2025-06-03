import React from 'react';
import './NutrientSelector.css';

function NutrientSelector({ nutrient, setNutrient, category }) {
    const drinkOptions = [
        'calories',
        'total_fat',
        'trans_fat',
        'saturated_fat',
        'sodium',
        'carbohydrates',
        'cholesterol',
        'fiber',
        'sugars',
        'protein',
        'vitaminA',
        'vitaminC',
        'calcium',
        'iron',
        'caffeine',
    ];

    const foodOptions = [
        'calories',
        'total_fat',
        'carbohydrates',
        'fiber',
        'protein',
    ];

    const options = category === 'food' ? foodOptions : drinkOptions;

    return (
        <div className="nutrient-selector">
            {options.map((opt) => (
                <label key={opt} className="nutrient-option">
                    <input
                        type="radio"
                        value={opt}
                        checked={nutrient === opt}
                        onChange={(e) => setNutrient(e.target.value)}
                    />
                    {opt.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </label>
            ))}
        </div>
    );
}

export default NutrientSelector;
