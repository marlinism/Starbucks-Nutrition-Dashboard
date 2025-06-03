import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import recommendedData from '../../data/RecommendedDrinkPerDay.json';
import './RecommendedChart.css';

function RecommendedChart() {
    const ref = useRef();

    useEffect(() => {
        const data = recommendedData.map((d) => ({
            group: d.group,
            cups: parseFloat(d.precise_max_cups),
        }));

        const svg = d3.select(ref.current);
        svg.selectAll('*').remove();

        const container = svg.node().parentNode.getBoundingClientRect();
        const width = container.width;
        const height = container.height;

        const margin = { top: 40, right: 30, bottom: 60, left: 60 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        svg.attr('width', width).attr('height', height);

        const x = d3
            .scaleBand()
            .domain(data.map((d) => d.group))
            .range([0, innerWidth])
            .padding(0.4);

        const y = d3
            .scaleLinear()
            .domain([0, d3.max(data, (d) => d.cups)])
            .nice()
            .range([innerHeight, 0]);

        const g = svg
            .append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);

        g.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', (d) => x(d.group))
            .attr('y', (d) => y(d.cups))
            .attr('width', x.bandwidth())
            .attr('height', (d) => innerHeight - y(d.cups))
            .attr('fill', '#00704A');

        g.selectAll('text.label')
            .data(data)
            .enter()
            .append('text')
            .attr('x', (d) => x(d.group) + x.bandwidth() / 2)
            .attr('y', (d) => y(d.cups) - 6)
            .attr('text-anchor', 'middle')
            .attr('font-size', 13)
            .text((d) => d.cups.toFixed(2));

        g.append('g')
            .attr('transform', `translate(0, ${innerHeight})`)
            .call(d3.axisBottom(x))
            .selectAll('text')
            .style('text-anchor', 'middle');

        g.append('g').call(d3.axisLeft(y));
    }, []);

    return (
        <div className="recommended-chart-container">
            <h3>Max Recommended Drinks Per Day</h3>
            <svg ref={ref} />
        </div>
    );
}

export default RecommendedChart;
