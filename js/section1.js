// ============================================================================
// DEMO.JS - D3.js Fundamentals
// ============================================================================

// ============================================================================
// SECTION 1: D3 SELECTIONS & DOM MANIPULATION
// ============================================================================
// D3 = "Data-Driven Documents" - it connects data to visual elements
// DOM = Document Object Model - the structure of the webpage (HTML elements)

// To add the D3 visualizations into our page, we first have to select an associated element

// Select an element and modify it
// d3.select() finds ONE element (like querySelector)
// d3.selectAll() finds ALL elements (like querySelectorAll)

d3.select('#demo-1')
    .style('color', 'blue')
    .style('font-size', '20px')
    .text('This text was changed by D3!');

// TODO: change the text above to add your name
// TODO: change the color to something else you like // keep in mind color contrast
d3.select('#demo-1')
    .style('color', 'red')
    .style('font-size', '50px')
    .text('sushi');


// Create and append new elements
d3.select('#demo-1')
    .append('p')
    .text('This paragraph was created by D3')
    .style('background-color', 'lightgray');

// TODO: append a new element with your favorite food and style it with a different background color
d3.select('#demo-1')
    .append('p')
    .text('ramen')
    .style('font-size', '50px')
    .style('background-color', '#FFB6C1');