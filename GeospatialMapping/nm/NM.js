
var width = 960,
    height = 960;


var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var path = d3.geoPath();


var x = d3.scaleSqrt()
    .domain([0, 4500])
    .rangeRound([440, 950]);

var color = d3.scaleThreshold()
              .domain([1, 10, 50, 200, 500, 1000, 2000, 4000])
              .range(d3.schemeOrRd[9]);

var colorOrRd = true,
    stateboundary = false,
    tractboundary = false;

var xAxis = d3.axisBottom(x)
            .tickSize(13)
            .tickValues(color.domain())
    

function loaddata(filename, displaytracts) {
    d3.json(filename, function(error, topology) {
        if (error) throw error;

        console.log(topology);    
        svg.append("g")
            .selectAll("path")
            .data(topojson.feature(topology, topology.objects.tracts).features)
            .enter().append("path")
              .attr("fill", function(d) { return color(d.properties.density); })
              .attr("d", path);

          svg.append("path")
              .datum(topojson.feature(topology, topology.objects.counties))
              .attr("fill", "none")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.3)
              .attr("d", path);
         
          if(displaytracts) {
              svg.append("path")
              .datum(topojson.feature(topology, topology.objects.tracts))
              .attr("fill", "none")
              .attr("stroke", "#000")
              .attr("stroke-opacity", 0.3)
              .attr("d", path)
              .attr("id", "tracts");              
          }
        
          svg.append("g") 
             .attr("transform", "translate(0," + (height - 30) + ")")  
             .call(xAxis)
             .select(".domain")
             .remove();             
    }); 
}




var datafile = "nm-topo.json";

function drawdata(datafile, displaytracts) {    
    var g = svg.append("g")
        .attr("class", "key")
        .attr("transform", "translate(0,40)");
    
    

    
    g.selectAll("rect")
      .data(color.range().map(function(d) {
          d = color.invertExtent(d);
          if (d[0] == null) d[0] = x.domain()[0];
          if (d[1] == null) d[1] = x.domain()[1];
          return d;
        }))
      .enter().append("rect")
        .attr("height", 8)
        .attr("x", function(d) { return x(d[0]); })
        .attr("y", height - 70)
        .attr("width", function(d) { return x(d[1]) - x(d[0]); })
        .attr("fill", function(d) { return color(d[0]); });

    
    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", height - 80)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text("Population per square mile");  
    
    
    loaddata(datafile, displaytracts);
    
    
    d3.select("#legendcolor button").on("click", function(){
        if(colorOrRd) {
            color.range(d3.schemeGreys[9]);
             colorOrRd = false;
        }else {
            color.range(d3.schemeOrRd[9]);
            colorOrRd = true;
        } 
        drawdata(datafile, tractboundary);
    });
    
    d3.select("#stateboundary button").on("click", function(){
        if(stateboundary) {
            datafile = "nm-topo.json";
            stateboundary = false;
        }else {
            datafile = "nm-merge-topo.json";
            stateboundary = true;
        } 
        drawdata(datafile, tractboundary);
        console.log("hello");
    });
    
    d3.select("#tractboundary button").on("click", function() {                
        if(tractboundary) {                    
            d3.select("#tracts").remove();
            tractboundary = false;
        }else {                    
            tractboundary = true;                    
        } 
        drawdata(datafile, tractboundary);               
    });
    
}

drawdata(datafile, tractboundary);

