var width = 960,
    rotated = 90,
    height = 1200;

//track where mouse was clicked
var initX;
//track scale only rotate when s === 1
var s = 1;
var mouseClicked = false;

var arr = [];
var curMon = 0;
var curData = [];
var top = " ";
var country = " ";
var ind = 0;
var printA = 0;
var formatComma = d3.format(",");
var svg3;

var streamData = [
  {
   "month": "Jan",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "Feb",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "Mar",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "Apr",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "May",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "June",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "July",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "Aug",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "Sept",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "Oct",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "Nov",
   "artist": " ",
   "streams": 0,
  }, {
   "month": "Dec",
   "artist": " ",
   "streams": 0,
  },

];

d3.queue()
    .defer(d3.csv, "01.csv")
    .defer(d3.csv, "02.csv")
    .defer(d3.csv, "03.csv")
    .defer(d3.csv, "04.csv")
    .defer(d3.csv, "05.csv")
    .defer(d3.csv, "06.csv")
    .defer(d3.csv, "07.csv")
    .defer(d3.csv, "08.csv")
    .defer(d3.csv, "09.csv")
    .defer(d3.csv, "10.csv")
    .defer(d3.csv, "11.csv")
    .defer(d3.csv, "12.csv")
    .await(function(error, jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec) {
           if (error) {
                console.error('ERROR'+error);
            }
            else {
                var arr = [jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec];
            }
    console.log(arr);
    
    var projection = d3.geoMercator()
    .scale(153)
    .translate([width/2,450])
    .rotate([0,0,0]); //center on USA

    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
          //track where user clicked down
          .on("mousedown", function() {
             d3.event.preventDefault(); 
             //only if scale === 1
             if(s !== 1) return;
               initX = d3.mouse(this)[0];
               mouseClicked = true;
          })
          .on("mouseup", function() {
              if(s !== 1) return;
              rotated = rotated + ((d3.mouse(this)[0] - initX) * 360 / (s * width));
              mouseClicked = false;
          })

      function rotateMap(endX) {
        projection.rotate([rotated + (endX - initX) * 360 / (s * width),0,0])
            g.selectAll('path')       // re-project path data
           .attr('d', path);
      }
    //for tooltip 
    var offsetL = document.getElementById('map').offsetLeft+10;
    var offsetT = document.getElementById('map').offsetTop+10;

    var path = d3.geoPath()
        .projection(projection);

    var tooltip = d3.select("#map")
         .append("div")
         .attr("class", "tooltip hidden");

    //need this for correct panning
    var g = svg.append("g");
    
    g.append("text")
        .attr("x", 10)
        .attr("y", 770)
        .style("fill", "white")
        .style("font-size","20px")
        .text("Top 10 Artists");
    g.append("text")
        .attr("x", 10)
        .attr("y", 860)
        .style("fill", "white")
        .style("font-size","14px")
        .text("1.");
    g.append("text")
        .attr("x", 10)
        .attr("y", 880)
        .style("fill", "white")
        .style("font-size","14px")
        .text("2.");
    g.append("text")
        .attr("x", 10)
        .attr("y", 900)
        .style("fill", "white")
        .style("font-size","14px")
        .text("3.");
    g.append("text")
        .attr("x", 10)
        .attr("y", 920)
        .style("fill", "white")
        .style("font-size","14px")
        .text("4.");
    g.append("text")
        .attr("x", 10)
        .attr("y", 940)
        .style("fill", "white")
        .style("font-size","14px")
        .text("5.");
    g.append("text")
        .attr("x", 10)
        .attr("y", 960)
        .style("fill", "white")
        .style("font-size","14px")
        .text("6.");
    g.append("text")
        .attr("x", 10)
        .attr("y", 980)
        .style("fill", "white")
        .style("font-size","14px")
        .text("7.");
    g.append("text")
        .attr("x", 10)
        .attr("y", 1000)
        .style("fill", "white")
        .style("font-size","14px")
        .text("8.");
    g.append("text")
        .attr("x", 10)
        .attr("y", 1020)
        .style("fill", "white")
        .style("font-size","14px")
        .text("9.");
    g.append("text")
        .attr("x", 10)
        .attr("y", 1040)
        .style("fill", "white")
        .style("font-size","14px")
        .text("10.");

    //det json data and draw it
    d3.json("combined2.json", function(error, world) {
      if(error) return console.error(error);

      //countries
      g.append("g")
          .attr("class", "boundary")
        .selectAll("boundary")
          .data(topojson.feature(world, world.objects.countries).features)
          .enter().append("path")
          .attr("name", function(d) {return d.properties.name;})
          .attr("id", function(d) { return d.id;})
          .on('click', selected)
          .on("mousemove", showTooltip)
          .on("mouseout",  function(d,i) {
              tooltip.classed("hidden", true);
           })
          .attr("d", path);

    })

    function showTooltip(d) {
      label = d.properties.name;
      var mouse = d3.mouse(svg.node())
        .map( function(d) { return parseInt(d); } );
        country = label;
        printA = 0;
        for (i=0; i < curData.length; i=i+10){
            if (country == curData[i].ADMIN) {
                ind = i;
                printA = 1;
            }
        }
        if (printA == 1) {
            tooltip.classed("hidden", false)
                .attr("style", "left:"+(d3.event.pageX + 12)+"px;top:"+ (d3.event.pageY - 12)+"px")
                .html(label + "<br/>" + curData[ind].Artist + "<br/>" + formatComma(curData[ind].Streams) + " streams");
        }
        else {
            tooltip.classed("hidden", false)
                .attr("style", "left:"+(d3.event.pageX + 12)+"px;top:"+ (d3.event.pageY - 12)+"px")
                .html(label + "<br/>" + "No data for this country"); 
        }
    }

    function selected() {
      d3.select('.selected').classed('selected', false);
      d3.select(this).classed('selected', true);
      d3.select("#nation").remove();
      drawStream();
        g.append("text")
            .attr("id", "nation")
            .attr("x", 10)
            .attr("y", 800)
            .style("fill", "white")
            .style("font-size","20px")
            .text(label);
      if (printA == 1) {
        d3.select("#one").remove();
        g.append("text")
            .attr("id", "one")
            .attr("x", 35)
            .attr("y", 860)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind].Artist + " - " + formatComma(curData[ind].Streams));
        d3.select("#two").remove();
        g.append("text")
            .attr("id", "two")
            .attr("x", 35)
            .attr("y", 880)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind+1].Artist + " - " + formatComma(curData[ind+1].Streams));
        d3.select("#three").remove();
        g.append("text")
            .attr("id", "three")
            .attr("x", 35)
            .attr("y", 900)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind+2].Artist + " - " + formatComma(curData[ind+2].Streams));
        d3.select("#four").remove();
        g.append("text")
            .attr("id", "four")
            .attr("x", 35)
            .attr("y", 920)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind+3].Artist + " - " + formatComma(curData[ind+3].Streams));
        d3.select("#five").remove();
        g.append("text")
            .attr("id", "five")
            .attr("x", 35)
            .attr("y", 940)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind+4].Artist + " - " + formatComma(curData[ind+4].Streams));
        d3.select("#six").remove();
        g.append("text")
            .attr("id", "six")
            .attr("x", 35)
            .attr("y", 960)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind+5].Artist + " - " + formatComma(curData[ind+5].Streams));
        d3.select("#seven").remove();
        g.append("text")
            .attr("id", "seven")
            .attr("x", 35)
            .attr("y", 980)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind+6].Artist + " - " + formatComma(curData[ind+6].Streams));
        d3.select("#eight").remove();
        g.append("text")
            .attr("id", "eight")
            .attr("x", 35)
            .attr("y", 1000)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind+7].Artist + " - " + formatComma(curData[ind+7].Streams));
        d3.select("#nine").remove();
        g.append("text")
            .attr("id", "nine")
            .attr("x", 35)
            .attr("y", 1020)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind+8].Artist + " - " + formatComma(curData[ind+8].Streams));
        d3.select("#ten").remove();
        g.append("text")
            .attr("id", "ten")
            .attr("x", 35)
            .attr("y", 1040)
            .style("fill", "white")
            .style("font-size","14px")
            .text(curData[ind+9].Artist + " - " + formatComma(curData[ind+9].Streams));
          
        d3.select("#bartitle").remove();
        
        g.append("text")
            .attr("id", "bartitle")
            .attr("x", 500)
            .attr("y", 740)
            .style("fill", "white")
            .style("font-size","20px")
            .text("2017 " + label + " Top Artists");
      }
      else {
        d3.select("#one").remove();
        d3.select("#two").remove();
        d3.select("#three").remove();
        d3.select("#four").remove();
        d3.select("#five").remove();
        d3.select("#six").remove();
        d3.select("#seven").remove();
        d3.select("#eight").remove();
        d3.select("#nine").remove();
        d3.select("#ten").remove();
        d3.select("#bartitle").remove();
      }
    }
    
    var formatDateIntoYear = d3.timeFormat("%Y");
    var formatDateIntoMonth = d3.timeFormat("%m");
    var formatDateIntoM = d3.timeFormat("%b");
    var formatDate = d3.timeFormat("%b %Y");

    var startDate = new Date("2017-01-02"),
        endDate = new Date("2017-12-31");

    var margin = {right: 50, left: 50};

    var x = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, width-100])
        .clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + 680 + ")");

    slider.append("line")
        .attr("class", "track")
        .attr("x1", x.range()[0])
        .attr("x2", x.range()[1])
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-inset")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
        .attr("class", "track-overlay")
        .call(d3.drag()
            .on("start.interrupt", function() { slider.interrupt(); })
            .on("start drag", function() { chMon(x.invert(d3.event.x)); }));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .text(function(d) { return formatDateIntoM(d); });

    var labelm = slider.append("text")  
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .style("fill", "white")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-25) + ")");

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    slider.transition()
        .duration(750)
        .tween("chMon", function() {
          var i = d3.interpolate(0, 70);
          return function(t) { chMon(i(t)); };
        });

    function chMon(h) {
      handle.attr("cx", x(h));
      if (curMon != formatDateIntoMonth(h)) {
          curMon = formatDateIntoMonth(h);
          var temp = +curMon - 1;
          curData = arr[temp];
      }
      labelm
        .attr("x", x(h))
        .text(formatDate(h));
      d3.select("#dat").remove();
      g.append("text")
        .attr("id", "dat")
        .attr("x", 10)
        .attr("y", 820)
        .style("fill", "white")
        .style("font-size","16px")
        .text(formatDate(h));
    }
    
    function drawStream() {
        
        var colorRange = d3.scaleOrdinal(d3.schemeCategory10);;
        var color = d3.scaleOrdinal()
            .range(colorRange.range());

        
        d3.select("#bars").remove();
        
        var temp2;
        for (j=0; j < 12; j=j+1){
            temp2 = arr[j];
            for (i=0; i < temp2.length; i=i+10){
                if (country == temp2[i].ADMIN) {
                    streamData[j].artist = temp2[i].Artist;
                    streamData[j].streams = temp2[i].Streams;
                }
            }
        }
        console.log(streamData);
        
        var tooltip = d3.select("body").append("div").attr("class", "toolTip");
        
        svg3 = d3.select("g"),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 400,
        height = 400;
        
        svg3 = svg3.append("g")
            .attr("transform", "translate(" + 450 + "," + 770 + ")")
            .attr("id", "bars");

        var x = d3.scaleBand()
                  .range([0, width])
                  .padding(0.1);
        var y = d3.scaleLinear()
                  .range([height, 0]);


          // format the data
          streamData.forEach(function(d) {
            d.streams = +d.streams;
          });

          // Scale the range of the data in the domains
          x.domain(streamData.map(function(d) { return d.month; }));
          y.domain([0, d3.max(streamData, function(d) { return d.streams; })]);
        
        var div = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);


          // append the rectangles for the bar chart
          svg3.selectAll(".bar")
              .attr("id", "bars")
              .data(streamData)
            .enter().append("rect")
              .attr("class", "bar")
              //.attr("fill", "GhostWhite")
              .attr("x", function(d) { return x(d.month); })
              .attr("width", x.bandwidth())
              .attr("y", function(d) { return y(d.streams); })
              .attr("height", function(d) { return height - y(d.streams); })
              .style("fill", function(d) { return color(d.artist); })
              .on("mouseover", function(d) {		
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div	.html(d.artist + "<br/>"  + formatComma(d.streams) +" streams")	
                    .style("left", (d3.event.pageX + 28) + "px")		
                    .style("top", (d3.event.pageY + 28) + "px");	
                })					
                .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);
                });
        

          // add the x Axis
          svg3.append("g")
              .attr("class", "axisWhite")
              .attr("transform", "translate(0," + height + ")")
              .call(d3.axisBottom(x));

          // add the y Axis
          svg3.append("g")
              .attr("class", "axisWhite")
              .call(d3.axisLeft(y));

 
    }
});