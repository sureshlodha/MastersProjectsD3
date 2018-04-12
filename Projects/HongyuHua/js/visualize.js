var zoom = d3.zoom()
.scaleExtent([1, 8])
.on("zoom", zoomed);

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    r = 15;

var g = svg.append("g");
svg.call(zoom);


var div = d3.select("body").append("div")
.attr("class", "tooltip")
.style("opacity", 0);

var simulation = d3.forceSimulation()
    .force("charge", d3.forceManyBody().strength(-400))
    .force("link", d3.forceLink().id(function(d) { return d.name; }).distance(100))
    .force("x", d3.forceX(width / 2))
    .force("y", d3.forceY(height / 2))
    .force("collide", d3.forceCollide(r + 5))
    .force("center", d3.forceCenter());


function zoomed() {
  g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
  g.attr("transform", d3.event.transform); // updated for d3 v4
}

var readFile = "Data/FirstDegree.csv";

visualizeData(readFile);

var btn_linkedin = document.getElementById('linkedin');
btn_linkedin.onclick=function(){
    readFile = "Data/LinkedIn.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "LinkedIn");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_amazon = document.getElementById('amazon');
btn_amazon.onclick=function(){
    readFile = "Data/Amazon.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "Amazon");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_facebook = document.getElementById('facebook');
btn_facebook.onclick=function(){
    readFile = "Data/Facebook.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "Facebook");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_ebay = document.getElementById('ebay');
btn_ebay.onclick=function(){
    readFile = "Data/eBay.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "eBay");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_walmart = document.getElementById('walmart');
btn_walmart.onclick=function(){
    readFile = "Data/Walmart.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "Walmart");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_microsoft = document.getElementById('microsoft');
btn_microsoft.onclick=function(){
    readFile = "Data/Microsoft.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "Microsoft");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_uber = document.getElementById('uber');
btn_uber.onclick=function(){
    readFile = "Data/Uber.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "Uber");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_airbnb = document.getElementById('airbnb');
btn_airbnb.onclick=function(){
    readFile = "Data/Airbnb.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "Airbnb");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_apple = document.getElementById('apple');
btn_apple.onclick=function(){
    readFile = "Data/Apple.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "Apple");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_netflix = document.getElementById('netflix');
btn_netflix.onclick=function(){
    readFile = "Data/Netflix.csv";
    g.selectAll("*").remove();
    visualizeData(readFile, "Netflix");
    simulation.alphaTarget(0.1);
    simulation.restart();

};

var btn_default = document.getElementById('default-btn');
btn_default.onclick=function(){
    readFile = "Data/FirstDegree.csv";
    g.selectAll("*").remove();
    visualizeData(readFile);
    simulation.alphaTarget(0.1);
    simulation.restart();
}


var btn_search = document.getElementById('search-btn');
btn_search.onclick=function(){
    g.selectAll("*").remove();
    var targetCompany = document.getElementById('search-input').value;
    findTargetCompany(targetCompany);
    simulation.alphaTarget(0.1);
    simulation.restart();
};

function findTargetCompany(targetCompany){
    d3.csv("Data/FullData.csv", function(error, csvdata){
        var nodesNetflix = [];
        var linksNetflix = [];
        var linkedByName = {};
        const nameSet = new Set();
        if(error){
            console.log(error)
        }
        
        for(var i = 0; i<csvdata.length; i++){
            if(csvdata[i].Company == targetCompany){
                var targetNode = new Object();
                targetNode.name = csvdata[i].Name;
                targetNode.url = csvdata[i].ImageURL;
                targetNode.company = csvdata[i].Company;
                nodesNetflix.push(targetNode);
                var targetLink = new Object();
                targetLink.source = csvdata[i].RelatedConnectionName;
                targetLink.target = csvdata[i].Name;
                linksNetflix.push(targetLink);
                linkedByName[targetLink.source + "," + targetLink.target] = true;
                nameSet.add(csvdata[i].RelatedConnectionName);
            }
        }
        
        for(var i = 0; i<csvdata.length; i++){
            if(!nameSet.has(csvdata[i].Name)){
                continue;
            }
            var relatedNode = new Object();
            relatedNode.name = csvdata[i].Name;
            relatedNode.url = csvdata[i].ImageURL;
            relatedNode.company = csvdata[i].Company;
            nodesNetflix.push(relatedNode);
            var relatedLink = new Object();
            relatedLink.source = csvdata[i].RelatedConnectionName;
            relatedLink.target = csvdata[i].Name;
            linksNetflix.push(relatedLink);
            linkedByName[relatedLink.source + "," + relatedLink.target] = true;
            nameSet.delete(csvdata[i].Name);
        }
        
        var centerNode = new Object();
        centerNode.name = "Hongyu Hua";
        centerNode.url = "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAoYAAAAJDA3YjJlZjE2LTQ2ODAtNDRjZi1hMzhiLTUwZGE0YmUyNDMyYg.jpg";
        centerNode.company = "eBay";
        nodesNetflix.push(centerNode);
        
        console.log(nodesNetflix);

        simulation.stop();
        simulation.nodes(nodesNetflix);
        simulation.force("link").links(linksNetflix);
        simulation.restart();

        var link = g.selectAll(".link")
            .data(linksNetflix)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width",nominal_stroke)
            .style("stroke", default_link_color);

        var node = g.selectAll(".node")
            .data(nodesNetflix)
            .enter().append("g")
            .attr("class", "node")

        var circle = node.append("circle")
            .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
            .style("fill", "#eee")
            .call(d3.drag()
                 .on("start",dragstarted)
                 .on("drag",dragged)
                 .on("end",dragended));


        var images = node.append("svg:image")
              .attr("xlink:href", function(d){return d.url})
              .attr("x", -10)
              .attr("y", -10)
              .attr("width", 30)
              .attr("height", 30)
              .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));



        function dragstarted() {
          if (!d3.event.active) simulation.alphaTarget(0.1).restart();
//            tick();
          d3.event.subject.fx = d3.event.subject.x;
          d3.event.subject.fy = d3.event.subject.y;
        }

        function dragged() {
          d3.event.subject.fx = d3.event.x;
          d3.event.subject.fy = d3.event.y;
        }

        function dragended() {
//          if (!d3.event.active) simulation.alphaTarget(0);
//          d3.event.subject.fx = null;
//          d3.event.subject.fy = null;
            d3.event.subject.fx = d3.event.x;
        }


      node.append("text")
      .attr("dx", 21)
      .attr("dy", "0.5em")
      .attr("font-size", 12)
      .text(function(d){
          if(d.company == targetCompany){
              return d.company;
          }
      });

        function isConnected(a, b) {
            return linkedByName[a.name + "," + b.name] || linkedByName[b.name + "," + a.name] || a.name == b.name;
        }

        var highlight_color = "red";
        var default_link_color = "#888";
        var focus_node = null;
        var highlight_node = null;
        var towhite = "stroke";
        var nominal_stroke = 1.5;

        function set_highlight(d){
            svg.style("cursor","pointer");
            if (focus_node!==null) d = focus_node;
            highlight_node = d;

            if (highlight_color!="white")
            {
//                circle.style(towhite, function(o) {
//                return isConnected(d, o) ? highlight_color : "white";});
                    link.style("stroke", function(o) {
                        //why this would happen?
                      return o.source.index == d.index || o.target.index == d.index ? highlight_color : default_link_color;
                    });
            }
        }

        var mouseEvent = node.on('mouseover', function(d){
            set_highlight(d);
        });



      var mouseEvent = images.on('mouseover', function(d) {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -60;})
              .attr("y", function(d) { return -60;})
              .attr("height", 100)
              .attr("width", 100);

            div.transition()
                .duration(200)
                .style("opacity", .9)
            div.html("Name: " + d.name + "<br/>" + "<br/>" + "Company: " + d.company)
                .style("left", (d3.event.pageX + 50) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
          })
          // set back
          .on( 'mouseout', function() {
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -10;})
              .attr("y", function(d) { return -10;})
              .attr("height", 30)
              .attr("width", 30);

            div.transition()
               .duration(500)
               .style("opacity", 0);
          });

        function tick() {
            link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        }


        simulation.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    });
});
}
    


function visualizeData(readFile, companyName){
    d3.csv(readFile, function(error, csvdata){
        var nodesNetflix = [];
        var linksNextflix = [];
        var linkedByName = {};
        if(error){
            console.log(error)
        }


        for(var i = 0; i<csvdata.length; i++){
            var littleNode = new Object();
            littleNode.name = csvdata[i].Name;
            littleNode.url = csvdata[i].ImageURL;
            littleNode.company = csvdata[i].Company;
            nodesNetflix[i] = littleNode;
            var littleLink = new Object();
            littleLink.source = csvdata[i].RelatedConnectionName;
            littleLink.target = csvdata[i].Name;
            linksNextflix[i] = littleLink;
            linkedByName[littleLink.source + "," + littleLink.target] = true;
        }

        var centerNode = new Object();
        centerNode.name = "Hongyu Hua";
        centerNode.url = "https://media.licdn.com/mpr/mpr/shrinknp_400_400/AAEAAQAAAAAAAAoYAAAAJDA3YjJlZjE2LTQ2ODAtNDRjZi1hMzhiLTUwZGE0YmUyNDMyYg.jpg";
        centerNode.company = "eBay";
        nodesNetflix.push(centerNode);

//        console.log(nodesNetflix);

        simulation.nodes(nodesNetflix);
        simulation.force("link").links(linksNextflix);

        var link = g.selectAll(".link")
            .data(linksNextflix)
            .enter().append("line")
            .attr("class", "link")
            .style("stroke-width",nominal_stroke)
            .style("stroke", default_link_color);

        var node = g.selectAll(".node")
            .data(nodesNetflix)
            .enter().append("g")
            .attr("class", "node")

        var circle = node.append("circle")
            .attr("r", function(d) { return Math.sqrt(d.size) / 10 || 4.5; })
            .style("fill", "#eee")
            .call(d3.drag()
                 .on("start",dragstarted)
                 .on("drag",dragged)
                 .on("end",dragended));


        var images = node.append("svg:image")
              .attr("xlink:href", function(d){return d.url})
              .attr("x", -10)
              .attr("y", -10)
              .attr("width", 30)
              .attr("height", 30)
              .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));



        function dragstarted() {
          if (!d3.event.active) simulation.alphaTarget(0.1).restart();
//            tick();
          d3.event.subject.fx = d3.event.subject.x;
          d3.event.subject.fy = d3.event.subject.y;
        }

        function dragged() {
          d3.event.subject.fx = d3.event.x;
          d3.event.subject.fy = d3.event.y;
        }

        function dragended() {
//          if (!d3.event.active) simulation.alphaTarget(0);
//          d3.event.subject.fx = null;
//          d3.event.subject.fy = null;
            d3.event.subject.fx = d3.event.x;
        }


      node.append("text")
      .attr("dx", 21)
      .attr("dy", "0.5em")
      .attr("font-size", 12)
      .text(function(d){
          if(companyName == "Walmart" && (d.company == "Walmart Labs" || d.company == "Walmart eCommerce")){
              return d.company;
          }
          if(d.company == companyName){
              return d.company;
          }
      });

        function isConnected(a, b) {
            return linkedByName[a.name + "," + b.name] || linkedByName[b.name + "," + a.name] || a.name == b.name;
        }

        var highlight_color = "red";
        var default_link_color = "#888";
        var focus_node = null;
        var highlight_node = null;
        var towhite = "stroke";
        var nominal_stroke = 1.5;

        function set_highlight(d){
            svg.style("cursor","pointer");
            if (focus_node!==null) d = focus_node;
            highlight_node = d;

            if (highlight_color!="white")
            {
//                circle.style(towhite, function(o) {
//                return isConnected(d, o) ? highlight_color : "white";});
                    link.style("stroke", function(o) {
                        //why this would happen?
                      return o.source.index == d.index || o.target.index == d.index ? highlight_color : default_link_color;
                    });
            }
        }

        var mouseEvent = node.on('mouseover', function(d){
            set_highlight(d);
        });



      var mouseEvent = images.on('mouseover', function(d) {
            // select element in current context
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -60;})
              .attr("y", function(d) { return -60;})
              .attr("height", 100)
              .attr("width", 100);

            div.transition()
                .duration(200)
                .style("opacity", .9)
            div.html("Name: " + d.name + "<br/>" + "<br/>" + "Company: " + d.company)
                .style("left", (d3.event.pageX + 50) + "px")
                .style("top", (d3.event.pageY - 50) + "px");
          })
          // set back
          .on( 'mouseout', function() {
            d3.select( this )
              .transition()
              .attr("x", function(d) { return -10;})
              .attr("y", function(d) { return -10;})
              .attr("height", 30)
              .attr("width", 30);

            div.transition()
               .duration(500)
               .style("opacity", 0);
          });

        function tick() {
            link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

            node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

        }


        simulation.on("tick", function() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

    });
});
}
