var d3 = require('./node_modules/d3/dist/d3.js');
// Importing the Linkedom library to create a virtual DOM environment (needed since we don't have a real browser)
var linkedom = require('linkedom');

// Creating a virtual HTML document using Linkedom
globalThis.document = linkedom.parseHTML('<html><body></body></html>').document;

const width = 800;
const height = 800;
const margin = 50;
const radius = Math.min(width, height) / 2 - margin;

// Data without any external source
const data = [
    { category: 'A', value: 10 },
    { category: 'B', value: 20 },
    { category: 'C', value: 30 },
    { category: 'D', value: 40 },
    { category: 'E', value: 50 }
];

// Color scale for the segments
const color = d3.scaleOrdinal(d3.schemeCategory10);

// Create the SVG container for the chart
const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "#f0f8ff");

// Group for the radial chart content
const g = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

// Arc generator
const arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

// Pie chart generator (converts data into arcs)
const pie = d3.pie()
    .value(d => d.value)
    .sort(null);

// Create the segments of the chart (each data point becomes an arc)
const arcs = g.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

// Draw the arcs (segments)
arcs.append("path")
    .attr("d", arc)
    .attr("fill", (d, i) => color(i));

// Add labels for each segment
arcs.append("text")
    .attr("transform", d => `translate(${arc.centroid(d)})`)
    .attr("text-anchor", "middle")
    .text(d => d.data.category)
    .style("fill", "white")
    .style("font-size", "14px");

// Title
svg.append("text")
    .attr("x", width / 2)
    .attr("y", margin / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("font-weight", "bold")
    .text("Radial Chart Example");

// Exporting the generated SVG as an HTML string
module.exports = svg.node().outerHTML;
