/////////////////////////////////////////////////////////////////////////////////////
// Data
var dataset_coords, dataset_log, yScale, xScale;
function rowConverter1(d) {
  return {
    location: d.location,
    lat: parseFloat(d.lat),
    long: parseFloat(d.long),
    area: d.area
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
  // Figure out which of the areas has the largest range
  var subset_dc = dataset_coords.filter(function(d) { return d.area=="dc"; })
  var subset_sf = dataset_coords.filter(function(d) { return d.area=="sf"; })
  var long_ranges = [{area:"dc", range:(d3.max(subset_dc, function(d) {return d.long})-d3.min(subset_dc, function(d) {return d.long}))},
                     {area:"sf", range:(d3.max(subset_sf, function(d) {return d.long})-d3.min(subset_sf, function(d) {return d.long}))}];
  var lat_ranges = [{area:"dc", range:(d3.max(subset_dc, function(d) {return d.lat})-d3.min(subset_dc, function(d) {return d.lat}))},
                    {area:"sf", range:(d3.max(subset_sf, function(d) {return d.lat})-d3.min(subset_sf, function(d) {return d.lat}))}];
  var max_long = d3.max(long_ranges);
  var max_lat = d3.max(lat_ranges);
  // DC scale
  dc_w = (long_ranges[0].range/max_long)*graphic_w;
  dc_h = (lat_ranges[0].range/max_lat)*graphic_h;
  xScale_dc = d3.scaleLinear()
                .domain([d3.min(subset_dc, function(d) { return d.long; }), d3.max(subset_dc, function(d) { return d.long; })])
                .range([(graphic_w-dc_w)/2, (graphic_w-dc_w)/2+dc_w]); // if it's not the max, then center
  yScale_dc = d3.scaleLinear()
                .domain([d3.min(subset_dc, function(d) { return d.lat; }), d3.max(subset_dc, function(d) { return d.lat; })])
                .range([(graphic_h-dc_h)/2, (graphic_h-dc_h)/2+dc_hs]);
  // SF scale
  sf_w = (long_ranges[1].range/max_long)*graphic_w;
  sf_h = (lat_ranges[1].range/max_lat)*graphic_h;
  xScale_sf = d3.scaleLinear()
                .domain([d3.min(subset_sf, function(d) { return d.long; }), d3.max(subset_sf, function(d) { return d.long; })])
                .range([(graphic_w-sf_w)/2, (graphic_w-sf_w)/2+sf_w]); // if it's not the max, then center
  yScale_sf = d3.scaleLinear()
                .domain([d3.min(subset_sf, function(d) { return d.lat; }), d3.max(subset_sf, function(d) { return d.lat; })])
                .range([(graphic_h-sf_h)/2, (graphic_h-sf_h)/2+sf_hs]);


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
