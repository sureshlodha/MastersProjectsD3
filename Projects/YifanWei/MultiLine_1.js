// Search "D3 Margin Convention" on Google to understand margins.
var margin_l_1 = {top_l_1: 70, right_l_1: 130, bottom_l_1: 30, left_l_1: 70},
    width_l_1 = 750 - margin_l_1.right_l_1 - margin_l_1.left_l_1,
    height_l_1 = 600 - margin_l_1.top_l_1 - margin_l_1.bottom_l_1;

var parseDate_l_1 = d3.time.format("%Y").parse;

// Define X and Y SCALE and Axis
var x_l_1 = d3.time.scale()
    .range([0, width_l_1]);

var y_l_1 = d3.scale.linear()
    .range([height_l_1, 0]);


var color_l_1= d3.scale.ordinal()
        .range([ "#ccebc5",
                  "#decbe4", 
                  "#fed9a6",
                  
                

                "#bdd7e7","#6baed6","#3182bd","#08519c",
                

                "#bae4b3", "#74c476","#31a354","#006d2c",
                
                  "#cbc9e2","#9e9ac8","#756bb1","#54278f"]);





var xAxis_l_1 = d3.svg.axis()
    .scale(x_l_1)
    .orient("bottom");

var yAxis_l_1 = d3.svg.axis()
    .scale(y_l_1)
    .orient("left");

var line_l_1 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x_l_1(d.year); })
    .y(function(d) { return y_l_1(d.killed); });

// Define SVG. "g" means group SVG elements together.
var svg_l_1 = d3.select("#multi_line_chart_1").append("svg")
            .attr("width", width_l_1 + margin_l_1.left_l_1 + margin_l_1.right_l_1)
            .attr("height", height_l_1 + margin_l_1.top_l_1 + margin_l_1.bottom_l_1)
            .append("g")
            .attr("transform", "translate(" + margin_l_1.left_l_1 + "," + margin_l_1.top_l_1 + ")");

// Load the data from EPC_2000_2010_new.csv
d3.csv("data/output_new_2.csv", function(error, data){
    if (error) throw error;
    color_l_1.domain(d3.keys(data[0]).filter(function(key) {return key !== "year"; }));
    
    data.forEach(function(d) {
        d.year = parseDate_l_1(d.year);
    });
    
    var countries = color_l_1.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {year: d.year, killed: +d[name]};
            })
        };
    });
    
    x_l_1.domain(d3.extent(data, function(d) { return d.year; }));

    y_l_1.domain([
    d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.killed; }); }),
    d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.killed; }); })
    ]);

    
    svg_l_1.selectAll("line.horizontalGrid").data(y_l_1.ticks(8)).enter()
    .append("line")
        .attr(
        {
            "class":"horizontalGrid",
            "x1" : 0,
            "x2" : width_l_1,
            "y1" : function(d){ return y_l_1(d);},
            "y2" : function(d){ return y_l_1(d);},
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            "stroke" : "lightgrey",
            "stroke-width" : "1px"
        });

    svg_l_1.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_l_1 + ")")
      .call(xAxis_l_1);
    
    svg_l_1.append("g")
      .attr("class", "y axis")
      .call(yAxis_l_1)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Killed");
    
    var country = svg_l_1.selectAll(".country")
      .data(countries)
      .enter().append("g")
      .attr("class", "country");
    
    var path = country.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line_l_1(d.values); })
      .style("stroke", function(d) { return color_l_1(d.name); })
      .on("mouseover", function(d) { 
          d3.select(this).style("stroke-width", "5px");
          svg_l_1.selectAll("text.text_country" + d.name.substring(0, 4)).style("opacity", "1").style("font-size", "13px");})

      .on("mouseout", function(d) {
          d3.select(this).style("stroke-width", "1.5px");
          svg_l_1.selectAll("text.text_country" + d.name.substring(0, 4)).style("font-size", "10px");
          if (d.name != "Iraq" && d.name != "Afghanistan" && d.name != "Nigeria" && d.name != "Syria" && d.name != "Yemen") {
              svg_l_1.selectAll("text.text_country" + d.name.substring(0, 4)).style("opacity", "0.1");
          }
          });
    

        
    country.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { return "translate(" + x_l_1(d.value.year) + "," + y_l_1(d.value.killed) + ")"; })
      .attr("class", function(d) {return "text_country" + d.name.substring(0, 4);})
      .attr("x", 3)
      .attr("dy", ".35em")
      .style("font-size", "1px")
      .style("opacity", function(d) {
        if (d.name === "Iraq" || d.name === "Afghanistan" || d.name === "Nigeria" || d.name === "Syria" || d.name === "Yemen") {
            return 1;
        } else {
            return 0.1;
        }
    })
      .text(function(d) { return d.name; });
    
  
    
//    var legend = svg_l_1.selectAll(".legend")
//        .data(varNames.slice())
//      .enter().append("g")
//        .attr("class", "legend")
//        .attr("transform", function (d, i) { return "translate(-400," + i * 20 + ")"; });
//
//    legend.append("rect")
//        .attr("x", width - 15)
//        .attr("width", 10)
//        .attr("height", 10)
//        .style("fill", color_l_1);
//        
//
//    legend.append("text")
//        .attr("x", width)
//        .attr("y", 6)
//        .attr("dy", ".35em")
//        //.style("text-anchor", "end")
//        .text(function (d) { return d; });
    
    
});
