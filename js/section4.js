// ============================================================================
// SECTION 4: DATA LOADING & SIMPLE BAR CHART
// ============================================================================

// D3 provides functions to load data from various formats (CSV, JSON, etc.)
// Load CSV data (this is asynchronous, so we use await)
const energyData = await d3.csv('data/state_energy_prices.csv');
console.log('Loaded data:', energyData);

// Now let's create a bar chart with top 15 states by electricity price 
energyData.sort((a, b) => parseFloat(b.elec) - parseFloat(a.elec)); // Sort data by electricity price (descending)
let top15 = energyData.slice(0, 15); // Get top 15 states
top15 = top15.map(d => ({ state: d.state, elec: parseFloat(d.elec) })); // Convert electricity price to number and keep only state and electricity

// Now let's set the dimensions for our bar chart
const barMargin = { top: 30, right: 30, bottom: 80, left: 70 };
const barWidth = 700 - barMargin.left - barMargin.right;
const barHeight = 380 - barMargin.top - barMargin.bottom;

// Create SVG for bar chart
const barSvg = d3.select('#demo-4')
    .append('svg')
    .attr('viewBox', `0 0 ${barWidth + barMargin.left + barMargin.right} ${barHeight + barMargin.top + barMargin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${barMargin.left},${barMargin.top})`);

// We are using viewBox here, which allows the SVG to scale responsively while maintaining the aspect ratio. 
// This means that the chart will resize based on the size of the container, making it look good on different screen sizes.

// We also added attribute preserveAspectRatio to ensure that the aspect ratio is maintained when the SVG scales.
// We also translated our chart group to account for the margins, so that our axes and bars have space to be drawn without being cut off.

// Create scales for the bar chart

// X scale - categorical scale for states
const xBarScale = d3.scaleBand()
    .domain(top15.map(d => d.state)) // Input: state names
    .range([0, barWidth]) // Output: width of the chart
    .padding(0.25); // Padding between bars

// Y scale - linear scale for electricity prices
const yBar = d3.scaleLinear()
    .domain([0, d3.max(top15, d => d.elec)]) // Input: from 0 to max elec price in top 15
    .range([barHeight, 0]); // Output: height of the chart (inverted because SVG y=0 is at the top)

// Create axes and append them to the svg

// X axis
const xAxis = d3.axisBottom(xBarScale);

barSvg.append('g')
    .attr('transform', `translate(0, ${barHeight})`) // Move x axis to the bottom of the chart
    .call(xAxis)
    .selectAll('text') // Rotate x axis labels for better readability
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

// Y axis
const yAxis = d3.axisLeft(yBar)
    .ticks(5)
    .tickFormat(d => `$${d.toFixed(2)}`); // Set number of ticks on y axis

barSvg.append('g')
    .call(yAxis);

// Create and append bars to the chart
barSvg.selectAll('rect')
    .data(top15)
    .join('rect')
    .attr('x', d => xBarScale(d.state)) // Set x position based on state
    .attr('y', d => yBar(d.elec)) // Set y position based on electricity  price
    .attr('width', xBarScale.bandwidth()) // Set width of bars based on scale
    .attr('height', d => barHeight - yBar(d.elec)) // Set height of bars based on electricity price
    .attr('fill', 'steelblue') // Set bar color

// Chart title 
barSvg.append('text')
    .attr('x', barWidth / 2) // Center the title horizontally
    .attr('y', -10) // Position the title above the chart
    .attr('text-anchor', 'middle') // Center the text
    .style('font-size', '16px') 
    .style('font-weight', 'bold')
    .text('Top 15 States by Electricity Price');

// Y axis label
barSvg.append('text')
    .attr('transform', 'rotate(-90)') // Rotate the text to be vertical
    .attr('x', -barHeight / 2) // Center the label vertically along the y axis
    .attr('y', -55) // Position the label to the left of the y axis
    .attr('text-anchor', 'middle') // Center the text
    .style('font-size', '12px')
    .text('Electricity Price (per kWh)');

// TODO: Create Bar Chart that shows the top 15 states by gas price;
// States should be on the y-axis and gas price on the x-axis, i.e. bars should be horizontal;
// make the bars orange; add a title and axis labels.

// prepare data
energyData.sort((a, b) => parseFloat(b.gas) - parseFloat(a.gas)); // Sort data by gas price (descending)
let top15Gas = energyData.slice(0, 15); // Get top 15 states
top15Gas = top15Gas.map(d => ({ state: d.state, gas: parseFloat(d.gas) })); // Convert gas price to number and keep only state and gas

// set the dimensions for the horizontal bar chart
const hBarMargin = { top: 30, right: 30, bottom: 80, left: 150 };
const hBarWidth = 400 - hBarMargin.left - hBarMargin.right;
const hBarHeight = 500 - hBarMargin.top - hBarMargin.bottom;

// Create SVG for horizontal bar chart
const hBarSvg = d3.select('#demo-4')
    .append('svg')
    .attr('viewBox', `0 0 ${hBarWidth + hBarMargin.left + hBarMargin.right} ${hBarHeight + hBarMargin.top + hBarMargin.bottom}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .append('g')
    .attr('transform', `translate(${hBarMargin.left},${hBarMargin.top})`);

// Create scales for the horizontal bar chart
// X scale - linear scale for gas prices
const XBarScale = d3.scaleLinear()
    .domain([0, d3.max(top15Gas, d => d.gas)]) // Input: from 0 to max gas price
    .range([0, hBarWidth]) // Output: width of the chart
    .nice();

// Y scale - categorical scale for states
const YBar = d3.scaleBand()
    .domain(top15Gas.map(d => d.state)) // Highest gas price appears at the top
    .range([0, hBarHeight]) // Output: vertical positions for states
    .padding(0.25); // Padding between bars

// Create axes and append them to the svg
// X axis
const XAxis = d3.axisBottom(XBarScale)
    .ticks(5)
    .tickFormat(d => `$${d.toFixed(2)}`);

hBarSvg.append('g')
    .attr('transform', `translate(0, ${hBarHeight})`) // Move x axis to the bottom of the chart
    .call(XAxis);

// Y axis
const YAxis = d3.axisLeft(YBar);

hBarSvg.append('g')
    .call(YAxis);

// Create and append bars to the chart
hBarSvg.selectAll('rect')
    .data(top15Gas)
    .join('rect')
    .attr('x', XBarScale(0)) // Start every bar at zero gas price
    .attr('y', d => YBar(d.state)) // Set vertical position based on state
    .attr('width', d => XBarScale(d.gas) - XBarScale(0)) // Gas price controls bar length
    .attr('height', YBar.bandwidth()) // Each state gets the same bar thickness
    .attr('fill', 'orange'); // Set bar color

// Chart title
hBarSvg.append('text')
    .attr('x', hBarWidth / 2) // Center the title horizontally
    .attr('y', -10) // Position the title above the chart
    .attr('text-anchor', 'middle') // Center the text
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Top 15 States by Gas Price');

// X axis label
hBarSvg.append('text')
    .attr('x', hBarWidth / 2) // Center the label horizontally along the x axis
    .attr('y', hBarHeight + 50) // Position the label below the x axis
    .attr('text-anchor', 'middle') // Center the text
    .style('font-size', '12px')
    .text('Gas Price (per gallon)');

// Y axis label
hBarSvg.append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -hBarHeight / 2)
    .attr('y', -120) // Leave room for state names
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .text('State');
