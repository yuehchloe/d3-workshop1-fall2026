// ============================================================================
// STOCK PRICE VISUALIZATION ASSIGNMENT
// ============================================================================
// Your task: Complete this script to create a multi-line chart showing
// stock prices for Apple (AAPL), Google (GOOG), and Amazon (AMZN), IBM (IBM),
// Microsoft (MSFT), then add ONE vertical line that follows the mouse and a
// tooltip that shows every company's price on that date.
//
// Follow the TODO comments and refer to section5.js (line chart) for guidance.
// The tooltip is NOT covered in the demo: use the documentation links in the
// TOOLTIP section below
// ============================================================================


// ============================================================================
// DATA LOADING
// ============================================================================
// Load CSV files for three stocks in parallel
// Pattern: d3.csv("filename").then(data => ({name: "SYMBOL", values: data}))

let stocks = await Promise.all([
    d3.csv("data/AAPL.csv").then(data => ({ name: "AAPL", values: data })),
    d3.csv("data/GOOG.csv").then(data => ({ name: "GOOG", values: data })), // TODO: Load GOOG.csv with name "GOOG"
    d3.csv("data/AMZN.csv").then(data => ({ name: "AMZN", values: data })), // TODO: Load AMZN.csv with name "AMZN"
    d3.csv("data/IBM.csv").then(data => ({ name: "IBM", values: data })), // TODO: LOAD IBM.csv with name "IBM"
    d3.csv("data/MSFT.csv").then(data => ({ name: "MSFT", values: data })) // TODO: LOAD MSFT.csv with name "MSFT"
]);

console.log("Loaded stocks:", stocks);


// ============================================================================
// DATA PROCESSING
// ============================================================================
// Convert string values to proper types (dates and numbers)
// Remember: CSV data loads as strings

stocks.forEach(stock => {
    stock.values.forEach(d => {
        // TODO: Convert d.Date from string to Date object
        // Hint: new Date(d.Date)
        d.Date = new Date(d.Date);

        // TODO: Convert d.Close from string to number
        // Hint: Use the + operator like +d.Close
        d.Close = +d.Close;

        // TODO: Convert these additional fields to numbers
        // d.Open, d.High, d.Low, d.Volume
        d.Open = +d.Open;
        d.High = +d.High;
        d.Low = +d.Low;
        d.Volume = +d.Volume;

    });

    // TODO: Sort stock.values by date (oldest to newest)
    stock.values.sort((a, b) => a.Date - b.Date);
});

console.log("Processed first stock:", stocks[0].values[0]);


// ============================================================================
// CHART DIMENSIONS
// ============================================================================
// Set up the size and margins for the chart
// This is provided - the margin convention is standard D3 practice

const margin = { top: 50, right: 160, bottom: 50, left: 100 };
const width = 1000 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;


// ============================================================================
// SVG SETUP
// ============================================================================
// Create the SVG container and add a group for margins
// This is provided - focus on the scales and drawing instead

