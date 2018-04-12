
var margin1 = {top1: 20, right1: 170, bottom1: 40, left1: 30},
    width1 = 1000,
    height1 = 300 - margin1.top1 - margin1.bottom1;

var x1 = d3.scale.linear()
    .range([0, width1]);

var y1 = d3.scale.ordinal()
    .rangeRoundBands([0, height1], 0.1);

var AxisX = d3.svg.axis()
    .scale(x1)
    .orient("bottom");

var AxisY = d3.svg.axis()
    .scale(y1)
    .orient("left")
    .tickSize(0)
    .tickPadding(6);

var svg3 = d3.select("body").append("svg")
    .attr("width", width1 + margin1.left1 + margin1.right1)
    .attr("height", height1 + margin1.top1 + margin1.bottom1)
    .append("g")
    .attr("transform", "translate(" + (margin1.left1 + 125) + "," + margin1.top1 + ")");


d3.csv("population-change.csv", type, function (error, data) {
    x1.domain(d3.extent(data, function (d) { return d.value; })).nice();
    y1.domain(data.map(function (d) { return d.name; }));

    svg3.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", function(d) { return "bar bar--" + (d.value < 0 ? "negative" : "positive"); })
        .attr("x", function(d) { return x1(Math.min(0, d.value)); })
        .attr("y", function(d) { return y1(d.name); })
        .attr("width", function(d) { return Math.abs(x1(d.value) - x1(0)); })
        .attr("height", 20)
        .attr("rx", 10);

    svg3.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + 0 + "," + height1 + ")")
        .call(AxisX);

    svg3.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + x1(-50) + ",0)")
        .call(AxisY);

    svg3.append("line")
        .style("stroke", "#464749")
        .attr("x1", x1(0))
        .attr("y1", height1)
        .attr("x2", x1(0))
        .attr("y2", 0);
});

function type(d) {
  d.value = +d.value;
  return d;
}


