// Search "D3 Margin Convention" on Google to understand margins.
var margin_l_1_2 = {top_l_1_2: 20, right_l_1_2: 130, bottom_l_1_2: 30, left_l_1_2: 70},
    width_l_1_2 = 750 - margin_l_1_2.right_l_1_2 - margin_l_1_2.left_l_1_2,
    height_l_1_2 = 550 - margin_l_1_2.top_l_1_2 - margin_l_1_2.bottom_l_1_2;

var parseDate_l_1_2 = d3.time.format("%Y").parse;

// Define X and Y SCALE and Axis
var x_l_1_2 = d3.time.scale()
    .range([0, width_l_1_2]);

var y_l_1_2 = d3.scale.linear()
    .range([height_l_1_2, 0]);

//var color_l_1_2 = d3.scale.category20();

//var color_l_1_2 = d3.scale.ordinal()
//        .range([ "#53AFAD",
//                  "#5D6F85", "#AD4F93",
//                  
//                
////                                  "#87B9E5", "#6094CE","#446DAB","#315088",
//                //"#E3EFCA","#C8DF95","#ADCF60","#8DB438",
//                "#DAE3E5","#BBD1EA","#A1C6EA",
//                "#F2F3AE", "#EDD382","#FC9E4F",
//                
//                  "#E0B1CB","#BE95C4","#9F86C0"]);

var color_l_1_2= d3.scale.ordinal()
        .range(["#ccebc5",
                  "#decbe4", 
                  "#fed9a6",
                  
                

                "#bdd7e7","#6baed6","#3182bd",
                

                "#bae4b3", "#74c476","#31a354",
                
                  "#cbc9e2","#9e9ac8","#756bb1"]);

var xAxis_l_1_2 = d3.svg.axis()
    .scale(x_l_1_2)
    .orient("bottom");

var yAxis_l_1_2 = d3.svg.axis()
    .scale(y_l_1_2)
    .orient("left");

var line_l_1_2 = d3.svg.line()
    .interpolate("basis")
    .x(function(d) { return x_l_1_2(d.year); })
    .y(function(d) { return y_l_1_2(d.killed); });

// Define SVG. "g" means group SVG elements together.
var svg_l_1_2 = d3.select("#multi_line_chart_1_2").append("svg")
            .attr("width", width_l_1_2 + margin_l_1_2.left_l_1_2 + margin_l_1_2.right_l_1_2)
            .attr("height", height_l_1_2 + margin_l_1_2.top_l_1_2 + margin_l_1_2.bottom_l_1_2)
            .append("g")
            .attr("transform", "translate(" + margin_l_1_2.left_l_1_2 + "," + margin_l_1_2.top_l_1_2 + ")");

// Load the data from EPC_2000_2010_new.csv
d3.csv("data/output_new_2_remove_top3.csv", function(error, data){
    if (error) throw error;
    color_l_1_2.domain(d3.keys(data[0]).filter(function(key) {return key !== "year"; }));
    
    data.forEach(function(d) {
        d.year = parseDate_l_1_2(d.year);
    });
    
    var countries = color_l_1_2.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {year: d.year, killed: +d[name]};
            })
        };
    });
    
    x_l_1_2.domain(d3.extent(data, function(d) { return d.year; }));

    y_l_1_2.domain([
    d3.min(countries, function(c) { return d3.min(c.values, function(v) { return v.killed; }); }),
    d3.max(countries, function(c) { return d3.max(c.values, function(v) { return v.killed; }); })
    ]);

    
    svg_l_1_2.selectAll("line.horizontalGrid").data(y_l_1_2.ticks(8)).enter()
    .append("line")
        .attr(
        {
            "class":"horizontalGrid",
            "x1" : 0,
            "x2" : width_l_1_2,
            "y1" : function(d){ return y_l_1_2(d);},
            "y2" : function(d){ return y_l_1_2(d);},
            "fill" : "none",
            "shape-rendering" : "crispEdges",
            "stroke" : "lightgrey",
            "stroke-width" : "1px"
        });

    svg_l_1_2.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_l_1_2 + ")")
      .call(xAxis_l_1_2);
    
    svg_l_1_2.append("g")
      .attr("class", "y axis")
      .call(yAxis_l_1_2)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Number of Killed");
    
    var country = svg_l_1_2.selectAll(".country")
      .data(countries)
      .enter().append("g")
      .attr("class", "country");
    
    var path = country.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line_l_1_2(d.values); })
      .style("stroke", function(d) { return color_l_1_2(d.name); })
      .on("mouseover", function(d) { 
          d3.select(this).style("stroke-width", "5px");
          svg_l_1_2.selectAll("text.text_country" + d.name.substring(0, 4)).style("font-size", "13px");})
//      .append("svg:title")
//      .text(function(d) {return "Country: " + d.name;})
      .on("mouseout", function(d) {
          d3.select(this).style("stroke-width", "1.5px");
          svg_l_1_2.selectAll("text.text_country" + d.name.substring(0, 4)).style("font-size", "10px");
//          if (d.name != "Syria" && d.name != "Yemen" && d.name != "Pakistan"){
//              svg_l_1_2.selectAll("text.text_country" + d.name.substring(0, 4)).style("opacity", "0.5");
//          }
          });
    
//    path.attr("class", function(d) {return d.name.substring(0,4);})
//      .on("mouseover", function(d) {svg_l_1_2.selectAll("path." + d.name.substring(0, 4)).style("stroke-width", "5px");});
//      .append("svg:title")
//      .text(function(d) {return "Country: " + d.name;});
//        .on("mouseout", function(d) {
//                svg.selectAll("rect.terror_group" + d.substring(d.length - 4, d.length)).style("fill-opacity", 0.8).style("stroke","none");
//        });
        
    country.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .attr("transform", function(d) { 
        if (d.name === "Philippines" || d.name === "United States") {
            return "translate(" + x_l_1_2(d.value.year) + "," + y_l_1_2(d.value.killed + 55) + ")"; 
        } else if (d.name === "Congo") {
            return "translate(" + x_l_1_2(d.value.year) + "," + y_l_1_2(d.value.killed - 55) + ")";
        } else if ( d.name === "Sri Lanka") {
            return "translate(" + x_l_1_2(d.value.year) + "," + y_l_1_2(d.value.killed - 130) + ")";
        } else if (d.name === "Algeria") {
            return "translate(" + x_l_1_2(d.value.year) + "," + y_l_1_2(d.value.killed - 75) + ")";
        }
        else {
            return "translate(" + x_l_1_2(d.value.year) + "," + y_l_1_2(d.value.killed) + ")";
        }
        
        })
      .attr("class", function(d) {return "text_country" + d.name.substring(0, 4);})
      .attr("x", 3)
      .attr("dy", ".35em")
      .style("font-size", "1px")
      .style("opacity", "1")
//      .style("opacity", function(d) {
//        if (d.name === "Syria" || d.name === "Yemen" || d.name === "Pakistan") {
//            return 1;
//        } else {
//            return 0.5;
//        }
//    })
      .text(function(d) { return d.name; });
    
    var varNames = ["Syria","Yemen","Algeria","Pakistan","India","Sri Lanka","Somalia","Sudan","Congo","Philippines","Russia","United States"]
    
//    var legend = svg_l_1_2.selectAll(".legend")
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