const svg = d3.select('#chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);


// ============================================================================
// CREATE SCALES
// ============================================================================
// Scales map data values to pixel positions

// Get all data points from all stocks (we need this for the domains)
const allValues = stocks.flatMap(s => s.values);

// X Scale - Maps dates to horizontal positions
// TODO: Create a time scale using d3.scaleUtc()
// Hint: Look at demo.js Section 5 for the pattern
const x = d3.scaleUtc()
    .domain(d3.extent(allValues, d => d.Date))
    .range([0, width]);

// Y Scale - Maps prices to vertical positions
// TODO: Create a linear scale using d3.scaleLinear()
const y = d3.scaleLinear()
    .domain([
        // TODO: Get minimum Close price from all stocks
        d3.min(allValues, d => d.Close),
        // TODO: Get maximum Close price from all stocks
        d3.max(allValues, d => d.Close)
    ])
    .range([height, 0]);

// Color Scale - Maps stock names to colors
// TODO: Create an ordinal color scale
// Hint: d3.scaleOrdinal(d3.schemeCategory10).domain(mapping goes here)
const color = d3.scaleOrdinal(d3.schemeCategory10)
    .domain(stocks.map(stock => stock.name));


// ============================================================================
// ADD AXES
// ============================================================================
// Create and position the x and y axes

// X Axis - Shows years along the bottom
const xAxis = d3.axisBottom(x)
    .ticks(d3.timeYear.every(1)) // Show a tick every year
    .tickFormat(d3.timeFormat('%Y')); // Format ticks to show only the year

svg.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`)
    .call(xAxis)
    .selectAll('text')
    .style('font-size', '12px');

// Y Axis - Shows prices along the left side
const yAxis = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(d => `$${d.toFixed(2)}`); // Format ticks to show $ sign

svg.append('g')
    .attr('class', 'y-axis')
    .call(yAxis)
    .selectAll('text')
    .style('font-size', '12px');


// ============================================================================
// DRAW LINES
// ============================================================================
// Create a line for each stock

// TODO: Create a line generator using d3.line()
const line = d3.line()
    .x(d => x(d.Date))
    .y(d => y(d.Close))
    .curve(d3.curveMonotoneX);

// TODO: Loop through each stock and draw a line
stocks.forEach(stock => {
    // TODO: Append a 'path' element
    // TODO: Bind the stock.values data using .datum(stock.values)
    // TODO: Set attributes:
    //   - class: 'line'
    //   - fill: 'none' (we don't want to fill under the line)
    //   - stroke: use the color scale to get the color for this stock
    //   - stroke-width: 2
    //   - d: line (this uses the line generator to create the path)
    svg.append('path')
        .datum(stock.values)
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr('stroke', color(stock.name))
        .attr('stroke-width', 2)
        .attr('d', line);
});

// ============================================================================
// TOOLTIP: ONE LINE THAT SHOWS EVERY STOCK'S PRICE
// ============================================================================
// Goal: when the mouse is over the chart, a dashed vertical line follows it,
// and a tooltip lists the closing price of ALL five companies on that date.
//
//      Jun 03, 2015
//      ■ AMZN: $430.20
//      ■ GOOG: $540.10
//      ■ IBM: $170.55
//      ■ AAPL: $127.80
//      ■ MSFT: $46.00
//
// The setup below is provided. You write the overlay's event handlers.

// Documentation for this section (the demo does not cover it):
//   Events (selection.on, d3.pointer):
//     https://d3js.org/d3-selection/events
//     Careful: many tutorials online use d3.event, which is old. This course
//     uses D3 v7, where the listener receives the event as its FIRST argument.
//   Pixel -> Date (scale.invert):
//     https://d3js.org/d3-scale/linear#linear_invert
//   Closest data point (bisector.center, used by the `bisect` helper above):
//     https://d3js.org/d3-array/bisect#bisector_center
//   Tooltip content and position (selection.html, selection.style):
//     https://d3js.org/d3-selection/modifying

const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('pointer-events', 'none')   // so the tooltip never blocks the mouse
    .style('opacity', 0)               // invisible until the mouse is over the chart
    .style('background', 'rgba(20, 23, 26, 0.92)')
    .style('color', '#ffffff')
    .style('padding', '6px 10px')
    .style('border-radius', '4px')
    .style('font-size', '13px')
    .style('line-height', '1.4');

// Helpers
const bisect = d3.bisector(d => d.Date).center;   // index of the data point closest to a Date
const fmtDate = d3.utcFormat('%b %d, %Y');         // formats a Date like "Jun 03, 2015"

// The vertical guide line. Hidden until the mouse is over the chart.
const guide = svg.append('line')
    .attr('class', 'guide')
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', '#888888')
    .attr('stroke-dasharray', '4 4')
    .style('opacity', 0);

// BONUS: Create one dot per stock once; update its position on mousemove.
const dots = svg.selectAll('.stock-dot')
    .data(stocks, d => d.name)
    .join('circle')
    .attr('class', 'stock-dot')
    .attr('r', 4)
    .attr('fill', d => color(d.name))
    .attr('pointer-events', 'none')
    .style('opacity', 0);

// The overlay: a transparent rectangle that covers the whole plot area and catches the mouse. It is appended AFTER the lines so it sits on top of them.
// The three handlers are chained onto it: one statement from svg.append to the final semicolon.
svg.append('rect')
    .attr('class', 'overlay')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'none')
    .attr('pointer-events', 'all') // Provided: an SVG shape with no fill ignores the mouse unless pointer-events is 'all'

    // mouseover: the mouse entered the plot
    .on('mouseover', function () {
        // TODO: show the tooltip (its 'opacity' style)
        tooltip.style('opacity', 1);
        // TODO: show the guide line
        guide.style('opacity', 1);
    })

    // mousemove: runs on every mouse move. The event is the FIRST argument.
    .on('mousemove', function (event) {
        //Pointer x inside the plot (a number of pixels)
        const [px] = d3.pointer(event, this);

        //Pixel -> Date: run the x scale backwards
        const date = x.invert(px);

        //For EACH stock, the data row closest to that date, then sort so the highest price comes first
        const rows = stocks
            .map(s => ({
                name: s.name,
                row: s.values[bisect(s.values, date)]
            }))
            .sort((a, b) => b.row.Close - a.row.Close);

        // Move the guide line to the date of the first row (all stocks share trading days, so any stock's row works)
        guide
            .attr('x1', x(rows[0].row.Date))
            .attr('x2', x(rows[0].row.Date));

        // BONUS: Match dots by stock name as the price-sorted rows change order.
        dots.data(rows, d => d.name)
            .attr('cx', x(rows[0].row.Date))
            .attr('cy', d => y(d.row.Close))
            .style('opacity', 1);

        // Fill the tooltip: the date in bold, then one line per company
        tooltip.html(
            `<strong>${fmtDate(rows[0].row.Date)}</strong>` +
            rows.map(r =>
                `<br><span style="color:${color(r.name)}">&#9632;</span> ${r.name}: $${r.row.Close.toFixed(2)}`
            ).join('')
        );

        // Place the tooltip next to the pointer (page coordinates)
        tooltip
            .style('left', `${event.pageX + 16}px`)
            .style('top', `${event.pageY - 28}px`);
    })

    // mouseout: the mouse left the plot
    .on('mouseout', function () {
        // TODO: hide the tooltip and the guide line again
        tooltip.style('opacity', 0);
        guide.style('opacity', 0);
        dots.style('opacity', 0); // BONUS: Hide the dots when the mouse leaves.
    });

