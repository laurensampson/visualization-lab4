// Author: Lauren Sampson 
// Email: sampsonl@bc.edu

var csv_data;
var scaleColor;

d3.csv('wealth-health-2014.csv', d3.autoType)
.then(data => {
        csv_data = data;
        csv_data.sort((a,b) => b.Population - a.Population);

const margin = {top: 30, right: 30, bottom: 30, left: 30};
    const width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    const max_radius = width/csv_data.length;

const xScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.Income), d3.max(data, d => d.Income)])
    .range([0,width]);

const yScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.LifeExpectancy), d3.max(data, d => d.LifeExpectancy)])
    .range([height, 0]);

scaleColor = d3.scaleOrdinal(d3.schemeCategory10);

const areaScale = d3.scalePow()
    .domain([0, d3.max(csv_data, d => d.Population)])
    .range([1, max_radius * 10])
    .exponent(0.6);

const yAxis = d3.axisLeft()
    .scale(yScale)
    .ticks(3, "s");

const xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(5, "s");

var svg = d3
    .select(".chart")
    .append("svg")
    .attr("height", height + margin.bottom + margin.top)
    .attr("width", width + margin.left + margin.right)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var circles = svg.selectAll("circle")
    .data(csv_data)
    .enter()
    .append("circle")
    .attr("fill", d => scaleColor(d.Region))
    .attr("cx", d => xScale(d.Income))
    .attr("cy", d => yScale(d.LifeExpectancy))
    .attr("fill-opacity", 0.7)
    .attr("r", d => areaScale(d.Population))
    .on("mouseenter", (event,d) => {
        const pos = d3.pointer(event, window);

        var tooltip = d3
            .select(".tooltip")
            .style("display", "block")
            .style("position", "fixed")
            .style("border", "solid")
            .style("background-color", "white")
            .style("top", pos[1], "px")
            .style("left", pos[0], "px")
            .html(
                "<p id='tooltip'>Country: " + d.Country + "<br> Region: " + d.Region + "<br> Population: " + d3.format(",.2r")(d.Population) + "<br> Income: " + d3.format(",.2r")(d.Income) + "<br> Life Expectancy: " + d.LifeExpectancy + "<p>");
    
    })
    .on("mouseleave", (event, d) => {
       d3.select(".tooltip").style("display", "none");
    });

    var yAxisDisplay = svg.append("g")
    .attr("Class", "axis y-axis")
    .call(yAxis);

    var xAxisDisplay = svg.append("g")
        .attr("Class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`);

    var xLabel = svg.append("text")
        .text("Income")
        .attr("x", width)
        .attr("y", height - margin.bottom/2)
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("font-size", 10);
    
    var yLabel = svg.append("text")
        .text("Life Expectancy")
        .attr("text-anchor", "middle")
        .attr("alignment-baseline", "middle")
        .attr("x", 0 + width/50)
        .attr("y", 0 + height/11)
        .attr("writing-mode", "vertical-lr")
        .attr("font-size", 10);

    var legend = svg.append("g")
        .attr("transform", "translate(" + (width*4)/5 + "," + (margin.top + height - 1.5 * 10 * scaleColor.domain().length - margin.bottom * 2) + ")");
    
    var boxes = legend.selectAll("rect")
        .data(scaleColor.domain())
        .enter()
        .append("rect")
        .attr("class", "box")
        .attr("x", 5)
        .attr("y", (d,i) => 1.5 * 10 * i)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", d => scaleColor(d));

    var labels = legend.selectAll("text")
        .data(scaleColor.domain())
        .enter()
        .append("text")
        .text(d => d)
        .attr("x", 10 + 10)
        .attr("y", (d,i) => 1.5 * 10 * i)
        .attr("font-size", 10)
        .attr("text-anchor", "beginning")
        .attr("alignment-baseline", "hanging");

});

