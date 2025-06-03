import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

import './TopItems.css';

function TopItems({ data, nutrient, category }) {
    const svgRef = useRef();
    const [order, setOrder] = useState('highest');

    useEffect(() => {
        if (!data || data.length === 0) return;

        const sorted = [...data]
            .sort((a, b) =>
                order === 'highest'
                    ? (b[nutrient] || 0) - (a[nutrient] || 0)
                    : (a[nutrient] || 0) - (b[nutrient] || 0)
            )
            .slice(0, 10);

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove();

        const container = svgRef.current.parentNode.getBoundingClientRect();
        const width = container.width;
        const height = container.height;

        const margin = { top: 40, right: 30, bottom: 200, left: 80 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        svg
            .attr('viewBox', `0 0 ${width} ${height}`)
            .attr('preserveAspectRatio', 'xMidYMid meet');

        const x = d3
            .scaleBand()
            .domain(sorted.map(d => d.name))
            .range([0, innerWidth])
            .padding(0.2);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(sorted, d => d[nutrient] || 0)])
            .nice()
            .range([innerHeight, 0]);

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        g.selectAll('rect')
            .data(sorted)
            .join('rect')
            .attr('x', d => x(d.name))
            .attr('y', d => y(d[nutrient] || 0))
            .attr('width', x.bandwidth())
            .attr('height', d => innerHeight - y(d[nutrient] || 0))
            .attr('fill', '#00704A')
            .on('mouseover', function (event, d) {
                const tooltip = d3.select('#tooltip');
                let content = `<strong>${d.name}</strong><br/>`;
                Object.entries(d).forEach(([key, val]) => {
                    if (key === 'name' || key === 'category' || key === 'size' || key === 'factor') return;
                    if (typeof val === 'number') {
                        const label = key
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, l => l.toUpperCase());
                        content += `${label}: ${val}<br/>`;
                    }
                });
                if (d.category) content += `Category: ${d.category}<br/>`;
                if (d.size) content += `Size: ${d.size}<br/>`;
                if (d.factor) content += `Factor: ${d.factor}`;

                tooltip
                    .style('opacity', 1)
                    .html(content)
                    .style('left', `${event.offsetX + 10}px`)
                    .style('top', `${event.offsetY + 10}px`);
            })
            .on('mouseout', () => d3.select('#tooltip').style('opacity', 0));

        const xAxisG = g
            .append('g')
            .attr('transform', `translate(0,${innerHeight})`)
            .call(d3.axisBottom(x));

        function wrapLongLabels(textSelection, maxWidth) {
            textSelection.each(function () {
                const textEl = d3.select(this);
                const fullText = textEl.text().trim();
                const words = fullText.split(/\s+/).reverse();
                let word = words.pop();
                let line = [];
                let lineNumber = 0;
                const lineHeight = 1.1; // ems

                textEl.text('');
                let tspan = textEl
                    .append('tspan')
                    .attr('x', 0)
                    .attr('y', 0)
                    .attr('dy', '0em')
                    .text('');

                while (word) {
                    line.push(word);
                    tspan.text(line.join(' '));
                    if (tspan.node().getComputedTextLength() > maxWidth) {
                        line.pop();
                        tspan.text(line.join(' '));
                        line = [word];
                        lineNumber += 1;
                        tspan = textEl
                            .append('tspan')
                            .attr('x', 0)
                            .attr('y', 0)
                            .attr('dy', `${lineNumber * lineHeight}em`)
                            .text(word);
                    }
                    word = words.pop();
                }
            });
        }

        xAxisG.selectAll('text')
            .style('font-size', '12px')
            .each(function () {
                wrapLongLabels(d3.select(this), x.bandwidth());
            })
            .attr('transform', `translate(0,10) rotate(-35)`)
            .style('text-anchor', 'end')
            .attr('dx', '-0.5em')
            .attr('dy', '0');

        // 9) Y‐axis
        g.append('g').call(d3.axisLeft(y));

    }, [data, nutrient, order]);

    return (
        <div className="top-items-chart">
            <div className="chart-header">
                <h3>
                    Top Items by{' '}
                    {nutrient.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <select
                    value={order}
                    onChange={e => setOrder(e.target.value)}
                >
                    <option value="highest">Highest</option>
                    <option value="lowest">Lowest</option>
                </select>
            </div>
            <svg ref={svgRef} />
            <div id="tooltip" className="tooltip" />
        </div>
    );
}

export default TopItems;
