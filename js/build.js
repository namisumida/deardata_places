/////////////////////////////////////////////////////////////////////////////////////
// Data
var dataset_coords, dataset_log, yScale, xScale;
function rowConverter1(d) {
  return {
    location: d.location,
    lat: parseFloat(d.lat),
    long: parseFloat(d.long)
  }
}; // end rowconverter1 function
var parseDate = d3.timeParse("%m/%d/%Y"); // convert strings to Dates
function rowConverter2(d) {
  return {
    date: parseDate(d.date),
    start_location: d.start_location,
    end_location: d.end_location,
    mode: d.mode,
    n_people: parseInt(d.n_people)
  }
}
// Plot coordinates
d3.csv('Data/deardata_places_coord.csv', rowConverter1, function(data) {
  dataset_coords = data;

  // Scales
  xScale = d3.scaleLinear()
                  .domain([d3.min(dataset_coords, function(d) { return d.long; }), d3.max(dataset_coords, function(d) { return d.long; })])
                  .range([margin.left,margin.left+graphic_w]);
  yScale = d3.scaleLinear()
                   .domain([d3.min(dataset_coords, function(d) { return d.lat; }),
                            d3.max(dataset_coords, function(d) { return d.lat; })])
                   .range([graphic_h-margin.top-margin.bottom, margin.top]);
/*  xScale = {dc: d3.scaleLinear()
                  .domain([d3.min(dataset_coords, function(d) { return d.long; }), d3.max(dataset_coords, function(d) { return d.long; })])
                  .range([margin.left,margin.left+graphic_w]),
            sf: d3.scaleLinear()
                           .domain([d3.min(dataset_coords, function(d) { return d.long; }), d3.max(dataset_coords, function(d) { return d.long; })])
                           .range([margin.left,margin.left+graphic_w]) }
  yScale = {dc: d3.scaleLinear()
                   .domain([d3.min(dataset_coords, function(d) { return d.lat; }),
                            d3.max(dataset_coords, function(d) { return d.lat; })])
                   .range([margin.top, margin.top+graphic_h]),
            sf: d3.scaleLinear()
                             .domain([d3.min(dataset_coords, function(d) { return d.lat; }),
                                      d3.max(dataset_coords, function(d) { return d.lat; })])
                             .range([margin.top, margin.top+graphic_h])}*/

  // Plotting coordinates
  plotCoords();
}); // end d3.csv coord

// Plot lines
d3.csv('Data/deardata_places_log.csv', rowConverter2, function(data) {
  dataset_log = data;
}); // end d3.csv coord

/////////////////////////////////////////////////////////////////////////////////////
// Margins
var svg = d3.select("#svg-graphic");
var w = document.getElementById("svg-graphic").getBoundingClientRect().width;
var h = document.getElementById("svg-graphic").getBoundingClientRect().height;
var margin = {left: 10, right: 10, top: 10, bottom: 10}
var graphic_w = w-margin.left-margin.right;
var graphic_h = h-margin.top-margin.bottom;


/////////////////////////////////////////////////////////////////////////////////////
// Plotting functions
function plotCoords(dataset_places) {
  svg.selectAll("placeDots")
     .data(dataset_coords)
     .enter()
     .append("circle")
     .attr("class", "placeDots")
     .attr("cx", function(d) {
       return xScale(d.long)
     })
     .attr("cy", function(d) {
       return yScale(d.lat)
     })
     .attr("r", 3)
     .style("fill", "white")
     .on("mouseover", function(d) {
       console.log(d);
     })
}; // end plot coords function
