
var data = [
    [0,0,0,0,0],
    [631.614,  3202.475, 721.086, 280.633, 297.869],
    [2477.536, 5266.848, 507.223, 433.114, 706.793],
    [4386.591, 4888.653, 645.577, 500.143, 464.003]
];

var m = 100,
    r = 100,
    z = d3.scale.ordinal().domain(function(d, i){return z[i]}).range(["#00FF00", "#0358FF" , "#FF0D00", "#FFFF40","FF7400"]);


var svg2 = d3.select("body").selectAll("svg")
    .data(data)
    .enter().append("svg")
    .attr("width", (r + m) * 2)
    .attr("height", 110 * 2)
    .append("g")
    .attr("transform", "translate(" + 300 + "," + 110 + ")");

svg2.selectAll("path")
    .data(d3.layout.pie())
    .enter().append("path")
    .attr("d", d3.svg.arc()
    .innerRadius(r / 1.4)
    .outerRadius(r)
    .padAngle(0.05)
    .cornerRadius(20))
    .style("fill", function(d, i) { return z(i); })
    .style("opacity", "0.8");
