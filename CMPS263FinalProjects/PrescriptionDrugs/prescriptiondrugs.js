/*
    Author: Tuan Tran
    March 18, 2018
    CMPS 263 
*/

var margin = {top: 10, right: 100, bottom: 40, left: 80},
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
    

var g = d3.select(".svg").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


var parseTime = d3.timeParse("%Y-%Y");


var x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory10);


var line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.percentage); });


var totalLength;
var path; 
var conditions;


//different age groups in the dataset
var ageGroups = [
    {key : "under 18"},
    {key : "18 to 44"},
    {key : "45 to 64"},
    {key : "65 older"},
    {key : "all"}
];



//mapping of drug conditions to drug name and display flag
var drugMap = {
    "asthma" : {
        name: "Bronchodilators", 
        display : true
    },
    "respiratory" : {
        name: "Respiratory inhalant products", 
        display : true
    },
    "bacterial" : {
        name: "Penicillins", 
        display : true
    },
    "hypertension" : {
        name: "Calcium channel blocking agents", 
        display : false
    },
    "heart disease" : {
        name: "Beta-adrenergic blocking agents", 
        display : true
    },
    "cholesterol" : {
        name: "Antihyperlipidemic agents", 
        display : false
    },
    "diabetes" : {
        name: "Antidiabetic agents", 
        display : false
    },
    "hypothyroidism" : {
        name: "Thyroid hormones", 
        display : false
    },
    "depression" : {
        name: "Antidepressants", 
        display : true
    },
    "anxiety" : {
        name: "Anxiolytics, sedatives, and hypnotics", 
        display : false
    },
    "epilepsy" : {
        name: "Anticonvulsants", 
        display : false
    },
    "pain relief" : {
        name: "Analgesics", 
        display : true
    }
};



//parse the columns of data in the file
function parseData(d, _, columns) {
  d.year = parseTime(d.year);
  for (var i = 2, n = columns.length, c; i < n; ++i) {
      d[c = columns[i]] = +d[c];
  }
  return d;
}


//helper function to display the display status of the drugs
function displayDrugmap() {
    Object.keys(drugMap).forEach(function(key) {
        console.log("key: " + key + " |  " + drugMap[key].display);
    });
}


//draw grid lines for the chart
function drawGridLines() {
    //https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
    //grid lines for x-axis
    g.append("g")
     .attr("class", "grid grid-x")
     .attr("transform", "translate(0," + height + ")")
     .call(d3.axisBottom(x)
            .ticks(10)
            .tickSize(-height)
            .tickFormat("")
     )
     .attr("id", "xgrid");

     //grid lines for y-axis
     g.append("g")
      .attr("class", "grid grid-y")
      .call(d3.axisLeft(y)
            .ticks(10)
            .tickSize(-width)
            .tickFormat("")
      )  
     .attr("id", "ygrid");
}//end drawGridLines()



//draw the x and y axis along with the labels
function drawAxis() {
    g.append("g")
        .attr("id", "xaxis")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        //append the x-axis label
        .append("text")
        .text("Year")
        .attr("x", width)
        .attr("y", 8)
        .attr("dx", "4em")
        .attr("dy", "0.8em")
        .attr("fill", "black")
        .style("text-anchor", "left")
        .attr("font-size", "12px");
        
    
    g.append("g")
        .attr("id", "yaxis")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        //append the y-axis label
        .append("text") 
        .text("Percentage of Population Use")
        .attr("dy", "-3em")       
        .attr("x", -(height / 2))    
        .attr("transform", "rotate(-90)")        
        .attr("fill", "black")
        .style("text-anchor", "middle")
        .attr("font-size", "12px");    
} //end drawAxis()



//Code from Shuai Zhou for adding checkboxes to multiline chart
function tweenDashoffsetOn() {
    const l = this.getTotalLength(),
          i = d3.interpolateString("" + l, "0");
    return function (t) {
        return i(t);
    };
}


function tweenDashoffsetOff() {
    const l = this.getTotalLength(),
          i = d3.interpolateString("0", "" + l);
    return function (t) {
        return i(t);
    };
}



