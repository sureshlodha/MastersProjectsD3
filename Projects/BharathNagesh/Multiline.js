
var margin = {top: 50, right: 150, bottom: 30, left: 50},
    width = 1200 - margin.left - margin.right + 100,
    height = 600 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse;

var line = d3.svg.line()
    .interpolate("basis")
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.population); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + (margin.left + 75) + "," + margin.top + ")");

function gridXaxis () {
    return d3.svg.axis()
        .scale(x)
        .orient("bottom")
        .tickSize(-height, 0, 0)
        .tickFormat("");
}

function gridYaxis () {
    return d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickSize(-width, 0, 0)
        .tickFormat("");
}

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.log()
    .range([height, 0]);

var color = d3.scale.ordinal().domain(function(d, i){return z[i]}).range(["#F40B0B", "#F77A04" , "#00C8F5", "#52F043","#43E5F0", "#04CBF7", "#04B1F7","#0476F7"]);


var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom").ticks(10);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left").ticks(20, "s");


d3.csv("country-data.csv", function(error, data) {
    color.domain(d3.keys(data[0]).filter(function(key) { return key != "year"; }));
    data.forEach(function(d) {
       d.year = parseDate(d.year);
    });



    var cities = color.domain().map(function(name) {
        return {
          name: name,
          values: data.map(function(d) {
            return {year: d.year, population: +d[name]};
          })
        };
    });


    x.domain(d3.extent(data, function(d) { return (d.year); }));

    y.domain([
       d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.population; }); }),
       d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.population; }); })
    ]);



    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .append("text")
        .attr("transform", "translate(" + width/2 + ",20)")
        .attr("x", 30)
        .attr("y", 10)
        .style("text-anchor", "middle")
        .style("font-size","15px")
        .text("Year")
    
    svg.append("text")
        .attr("transform", "translate(" + (width/2 - 100) + ","+ (height-20)+")")
        .attr("x", 30)
        .attr("y", 10)
        .style("font-size","15px")
        .style("fill", "blue")
        .text("Population after 2015 -->");


    svg.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(gridXaxis());


    svg.append("g")
        .attr("class", "grid")
        .call(gridYaxis());


    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "translate(-40," + height/2 + ")rotate(-90)")
        .style("text-anchor", "middle")
        .style("font-size", "15px")
        .text("Population");

    svg.append("line")
        .style("stroke", "#464749")
        .style("stroke-width", "1.5px")
        .style("opacity", "0.7")
        .attr("x1", 476.5)
        .attr("y1", height)
        .attr("x2", 476.5)
        .attr("y2", 0);


    var city = svg.selectAll(".city")
      .data(cities)
      .enter().append("g")
      .attr("class", "city");

    var path = city.append("path")
      .attr("class", "line")
      .attr("d", function(d) { return line(d.values); })
      .style("stroke", function(d) {
          console.log(color(d.name));
          return color(d.name);
        });

    var totalLength = path.node().getTotalLength();

    path.attr("stroke-dasharray", totalLength + "," + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition().duration(1000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);



    city.append("text")
      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
      .transition().duration(1000)
        .delay( function(d,i) {
			return i * 200;
      })
      .attr("transform", function(d) { return "translate(" + x(d.value.year) + "," + y(d.value.population) + ")"; })
      .attr("x", 3)
      .attr("dy", ".35em")
      .text(function(d) { return d.name; });


    city.selectAll(".dot")
        .data(function(d) {
            return d.values;
        })
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", function(d) {
            return x(d.year);
        })
        .attr("cy", function(d) {
            return y(d.population);
        })
        .attr("r", 3)
        .style("opacity",0)

        .on("mouseover", function(d) {

            d3.select(this).style("opacity", 1);

        })

});