// TODO (BONUS): a dot on each line at the guide line.
//   Create one circle per stock ONCE, with a keyed join (d => d.name), radius 4,
//   filled with color(d.name), hidden to start. In mousemove, set each circle's
//   cx to the guide's x and cy to y(that stock's Close).

// ============================================================================
// ADD LABELS
// ============================================================================
// Add title and axis labels to make the chart readable

// Chart Title
// TODO: Add a text element for the title
svg.append('text')
    .attr('class', 'chart-title')
    .attr('x', width / 2)
    .attr('y', -20)
    .attr('text-anchor', 'middle')
    .style('font-size', '18px')
    .style('font-weight', 'bold')
    .text('Stock Closing Prices Over Time');

// X Axis Label
// TODO: Add a label below the x-axis
svg.append('text')
    .attr('class', 'x-axis-label')
    .attr('x', width / 2)
    .attr('y', height + 40)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .text('Date');

// Y Axis Label
// TODO: Add a label to the left of the y-axis (rotated)
svg.append('text')
    .attr('class', 'y-axis-label')
    .attr('transform', 'rotate(-90)')
    .attr('x', -height / 2)
    .attr('y', -80)
    .attr('text-anchor', 'middle')
    .style('font-size', '14px')
    .text('Price ($)');


// ============================================================================
// ADD LEGEND
// ============================================================================
// Create a legend showing which color represents which stock

const legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width + 20}, 0)`);

// TODO: For each stock, create a legend entry
stocks.forEach((stock, i) => {
    const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

    // TODO: Add a colored line showing the stock's color
    legendRow.append('line')
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 20)
        .attr('y2', 0)
        .attr('stroke', color(stock.name))
        .attr('stroke-width', 2);

    // TODO: Add text label with the stock name
    legendRow.append('text')
        .attr('x', 25)
        .attr('y', 5)
        .attr('text-anchor', 'start')
        .style('font-size', '12px')
        .text(stock.name);
});