function drawLines(conditions) {
    //add a new group element
    var drug = g.selectAll(".drug")
                .data(conditions)
                .enter().append("g")
                .attr("class", "drug")
                .attr("id", function (d) {
                    return d.id.split(' ').join('_');
                });


    //add a path for each drug
    drug.append("path")
        .attr("class", "line")
        .attr("d", function (d) {
            return line(d.values);
        })
        .attr("fill", "none")
        .style("stroke", function (d) {
            return z(d.id);
        });

    //add the drug condition label
    drug.append("text")
        .datum(function (d) {
            return {name: d.id, value: d.values[d.values.length - 1], display: d.display};
        })
        .attr("transform", function (d) {
            return "translate(" + x(d.value.year) + "," + y(d.value.percentage) + ")";
        })
        .attr("x", 3)
        .attr("dy", "0.3em")
        .style("text-anchor", "start")
        .style("font", "12px sans-serif")
        .text(function(d) { 
            return d.name; 
        })
        .style('opacity', 0)
        .filter(function (d) {
            return d.display
        })
        .transition()
        .duration(2000)
        .style('opacity', 1);
   

    //display drugs that has the display flag on
    var paths = drug.select("path")
                    .each(function() {
                        d3.select(this)
                          .attr("stroke-dasharray", this.getTotalLength() + "," + this.getTotalLength())
                          .attr("stroke-dashoffset", "" + this.getTotalLength());
                    });
    paths.filter(function (d) {
            return d.display;
        })
        .transition()
        .duration(2000)
        .attrTween("stroke-dashoffset", tweenDashoffsetOn);  
    
}//end drawLines()



//https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91
function drawMouseover(conditions) {
    var mouseG = g.append("g")
                  .attr("class", "mouse-over-effects");

    mouseG.append("path") // this is the black vertical line to follow mouse
      .attr("class", "mouse-line")
      .style("stroke", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");
      
    var lines = document.getElementsByClassName('line');

    var mousePerLine = mouseG.selectAll('.mouse-per-line')
                              .data(conditions)
                              .enter()
                              .append("g")
                              .attr("class", "mouse-per-line");

    mousePerLine.append("circle")
                .attr("r", 7)
                .style("stroke", function(d) {
                  return z(d.id);
                })
                .style("fill", "none")
                .style("stroke-width", "1px")
                .style("opacity", "0");

    mousePerLine.append("text")
      .attr("transform", "translate(10,3)")
      .style("font", "12px sans-serif");

    mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
      .attr('width', width) // can't catch mouse events on a g element
      .attr('height', height)
      .attr('fill', 'none')
      .attr('pointer-events', 'all')
      .on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })
      .on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })
      .on('mousemove', function() { // mouse moving over canvas
        var mouse = d3.mouse(this);
        d3.select(".mouse-line")
          .attr("d", function() {
            var d = "M" + mouse[0] + "," + height;
            d += " " + mouse[0] + "," + 0;
            return d;
          });

        d3.selectAll(".mouse-per-line")
          .attr("transform", function(d, i) {
            var xDate = x.invert(mouse[0]),
                bisect = d3.bisector(function(d) { return d.date; }).right;
                idx = bisect(d.values, xDate);
            
            var beginning = 0,
                end = lines[i].getTotalLength(),
                target = null;

            while (true){
              target = Math.floor((beginning + end) / 2);
              pos = lines[i].getPointAtLength(target);
              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                  break;
              }
              if (pos.x > mouse[0])      end = target;
              else if (pos.x < mouse[0]) beginning = target;
              else break; //position found
            }
            
            d3.select(this).select('text')
              .text(y.invert(pos.y).toFixed(2));
              
            return "translate(" + mouse[0] + "," + pos.y +")";
          });
      });
    
}//end drawMouseover()




function checkChanged() {
    var checked = this.checked;
    var drugid = this.getAttribute("drugid");
    var drugName = this.getAttribute("drugname");
    g = d3.select("#" + drugid);
    
    if (!checked) {
        g.select("text")
            .transition()
            .duration(1000)
            .style("opacity", 0);
        g.select("path").transition()
            .duration(2000)
            .attrTween("stroke-dashoffset", tweenDashoffsetOff);
        drugMap[drugName].display = false;
    } else {
        g.select("text")
            .transition()
            .duration(1000)
            .style('opacity', 1);
        g.select("path").transition()
            .duration(2000)
            .attrTween("stroke-dashoffset", tweenDashoffsetOn);
        drugMap[drugName].display = true;
    }    
}//end checkedChanged()


