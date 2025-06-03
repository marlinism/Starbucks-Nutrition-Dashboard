import React, {useState} from 'react';
import './RecommendedItems.css';

function RecommendedItems({data, nutrient, category}) {
    const [hoveredIndex, setHoveredIndex] = useState(null);
    if (!data || data.length === 0) return null;

    const isVitamin =
        nutrient === 'vitaminA' || nutrient === 'vitaminC';

    const matching =
        isVitamin
            ? data.filter((d) =>
                d.factor.toLowerCase().includes('vitamin (a & c)')
            )
            : data.filter((d) =>
                d.factor.toLowerCase().includes(nutrient.toLowerCase())
            );

    let listToShow;
    if (matching.length > 0) {
        listToShow = matching;
    } else {
        const lowestCal = data.reduce((prev, curr) =>
            curr.calories < prev.calories ? curr : prev
        );
        listToShow = [lowestCal];
    }

    const factorText = listToShow[0].factor;
    const itemWord =
        category === 'food'
            ? listToShow.length > 1
                ? 'Foods'
                : 'Food'
            : listToShow.length > 1
                ? 'Drinks'
                : 'Drink';

    return (
        <div className="ri-container">
            <h3 className="ri-header">
                Recommended {factorText} {itemWord}
            </h3>

            <ul className="ri-list">
                {listToShow.map((item, idx) => (
                    <li
                        key={item.name}
                        className="ri-card"
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <span className="ri-name">{item.name}</span>

                        {hoveredIndex === idx && (
                            <div className="ri-tooltip">
                                <div className="ri-tooltip-arrow"/>
                                <div className="ri-tooltip-body">
                                    <div className="ri-tooltip-title">
                                        {item.name}
                                    </div>

                                    {Object.entries(item).map(([key, val]) => {
                                        if (key === 'name' || key === 'factor') {
                                            return null;
                                        }

                                        const labelKey = key
                                            .replace(/_/g, ' ')
                                            .replace(/\b\w/g, (l) => l.toUpperCase());

                                        if (typeof val === 'number' && !isNaN(val)) {
                                            let unit = '';
                                            const k = key.toLowerCase();
                                            if (k === 'calories') unit = '';
                                            else if (k.includes('fat')) unit = ' g';
                                            else if (
                                                ['sodium', 'cholesterol'].includes(k)
                                            )
                                                unit = ' mg';
                                            else if (k === 'caffeine') unit = ' mg';
                                            else if (
                                                ['vitamina', 'vitaminc', 'calcium', 'iron'].includes(
                                                    k
                                                )
                                            )
                                                unit = ' %';
                                            else if (
                                                ['fiber', 'protein', 'sugars', 'carbohydrates'].includes(
                                                    k
                                                )
                                            )
                                                unit = ' g';

                                            return (
                                                <div
                                                    key={key}
                                                    className="ri-tooltip-row"
                                                >
                                                    {labelKey}: {val}
                                                    {unit}
                                                </div>
                                            );
                                        }

                                        if (typeof val === 'string' && val.trim() !== '') {
                                            return (
                                                <div
                                                    key={key}
                                                    className="ri-tooltip-row"
                                                >
                                                    {labelKey}:{' '}
                                                    <em>{val}</em>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}

                                    <div className="ri-tooltip-row">
                                        Factor:{' '}
                                        <span className="ri-tooltip-factor">
                      {item.factor}
                    </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RecommendedItems;
