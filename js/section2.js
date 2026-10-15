// ============================================================================
// DEMO.JS - D3.js Fundamentals
// ============================================================================

// ============================================================================
// SECTION 2: DATA BINDING - The Core D3 Pattern 
// ============================================================================

// D3's core pattern is to bind data to DOM elements and then use that data to create visualizations

// To demonstrate that we will first load the data (we'll cover it in Section 4)

// Sample data - gas prices in 5 states chosen randomly. 
const energyData = await d3.csv('data/state_energy_prices.csv');
const sampledData = energyData.filter(d => ['California','Texas','New York','Illinois','Michigan'].includes(d.state));
const gasPrices = sampledData.map(item => parseFloat(item.gas));

// Now let's see how we bind this data to elements
d3.select('#demo-2')
    .append('svg')
    .attr('width', 400) // Set width of the SVG
    .attr('height', 100) // Set height of the SVG
    .selectAll('circle') // Select circles (we don't have them yet) - we select circles that don't exist yet to tell D3 what kind of elements to create
    .data(gasPrices) // Bind the gasPrices data to the circles
    .join('circle') // Create a circle for each data point (this is where the circles are created)
    .attr('cx', (d, i) => i*60+30) // Set x position based on index
    .attr('cy', 50) // Set y position (fixed for now)
    .attr('r', d => d * 5) // Set radius based on gas price (scaled up for visibility)
    .attr('fill', 'steelblue'); // Set fill color


// TODO: sample electricity prices instead of gas and create rectangles instead of circles; make the color of the rectangles green;
const electricityPrices = sampledData.map(item => parseFloat(item.elec));
// YOUR CODE GOES HERE

// Remember that circle needs radius (r) and center (cx, cy) to create it,
// while rectangles need x, y, width, and height. You can use the electricity price to determine the height of the rectangle and set a fixed width.
d3.select('#demo-2')
    .append('svg')
    .attr('width', 400) // Set width of the SVG
    .attr('height', 100) // Set height of the SVG
    .selectAll('rect') // Select rectangles (we don't have them yet)
    .data(electricityPrices) // Bind the electricityPrices data to the rectangles
    .join('rect') // Create a rectangle for each data point
    .attr('x', (d, i) => i*60+10) // Set x position based on index
    .attr('y', d => 100 - d*100) // Set y position based on electricity price
    .attr('width', 20) // Set fixed width for rectangles
    .attr('height', d => d*100) // Set height based on electricity price (scaled up for visibility)
    .attr('fill', 'pink');