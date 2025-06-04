import React, { useState } from 'react';
import NutrientSelector from './components/nutrientselector/NutrientSelector';
import RecommendedChart from './components/recommendedchart/RecommendedChart';
import TopItems from './components/topdrinks/TopItems';
import RecommendedItems from './components/recommendeditems/RecommendedItems';
import BubbleChart from './components/bubblechart/BubbleChart';
import CompareModal from './components/comparemodal/CompareModal';
import sbImage from './data/SB.png';

import './styles/App.css';

import foodData from './data/StarbucksFood.json';
import foodRecommendation from './data/HealthyFoodRecommendations.json';
import drinksData from './data/StarbucksDrinks.json';
import drinkRecommendation from './data/HealthyDrinkRecommendations.json';

function App() {
    const [category, setCategory] = useState('drinks');
    const [nutrient, setNutrient] = useState('calories');
    const [compareOpen, setCompareOpen] = useState(false);

    const allData = category === 'drinks' ? drinksData : foodData;
    const allRecommendations =
        category === 'drinks' ? drinkRecommendation : foodRecommendation;

    return (
        <div className="App">
            <div className="header">
                <h1>Starbucks Nutrition</h1>
            </div>

            <div className="toolbar">
                <div className="category-toggle">
                    <button
                        className={category === 'drinks' ? 'active' : ''}
                        onClick={() => setCategory('drinks')}
                    >
                        Drinks
                    </button>
                    <button
                        className={category === 'food' ? 'active' : ''}
                        onClick={() => setCategory('food')}
                    >
                        Food
                    </button>
                </div>
                <button className="compare-button" onClick={() => setCompareOpen(true)}>
                    Compare {category === 'drinks' ? 'Drinks' : 'Food'}
                </button>
            </div>

            <NutrientSelector
                nutrient={nutrient}
                setNutrient={setNutrient}
                category={category}
            />

            <div className="dashboard">
                <div className="dashboard-top">
                    {category === 'drinks' ? (
                        <>
                            <div className="window half">
                                <RecommendedChart/>
                            </div>
                            <div className="window half">
                                <TopItems data={allData} nutrient={nutrient} category={category}/>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="window half">
                                <div className="chart-header">
                                    <h3>Relationship between Calories and Fat</h3>
                                </div>
                                <a
                                    href="https://public.tableau.com/app/profile/chi.ngo8053/viz/StarbuckFood/Story1"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={sbImage}
                                        alt="Starbucks Food Visualization"
                                        style={{
                                            width: '100%',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                </a>
                            </div>
                            <div className="window half">
                                <TopItems data={allData} nutrient={nutrient} category={category}/>
                            </div>
                        </>
                    )}
                </div>

                <div className="dashboard-bottom">
                    <div className="window">
                        <BubbleChart data={allData} nutrient={nutrient} category={category}/>
                    </div>
                    <div className="window">
                        <RecommendedItems data={allRecommendations} nutrient={nutrient} category={category}/>
                    </div>
                </div>
            </div>

            {compareOpen && (
                <div className="compare-overlay">
                    <CompareModal
                        onClose={() => setCompareOpen(false)}
                        nutrient={nutrient}
                        data={allData}
                        category={category}
                    />
                </div>
            )}

            <footer className="footer">
                Note: Seasonal items are not included in this dashboard. All items listed are in standard size.
            </footer>
        </div>
    );
}

export default App;