function drawCheckboxes(conditions) {
    var checkboxes = d3.select(".drug-list").selectAll(".drug-checkbox")
        .data(conditions)
        .enter()
        .append("li")
        .attr("class", "drug-checkbox");
    
    checkboxes.append("input")
        .attr("type", "checkbox")
        .attr("drugname", function (d) {
            return d.id;
        })
        .attr("id", function (d) {
                return d.id.split(' ').join('_') + '_checkbox';
        })
        .attr("drugid", function (d) {
            return d.id.split(' ').join('_');
        })
        .on("change", checkChanged)
        .filter(function (d) {
            return d.display;
        })
        .each(function(d) {
            d3.select(this)
              .attr("checked", true)
        });    
    
    
    checkboxes.append("label")
        .attr("for", function (d) {
            return d.id.split(' ').join('_') + '_checkbox';
            })
        .text(function (d) {
            return d.id;
        });        
}//end drawCheckboxes()




//parses the datagroup and reset the x,y, and z domains
function processDatagroup(dataGroup, data) {
    var conditions;    
    dataGroup.columns = data.columns
    conditions = dataGroup.columns.slice(3).map(function(id) {                
                 return {
                  id: id,
                  values: dataGroup.map(function(d) {                
                    return {year: d.year, percentage: d[id]};
                  }),
                  display: drugMap[id].display === true  
                }; 
            });
    
    x.domain(d3.extent(dataGroup, function(d) { return d.year; }));
    
    y.domain([
        d3.min(conditions, function(c) { return d3.min(c.values, function(d) { return d.percentage; }); }),
        d3.max(conditions, function(c) { return d3.max(c.values, function(d) { return d.percentage; }); })
    ]);
    
    z.domain(conditions.map(function(c) { return c.id;  }));
    
    return conditions;
}//end processDatagroup()



function drawData(dataGroup, data) {
    conditions = processDatagroup(dataGroup, data);    
    drawGridLines();
    drawAxis();
    drawLines(conditions);
    drawCheckboxes(conditions);  
    drawMouseover(conditions);
}



//clears the canvas and draws the new dataset
function redrawChart(newDataset, data) {
    var children = g.selectAll("g").remove();
    
    d3.select(".svg").selectAll("svg").remove();
    g =  d3.select(".svg").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    
    
    drawData(newDataset[0].values, data);
}




var groupMenu, genderMenu;
var currentGender = "male",
    currentGroup = "under 18";



//extract columns of data for specified group and display
function processData() {
    d3.csv("data.csv", parseData, function(error, data) {
        if (error) throw error;
        
        
        //nest the data first by the gender then the age group
        var groupedData = d3.nest()
                            .key(function(d){
                                return d.gender;
                            })
                            .key(function(d){
                                return d.group;
                            })
                            .entries(data);
        var test = "high blood pressure";
        console.log(test.split(' ').join('_'));
        
        //draw the initial dataset     
        var dataGroup = groupedData[0].values[0].values;     
        drawData(dataGroup, data);
        
        
        //add the gender menu 
        genderMenu = d3.select("#genderMenu");
        
        genderMenu.selectAll("option")
                  .data(groupedData)
                  .enter()
                  .append("option")
                  .attr("value", function(d){
                      return d.key;
                  })
                  .text(function(d){
                      return d.key;
                  })    
        
        //adding the group menu
        groupMenu = d3.select("#groupMenu");

        groupMenu.selectAll("option")
                 .data(ageGroups)
                 .enter()
                 .append("option")
                 .attr("value", function(d){
                     return d.key;
                 })
                 .text(function(d){
                     return d.key;
                 })  
        
        
        //redraw the chart when gender or age group changes
        genderMenu.on('change', function() {   
             var selectedGender = d3.select(this)
                                    .property("value");
             currentGender = selectedGender;
             
             var newDataset  = getDataset(groupedData, currentGender, currentGroup);
             
             redrawChart(newDataset, data);
        });
        
        
        groupMenu.on('change', function() {  
             
             var selectedGroup = d3.select(this)
                                   .property("value");
             currentGroup = selectedGroup;
             
             var newDataset = getDataset(groupedData, currentGender, currentGroup);
             redrawChart(newDataset, data);             
        });
        
    });
}


//extract the dataset from the nested data for a given gender and age group
function getDataset(groupedData, currentGender, currentGroup) {    
    var genderData = groupedData.filter(function(d) {
        return d.key == currentGender;
    })
    
    return genderData[0].values.filter(function(d) {
        return d.key == currentGroup;
    })              
}


processData();
