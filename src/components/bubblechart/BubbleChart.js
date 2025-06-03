import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { formatLabel } from '../../data/DrinkNutritionModel';
import './BubbleChart.css';

function BubbleChart({ data, nutrient, category }) {
    const ref = useRef();

    useEffect(() => {
        if (!data || data.length === 0) return;

        let bubblesData;

        if (category === 'drinks') {
            const grouped = d3.groups(data, d => d.category);
            bubblesData = grouped
                .map(([cat, items]) => {
                    const valid = items.filter(d => d[nutrient] !== undefined && !isNaN(d[nutrient]));
                    const avg = d3.mean(valid, d => +d[nutrient]);
                    return { label: cat, value: avg };
                })
                .filter(d => !isNaN(d.value));
        } else {
            // For food, group by category and compute average
            const groupedFood = d3.groups(data, d => d.category);
            bubblesData = groupedFood
                .map(([cat, items]) => {
                    const valid = items.filter(d => d[nutrient] !== undefined && !isNaN(d[nutrient]));
                    const avg = d3.mean(valid, d => +d[nutrient]);
                    return { label: cat, value: avg };
                })
                .filter(d => !isNaN(d.value));
        }

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const container = svg.node().parentElement;
        const width = container.clientWidth;
        const totalHeight = container.clientHeight;
        const headerHeight = 40;
        const availableHeight = totalHeight - headerHeight - 20;

        const maxValue = d3.max(bubblesData, d => d.value);
        const radiusRange = [30, 70];
        const scale = d3.scaleSqrt().domain([0, maxValue]).range(radiusRange);

        const yCenter = headerHeight + availableHeight / 2;

        const simulation = d3.forceSimulation(bubblesData)
            .force('x', d3.forceX(width / 2).strength(0.05))
            .force('y', d3.forceY(yCenter).strength(0.1))
            .force('collide', d3.forceCollide(d => scale(d.value) + 4))
            .stop();

        for (let i = 0; i < 100; i++) simulation.tick();

        svg
            .attr('viewBox', `0 0 ${width} ${totalHeight}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        const g = svg.selectAll('g')
            .data(bubblesData)
            .enter()
            .append('g')
            .attr('transform', d => `translate(${d.x},${d.y})`);

        g.append('circle')
            .attr('r', d => scale(d.value))
            .attr('fill', '#00704A')
            .attr('stroke', '#e76f51')
            .attr('stroke-width', 1)
            .attr('opacity', 0.85);

        g.append('text')
            .style('text-anchor', 'middle')
            .style('font-size', d => `${Math.min(scale(d.value) / 3, 12)}px`)
            .style('fill', 'white')
            .style('pointer-events', 'none')
            .selectAll('tspan')
            .data(d => {
                const words = d.label.split(' ');
                const lines = [];
                for (let i = 0; i < words.length; i += 2) {
                    lines.push(words.slice(i, i + 2).join(' '));
                }
                return lines;
            })
            .enter()
            .append('tspan')
            .attr('x', 0)
            .attr('dy', function (_, i, nodes) {
                const totalLines = nodes.length;
                const lineHeight = 1.2;
                const firstDy = -((totalLines - 1) / 2) * lineHeight;
                return i === 0 ? `${firstDy}em` : `${lineHeight}em`;
            })
            .text(d => d);
    }, [data, nutrient, category]);

    const headerText =
        category === 'drinks'
            ? `Average ${formatLabel(nutrient)} by Type of Drinks`
            : `Average ${formatLabel(nutrient)} Across Food Categories`;

    return (
        <div className="bubble-chart-container">
            <h3>{headerText}</h3>
            <svg ref={ref}></svg>
        </div>
    );
}

export default BubbleChart;
