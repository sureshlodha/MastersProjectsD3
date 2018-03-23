var margin = {left: 80, right: 80, top: 50, bottom: 50},
    width = 1120 - margin.left - margin.right,
    height = 1060 - margin.top - margin.bottom;


var ori_color = d3.scaleThreshold().domain([1, 10, 50, 200, 500, 1000, 2000, 4000]).range(d3.schemeOrRd[9]);

var new_color = d3.scaleThreshold().domain([1, 10, 30, 100, 400, 1000, 3000, 6000]).range(d3.schemeYlGn[9]);


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(0,40)");

var x = d3.scaleSqrt()
			.domain([0, ori_color.domain()[7]])
			.rangeRound([440, 950]);

g.selectAll("rect")
  .data(ori_color.range().map(function(d) {
	  d = ori_color.invertExtent(d);
	  if (d[0] == null) d[0] = x.domain()[0];
	  if (d[1] == null) d[1] = x.domain()[1];
	  return d;
	}))
  .enter().append("rect")
	.attr("height", 8)
	.attr("x", function(d) { return x(d[0]); })
	.attr("width", function(d) { return x(d[1]) - x(d[0]); })
	.attr("fill", function(d) { return ori_color(d[0]); })

g.append("text")
	.attr("class", "caption")
	.attr("x", x.range()[0])
	.attr("y", -6)
	.attr("fill", "#000")
	.attr("text-anchor", "start")
	.attr("font-weight", "bold")
	.text("Population per square mile");

g.call(d3.axisBottom(x)
	.tickSize(13)
	.tickValues(ori_color.domain()))
	.select(".domain")
	.remove();

//g.attr("opacity", 0);

var new_g = svg.append("g")
    .attr("class", "new_key")
    .attr("transform", "translate(0,40)");

var new_x = d3.scaleSqrt()
			.domain([0, new_color.domain()[7]])
			.rangeRound([440, 950]);

new_g.selectAll("rect")
  .data(new_color.range().map(function(d) {
	  d = new_color.invertExtent(d);
	  if (d[0] == null) d[0] = new_x.domain()[0];
	  if (d[1] == null) d[1] = new_x.domain()[1];
	  return d;
	}))
  .enter().append("rect")
	.attr("height", 8)
	.attr("x", function(d) { return new_x(d[0]); })
	.attr("width", function(d) { return new_x(d[1]) - new_x(d[0]); })
	.attr("fill", function(d) { return new_color(d[0]); })

new_g.append("text")
	.attr("class", "caption")
	.attr("x", new_x.range()[0])
	.attr("y", -6)
	.attr("fill", "#000")
	.attr("text-anchor", "start")
	.attr("font-weight", "bold")
	.text("Population per square mile");

new_g.call(d3.axisBottom(new_x)
	.tickSize(13)
	.tickValues(new_color.domain()))
	.select(".domain")
	.remove();

new_g.attr("display", "none");

var g_buttons = svg.append("g")
    .attr("class", "buttons-g")
    .attr("transform", "translate(440, 70)");

function create_butoon(name, text, width, tx, ty, callback) {
    var btn = g_buttons.append("g")
        .attr("class", "button button-" + name)
        .attr("transform", "translate(" + tx + "," + ty + ")");

    btn.append("rect")
        .attr("height", 28)
        .attr("width", width)
        .attr('rx', 5)
        .attr('ry', 5)
        .attr("fill", '#f2f2f2')
        .attr("stroke", '#000');

    btn.append("text")
        .style("text-anchor", "middle")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("font-size", "18px")
        .text(text);

    btn.on("click", callback);
}

create_butoon('change_color', 'Change Legend Color', 200, 0, 0, set_new_Color);
var state_b_on = false;
var tract_b_on = false;
create_butoon('change_color', 'State Boundary', 150, 210, 0, function () {
    if (state_b_on) {
        svg.select("g.state-border")
            .attr("class", "state-border inactive")
    } else {
        svg.select("g.state-border")
            .attr("class", "state-border active")
    }
    state_b_on = !state_b_on;
});

create_butoon('change_color', 'Census Tract Boundary', 200, 370, 0, function () {
    if (tract_b_on) {
        svg.select("g.tracts")
            .attr("class", "tracts inactive")
    } else {
        svg.select("g.tracts")
            .attr("class", "tracts active")
    }
    tract_b_on = !tract_b_on;
});

var path = d3.geoPath();

d3.json("mi-topo.json", function(error, mi) {
  if (error) throw error;

	svg.append("g")
		.attr("class", "tracts inactive")
		.selectAll("path")
		.data(topojson.feature(mi, mi.objects.tracts).features)
		.enter().append("path")
		.attr("d", path)
		.style("fill", function(d) { return ori_color(d.properties.density)});

	svg.append("g")
		.attr("class", "counties active")
		.selectAll("path")
		.data(topojson.feature(mi, mi.objects.counties).features)
		.enter().append("path")
		.attr("d", path)
		.attr("fill", "none")
		.attr("stroke", "#000")
		.attr("opacity", 0.3);
	
	// draw state boundary
    svg.append("g")
        .attr("class", "state-border inactive")
        .selectAll("path")
        .data(topojson.feature(mi, mi.objects.state_border).features)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", "none");
});

var flag = 0;
function set_new_Color(){
	if (flag == 0) {
		var testCircle = svg.select(".tracts")
						.selectAll("path")
						.style("fill", function(d) { return new_color(d.properties.density)});
		new_g.attr("display", "inline");
		g.attr("display", "none");
		flag = 1;
	}
	else{
		var testCircle = svg.select(".tracts")
						.selectAll("path")
						.style("fill", function(d) { return ori_color(d.properties.density)});
		new_g.attr("display", "none");
		g.attr("display", "inline");
		flag = 0;
	}
	
	
}