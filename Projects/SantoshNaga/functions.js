function fillMap(selection, color, data) {

  // TODO: minor fix, sometimes d gets a -99, why?
  selection
    .attr("fill", function(d) { return typeof data[d.id] === 'undefined' ? color_na :
                                              d3.rgb(color(data[d.id])); });
}

function setPathTitle(selection, data) {
    selection
    .text(function(d) { return "" + d.id + ", " +
                               (typeof data[d.id] === 'undefined' ? 'N/A' : data[d.id]); });
}

function updateMap(color, data) {

  // fill paths
  d3.selectAll("svg#map path").transition()
    .delay(100)
    .call(fillMap, color, data);

  // update path titles
  d3.selectAll("svg#map path title")
    .call(setPathTitle, data);

  // update headline
  //d3.select("h2").text(d3.select("#year").node().value);
  
}

function renderLegend(color, data) {

  let svg_height = +d3.select("svg#map").attr("height");
  let legend_items = pairQuantiles(color.domain());

  let legend = d3.select("svg#map g.legend").selectAll("rect")
               .data(color.range());

  legend.exit().remove();

  legend.enter()
          .append("rect")
        .merge(legend)
          .attr("width", "20")
          .attr("height", "20")
          .attr("y", function(d, i) { return (svg_height-340) - 25*i; })
          .attr("x", 150)
          .attr("fill", function(d, i) { return d3.rgb(d); })
          .on("mouseover", function(d) { legendMouseOver(d, color, data); })
          .on("mouseout", function() { legendMouseOut(color, data); });

  let text = d3.select("svg#map g.legend").selectAll("text");

  text.data(legend_items)
    .enter().append("text").merge(text)
      .attr("y", function(d, i) { return (svg_height-325) - 25*i; })
      .attr("x", 180)
      .text(function(d, i) { return d; });

  d3.select("svg#map g.legend_title text")
       .text("Legend (ug/m3)")
       .attr("x", 150)
       .attr("y", 25);

  d3.select("svg#map g.legend_body6 text")
       .text("Hazardous")
       .attr("x", 250)
       .attr("y", 65);

  d3.select("svg#map g.legend_body5 text")
        .text("Very unhealthy")
        .attr("x", 250)
        .attr("y", 90); 

  d3.select("svg#map g.legend_body4 text")
        .text("Unhealthy")
        .attr("x", 250)
        .attr("y", 115);

  d3.select("svg#map g.legend_body3 text")
        .text("Unhealthy for sensitive groups")
        .attr("x", 250)
        .attr("y", 141);

  d3.select("svg#map g.legend_body2 text")
        .text("Moderate")
        .attr("x", 250)
        .attr("y", 166); 

  d3.select("svg#map g.legend_body1 text")
        .text("Good")
        .attr("x", 250)
        .attr("y", 191);

  d3.select("svg#map g.legend_body7 text")
        .text("Not available")
        .attr("x", 250)
        .attr("y", 216);
        
}

function renderBars(color, data) {

  // turn data into array of objects
  array = [];
  for( let key of Object.keys(data)) {
    array.push({'id':key, 'value': data[key]})
  }

  // sort by country id
  array = sortArrObj(array, 'id');

  x.domain(array.map(function(d) {return d.id;}));
  y.domain([0, d3.max(Object.values(data), function(d) {return d;})]);

  d3.select("svg#bars g.axis").remove();
  let axis = d3.select("svg#bars").append("g")
              .attr("class", "axis axis--x")
              .attr("transform", "translate("+ 30 +"," + 100 + ")")
              .call(d3.axisBottom(x))
                .selectAll("text")
                  .style("text-anchor", "end")
                  .attr("dx", "-.8em")
                  .attr("dy", ".15em")
                  .attr("transform", "rotate(-65)");

  let bars = d3.select("svg#bars g.bars").selectAll("rect").data(array);
  bars.exit().remove();
  bars.enter().append("rect")
        .merge(bars)
        .attr("fill", function(d) { return color(d.value); })
        .attr("x", function(d) { return x(d.id); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) {return svgBarsHeight - y(d.value); });

  let annot = d3.select("svg#bars g.bars").selectAll("text").data(array);
  annot.exit().remove();
  annot.enter().append("text")
        .merge(annot)
        .text(function(d) {return d3.format(",")(d.value);})
        .attr("class", "barlabel")
        .attr("x", function(d) { return x(d.id) + x.bandwidth()/2; })
        .attr("y", function(d) { return y(d.value) - 5; });
}

function calcColorScale(data) {

  // TODO: minor, check how many data poins we've got
  // with few datapoints the resulting legend gets confusing

  // get values and sort

  let colorSet = ["#b8b8b8","#12e741","#d8f015","#ec9d09","#df0404","#9200c5","#6b0000"];
  let colorSet2 =["#f7fbff","#deebf7","#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#08519c","#08306b"];

  let scale = d3.scaleQuantile()
    .domain([0, 1, 55, 155, 255, 355, 425, 800])
    .range(colorSet);

    /*
  let data_values = Object.values(data).sort( function(a, b){ return a-b; });

  quantiles_calc = quantiles.map( function(elem) {
                  return Math.ceil(d3.quantile(data_values, elem));
  });

  let scale = d3.scaleQuantile()
              .domain(quantiles_calc)
              .range(d3.schemeGnYlRd[(quantiles_calc.length)-1]);
  */

  return scale;
}

/// event handlers /////

function legendMouseOver(color_key, color, data) {

  // cancels ongoing transitions (e.g., for quick mouseovers)
  d3.selectAll("svg#map path").interrupt();

  // TODO: improve, only colored paths need to be filled

  // then we also need to refill the map
  d3.selectAll("svg#map path")
    .call(fillMap, color, data);

  // and fade all other regions
  d3.selectAll("svg#map path:not([fill = '"+ d3.rgb(color_key) +"'])")
      .attr("fill", color_na);
}

function legendMouseOut(color, data) {

  // TODO: minor, only 'colored' paths need to be refilled
  // refill entire map
  d3.selectAll("svg#map path").transition()
    .delay(100)
    .call(fillMap, color, data);
}

/// helper functions /////

// sorts an array of equally structured objects by a key
// only works if sortkey contains unique values
// TODO: minor, shorten
function sortArrObj(arr,sortkey) {

  sorted_keys = arr.map( function(elem) {return elem[sortkey];}).sort();

  newarr = [];
  for(let key of sorted_keys){
    for(i in arr){
      if(arr[i][sortkey] === key){
        newarr.push(arr[i]);
        continue;
      }
    }
  }

  return newarr;
}

// pairs neighboring elements in array of quantile bins
function pairQuantiles(arr) {

  new_arr = [];
  for (let i=0; i<arr.length-1; i++) {

    // allow for closed intervals (depends on d3.scaleQuantile)
    // assumes that neighboring elements are equal
    if(i == arr.length-2) {
      new_arr.push([arr[i],  arr[i+1]]);
    }
    else {
      new_arr.push([arr[i], arr[i+1]-1]);
    }
  }

  new_arr = new_arr.map(function(elem) { return elem[0] === elem[1] ?
    d3.format(",")(elem[0]) :
    d3.format(",")(elem[0]) + " - " + d3.format(",")(elem[1]);
  });

  return new_arr;
}
