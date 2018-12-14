/////////////////////////////////////////////////////////////////////////////////////
// Data
var dataset_coords, dataset_log, subset_coords, subset_log, yScale, xScale, placeList;
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
};
function getCoord(place) {
  index = placeList.indexOf(place);
  return subset_coords[index];
}; // end get coord function

// Read in data
d3.csv('Data/deardata_places_log.csv', rowConverter2, function(data) {
  dataset_log = data;

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
    var max_long = d3.max(long_ranges, function(d) { return d.range; });
    var max_lat = d3.max(lat_ranges, function(d) { return d.range; });

    function updatePlace(area) {
      // update subsets
      subset_coords = dataset_coords.filter(function(d) { return d.area == area; });
      placeList = subset_coords.map(a => a.location);
      subset_log = dataset_log.filter(function(d) { return placeList.includes(d.start_location) | placeList.includes(d.end_location) });

      // update scales
      var currArea = area.area;
      var currLongMin = d3.min(subset_coords, function(d) {return d.long});
      var currLongMax = d3.max(subset_coords, function(d) {return d.long});
      var currLongRange = currLongMax-currLongMin;
      var currW = (currLongRange/max_long)*graphic_w;
      xScale = d3.scaleLinear()
                 .domain([currLongMin, currLongMax])
                 .range([margin.left+(graphic_w-currW)/2, (graphic_w-currW)/2+currW+margin.left]);

      var currLatMin = d3.min(subset_coords, function(d) {return d.lat});
      var currLatMax = d3.max(subset_coords, function(d) {return d.lat});
      var currLatRange = currLatMax-currLatMin;
      var currH = (currLatRange/max_lat)*graphic_h;

      yScale = d3.scaleLinear()
                 .domain([currLatMin, currLatMax])
                 .range([(graphic_h-currH)/2+currH+margin.top, (graphic_h-currH)/2+margin.top]);
    }; // end update place function

    updatePlace("dc");
    plotCoords();
    plotLines();

    d3.select("#button-dc").on("click", function() {
      // Button appearance
      var button = d3.select(this);
      button.style("background-color", d3.color("#a19da8"))
            .style("color", "black");
      d3.select("#button-sf")
        .style("background-color", "black")
        .style("color", d3.color("#a19da8"));

      // update graphics
      updatePlace("dc");
      updateCoords();
      updateLines();
    }); // click DC button

    d3.select("#button-sf").on("click", function() {
      // Button appearance
      var button = d3.select(this);
      button.style("background-color", d3.color("#a19da8"))
            .style("color", "black");
      d3.select("#button-dc")
        .style("background-color", "black")
        .style("color", d3.color("#a19da8"));

      // update graphics
      updatePlace("sf");
      updateCoords();
      updateLines();
    }); // click DC button


  }); // end d3.csv coord
}); // end d3.csv log

/////////////////////////////////////////////////////////////////////////////////////
// Margins
var svg = d3.select("#svg-graphic");
var w = document.getElementById("svg-graphic").getBoundingClientRect().width;
var h = document.getElementById("svg-graphic").getBoundingClientRect().height;
var margin = {left: 10, right: 10, top: 20, bottom: 20}
var graphic_w = w-margin.left-margin.right;
var graphic_h = h-margin.top-margin.bottom;

var light_red = d3.rgb(229,155,152);
var light_repred = d3.rgb(227,128,115);
var light_plum = d3.rgb(185, 123, 134);
var light_orange = d3.rgb(242,197,128);
var light_yellow = d3.rgb(241,200,132);
var light_mustard = d3.rgb(227,203,130);
var light_green = d3.rgb(196,202,138);
var light_blue = d3.rgb(113,192,253);
var light_demblue = d3.rgb(133,167,190);
var light_purple = d3.rgb(171,164,178);

/////////////////////////////////////////////////////////////////////////////////////
// Plotting functions
function plotCoords() {
  svg.selectAll("placeDots")
     .data(subset_coords)
     .enter()
     .append("circle")
     .attr("class", "placeDots")
     .attr("cx", function(d) {
       return xScale(d.long);
     })
     .attr("cy", function(d) {
       return yScale(d.lat);
     })
     .attr("r", 2)
     .style("fill", "white")
     .on("mouseover", function(d) {
       console.log(d);
     })
}; // end plot coords function

// Udating coordinates
function updateCoords() {
  var dots = svg.selectAll(".placeDots")
                .data(subset_coords);
  dots.exit().remove();
  var enterDots = dots.enter()
                       .append("circle")
                       .attr("class", "placeDots")
                       .attr("cx", function(d) {
                         return xScale(d.long);
                       })
                       .attr("cy", function(d) {
                         return yScale(d.lat);
                       })
                       .attr("r", 2);
  dots = dots.merge(enterDots);
  dots.attr("cx", function(d) {
        return xScale(d.long);
      })
      .attr("cy", function(d) {
        return yScale(d.lat);
      })
      .attr("r", 2)
      .style("fill", "white")
      .on("mouseover", function(d) {
        console.log(d);
      });
}; // end update coords

// Plotting lines
function plotLines() {
  svg.selectAll("lines")
     .data(subset_log)
     .enter()
     .append("line")
     .attr("class", "logLines")
     .attr("x1", function(d) {
       return xScale(getCoord(d.start_location).long);
     })
     .attr("y1", function(d) {
       return yScale(getCoord(d.start_location).lat);
     })
     .attr("x2", function(d) {
       return xScale(getCoord(d.end_location).long);
     })
     .attr("y2", function(d) {
       return yScale(getCoord(d.end_location).lat);
     })
     .style("stroke", function(d) {
       if (d.mode=="walk") {
         return light_demblue;
       }
       else if (d.mode=="bike") {
         return light_green;
       }
       else if (d.mode=="car") {
         return light_repred;
       }
       else if (d.mode=="bus" | d.mode=="metro") {
         return light_yellow;
       }
     })
}; // end plot lines

// Updating lines
function updateLines() {
  var lines = svg.selectAll(".logLines")
                 .data(subset_log);
  lines.exit().remove();
  var enterLines = lines.enter()
                        .append("line")
                        .attr("class", "logLines")
                        .attr("x1", function(d) {
                          return xScale(getCoord(d.start_location).long);
                        })
                        .attr("y1", function(d) {
                          return yScale(getCoord(d.start_location).lat);
                        })
                        .attr("x2", function(d) {
                          return xScale(getCoord(d.end_location).long);
                        })
                        .attr("y2", function(d) {
                          return yScale(getCoord(d.end_location).lat);
                        });
  lines = lines.merge(enterLines);
  lines.attr("class", "logLines")
        .attr("x1", function(d) {
          return xScale(getCoord(d.start_location).long);
        })
        .attr("y1", function(d) {
          return yScale(getCoord(d.start_location).lat);
        })
        .attr("x2", function(d) {
          return xScale(getCoord(d.end_location).long);
        })
        .attr("y2", function(d) {
          return yScale(getCoord(d.end_location).lat);
        })
        .style("stroke", function(d) {
          if (d.mode=="walk") {
            return light_demblue;
          }
          else if (d.mode=="bike") {
            return light_green;
          }
          else if (d.mode=="car") {
            return light_repred;
          }
          else if (d.mode=="bus" | d.mode=="metro") {
            return light_yellow;
          }
        });
}; // end update lines
