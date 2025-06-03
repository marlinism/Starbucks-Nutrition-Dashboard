import React, { useState } from 'react';
import './CompareModal.css';

import { drinkNutritionFields } from '../../data/DrinkNutritionModel';
import { foodNutritionFields } from '../../data/FoodNutritionModel';

function CompareModal({ onClose, nutrient, data, category }) {
    const [item1, setItem1] = useState('');
    const [item2, setItem2] = useState('');

    const getItem = (name) => data.find((d) => d.name === name);

    const options = data.map((d) => d.name);

    const left = getItem(item1);
    const right = getItem(item2);

    const nutritionFields =
        category === 'drinks' ? drinkNutritionFields : foodNutritionFields;

    const singularWord = category === 'drinks' ? 'Drink' : 'Food';

    return (
        <div className="compare-modal">
            <h2>
                Compare {singularWord} by{' '}
                {nutrient.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </h2>

            <div className="selectors">
                <select
                    value={item1}
                    onChange={(e) => setItem1(e.target.value)}
                >
                    <option value="">
                        Select {singularWord} 1
                    </option>
                    {options.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>

                <select
                    value={item2}
                    onChange={(e) => setItem2(e.target.value)}
                >
                    <option value="">
                        Select {singularWord} 2
                    </option>
                    {options.map((name) => (
                        <option key={name} value={name}>
                            {name}
                        </option>
                    ))}
                </select>
            </div>

            <div className={`compare-grid ${item1 && !item2 ? 'single' : ''}`}>
                <div>
                    {left ? (
                        <>
                            <h3>{left.name}</h3>
                            {nutritionFields.map(({ key, label }) => (
                                <p key={key}>
                                    <strong>{label}:</strong> {left[key]}
                                </p>
                            ))}
                        </>
                    ) : (
                        <p className="placeholder-text">
                            {`Select ${singularWord} 1`}
                        </p>
                    )}
                </div>

                <div>
                    {right ? (
                        <>
                            <h3>{right.name}</h3>
                            {nutritionFields.map(({ key, label }) => (
                                <p key={key}>
                                    <strong>{label}:</strong> {right[key]}
                                </p>
                            ))}
                        </>
                    ) : (
                        <p className="placeholder-text">
                            {`Select ${singularWord} 2`}
                        </p>
                    )}
                </div>
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}

export default CompareModal;
