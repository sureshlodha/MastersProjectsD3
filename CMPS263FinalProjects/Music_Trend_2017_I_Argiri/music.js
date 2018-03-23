var h = 650,
    w = 960;
    

    


// set-up unit projection and path
var projection = d3.geoMercator()
    .scale(1)
    .translate([0, 0]);
    
var div = d3.select("#map")     //on mouse over country data
    .append("div")
    .attr("class","map")
    .style("opacity",0)
    .style("color","white")
    .style("text-shadow", "2px 2px 5px black")
    .style("text-align","center")
    .style("background", "#00468C")
    .style("position","absolute")
    .style("top","125px")
    .style("left","70%")
    .style("display","inline-block")
    .style("width", "400px")
    .style("height","170px")
    .style("padding","2px")
    .style("font", "24px sans-serif")
    .style("border","2px")
    .style("border-radius","8px")
    //.style("box-shadow"," 0px 0px 0px 0px #0ff")
    .style("pointer-events","none")
    ;

var div2 = d3.select('#slider')   //United States data
            .append("div2")
            .attr("class","slider")
            .style("color","white")
            .style("text-shadow", "2px 2px 5px black")
            .style("text-align","center")
            .style("opacity",0)
            .style("background", "#ff9999")
            .style("position","absolute")
            .style("top","510px")
            .style("left","70%")
            .style("display","inline-block")
            .style("width", "400px")
            .style("height","270px")
            .style("padding","2px")
            .style("font", "16px sans-serif")
            .style("border","2px")
            .style("border-radius","8px")
            .style("pointer-events","none")
            ;

var div3 = d3.select('#tooltip')    //On click region Data
            .append("div3")
            .attr("class","tooltip")
            .style("color","white")
            .style("text-shadow", "2px 2px 5px black")
            .style("text-align","center")
            .style("opacity",0)
            .style("background", "#668cff")
            .style("position","absolute")
            .style("top","315px")
            .style("left","70%")
            .style("display","inline-block")
            .style("width", "400px")
            .style("height","170px")
            .style("padding","2px")
            .style("font", "16px sans-serif")
            .style("border","2px")
            .style("border-radius","8px")
            .style("pointer-events","none")
            ;

var div4 = d3.select('#tooltip')    //On click USA Data
            .append("div4")
            .attr("class","tooltip")
            .style("color","white")
            .style("text-shadow", "2px 2px 5px black")
            .style("text-align","center")
            .style("opacity",0)
            .style("position","absolute")
            .style("top","315px")
            .style("left","70%")
            .style("display","inline-block")
            .style("width", "400px")
            .style("height","170px")
            .style("padding","2px")
            .style("font", "30px sans-serif")
            .style("border","2px")
            .style("border-radius","8px")
            .style("pointer-events","none")
            ;

    
    
    
    
    

var path = d3.geoPath()
    .projection(projection);

// set-up svg canvas
var svg = d3.select("#map")
    .append("svg")
    .attr("height", h+50)
    .attr("width", w);
    

 
var arr = [];
var curMon = 0;
var curData = [];
var top = " ";
var country = " ";
var Country;
var region;
var Track;
var Artist; 
var temp;
var Streams;
var artist1,artist2,artist3,artist4,artist5,track1,track2,track3,track4,track5,stream1,stream2,stream3,stream4,stream5;


//console.log(Color);
console.log(region);


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
   // console.log(arr);
    

    //https://github.com/johan/world.geo.json
    d3.json("countries.geo.json", function(error, data) {

        d3.csv("idCountry.csv", function(error, csv) {

            var world = data.features;
            

            csv.forEach(function(d, i) {
                world.forEach(function(e, j) {
                    if (d.id === e.id) {
                        e.name = d.name
                    }
                })
            })

            // calculate bounds, scale and transform 
            // see http://stackoverflow.com/questions/14492284/center-a-map-in-d3-given-a-geojson-object
            var b = path.bounds(data),
                s = .95 / Math.max((b[1][0] - b[0][0]) / w, (b[1][1] - b[0][1]) / h),
                t = [(w - s * (b[1][0] + b[0][0])) / 2, (h - s * (b[1][1] + b[0][1])) / 2];
            
            
            
            projection.scale(s)
                .translate(t);
            
            
            
            
            svg.selectAll("path")
                .data(world)
                .enter()
                .append("path")
                .style("fill", function(d){
                if (d.id == "USA"){
                    
                   
                   //console.log(months); 
                   return "#ff9999";
                }else{
                    return "#909090";
                }
            })
                .style("stroke", "black")
                .style("stroke-width", "2px")
                .attr("d", path)
               // .attr("cx", function(d){return (d.geometry.coordinates[0][0][0][0]);})
            
            //    .attr("cy", function(d){return (d.geometry.coordinates[0][0][0][1]);})
                .on("mouseover", function(d) {
                
                if (d.id == "BRA" || d.id == "USA" || d.id == "SLV" || d.id == "HUN" || d.id == "MYS" || d.id == "IRL" || d.id == "DEU" || d.id == "LUX" || d.id == "PHL" || d.id == "PRY" || d.id == "PER" || d.id == "NOR" || d.id == "LTU" || d.id == "GTM" || d.id == "FIN" || d.id == "MEX" || d.id == "NZL" || d.id == "PAN" || d.id == "POL" || d.id == "CHE" || d.id == "ISL" || d.id == "PRT" || d.id == "DNK" || d.id == "URY" || d.id == "CAN" || d.id == "COL" || d.id == "ESP" || d.id == "SWE" || d.id == "ITA" || d.id == "AUS" || d.id == "CRI" || d.id == "EST" || d.id == "LVA" || d.id == "TWN" || d.id == "AUT" || d.id == "JPN" || d.id == "TUR" || d.id == "CZE" || d.id == "FRA" || d.id == "GBR" || d.id == "ARG" || d.id == "DOM" || d.id == "CHL" || d.id == "BEL" || d.id == "BOL" || d.id == "HND" || d.id == "NLD" || d.id == "SVK" || d.id == "GRC"  || d.id == "IDN" || d.id == "ECU"){
                    d3.select(this).style("fill","#00468C");
                    reporter(d);
                //console.log(d.id)
                   // console.log(Artist)
                    //console.log(Country)
                    //console.log(Track)
                    div.transition()
                         .duration(200)
                         .style("opacity", .9);    
                    div.html("Top Artist in " + Country + "</br>"+"</br>"+  Artist +"</br>" + "Track: "+Track +"</br>" +"Daily Streams: " + Streams)  
                        .style("left", (d3.select(this).attr("cx")) + "px")
                        .style("top", (d3.select(this).attr("cy"))  + "px")
                        .style("display", "inline-block");
                    
                }
                
                
                       })
            
                    .on("mouseout", function(a) {
                    d3.selectAll('path').style('fill',function(d){
                        if (d.id == "USA"){
                            return "#ff9999";
                            
                        }
                        else{
                            return "#909090";
                        }
                    });
                       div.transition()
                         .duration(1000)
                         .style("opacity", 0);
                    div3.transition()
                        .duration(1000)
                        .style("opacity",0);
                    div4.transition()
                        .duration(1500)
                        .style("opacity",0);
                       })
            
            
                .on("click", function(d){
                if (d.id == "BRA" || d.id == "SLV" || d.id == "HUN" || d.id == "MYS" || d.id == "IRL" || d.id == "DEU" || d.id == "LUX" || d.id == "PHL" || d.id == "PRY" || d.id == "PER" || d.id == "NOR" || d.id == "LTU" || d.id == "GTM" || d.id == "FIN" || d.id == "MEX" || d.id == "NZL" || d.id == "PAN" || d.id == "POL" || d.id == "CHE" || d.id == "ISL" || d.id == "PRT" || d.id == "DNK" || d.id == "URY" || d.id == "CAN" || d.id == "COL" || d.id == "ESP" || d.id == "SWE" || d.id == "ITA" || d.id == "AUS" || d.id == "CRI" || d.id == "EST" || d.id == "LVA" || d.id == "TWN" || d.id == "AUT" || d.id == "JPN" || d.id == "TUR" || d.id == "CZE" || d.id == "FRA" || d.id == "GBR" || d.id == "ARG" || d.id == "DOM" || d.id == "CHL" || d.id == "BEL" || d.id == "BOL" || d.id == "HND" || d.id == "NLD" || d.id == "SVK" || d.id == "GRC"  || d.id == "IDN" || d.id == "ECU"){
                    
                    d3.select(this).style("fill","#668cff");
                    clicked(d);
                    div3.transition()
                         .duration(100)
                         .style("opacity", .9);
                    div3.html("Other Top Artists in "+region + "</br>" + "</br>" + "Rank 2: " + artist2 + "</br>" + "Track: "  +track2 + "</br>" + "Streams: " + stream2 + "</br>"+"</br>" + "Rank 3: " + artist3 + "</br>" + "Track: "  +track3 + "</br>" + "Streams: " + stream3)
                        .style("left", (d3.select(this).attr("cx")) + "px")
                        .style("top", (d3.select(this).attr("cy"))  + "px")
                        .style("display","inline-block");
                    
                }
                else if (d.id == "USA"){
                    clicked(d);
                    var trend = {'Migos':'#80e5ff','Ed Sheeran':'#ff99ff','Kendrick Lamar':'#6666ff','Luis Fonsi':'#ff99ff','French Montana':'#ff80bf','Taylor Swift':'#ff99ff','Post Malone':'#4d4dff'}
                                 
                    var genre = {'Migos':'HIP-HOP / TRAP','Ed Sheeran':'POP','Kendrick Lamar':'HIP-HOP / RAP','Luis Fonsi':'POP','French Montana':'REGGAETON / LATIN POP','Taylor Swift':'POP','Post Malone':'RAP ROCK / R&B'}     
                    d3.select(this).style("fill",function(d){
                        
                        return trend[artist1];
                        
                    });
                    
                    div4.transition()
                         .duration(100)
                         .style("opacity", .9);
                    div4.html("</br>" + "GENRE OF THE MONTH " + "</br>" + "</br>" + genre[artist1])
                        .style("left", (d3.select(this).attr("cx")) + "px")
                        .style("top", (d3.select(this).attr("cy"))  + "px")
                        .style("display","inline-block")
                        .style("background", trend[artist1]);
                     
                }
            });
            
                
                
        })

        
        function reporter(x) {
            //console.log(x)
             //d3.select("#report").text(function() {
                country = x.name;
                 
                // console.log(x.name)
                for (i=0; i < curData.length; i=i+10){
                    if (country == curData[i].ADMIN) {
                        
                        //console.log(curData[i].Artist);
                        Artist = curData[i].Artist;
                        Country = curData[i].ADMIN;
                        Track = curData[i].Track;
                        Streams = curData[i].Streams;
                        //console.log(Artist); 
                        return Artist;
                        return Country;
                        return Track;
                        return Streams;
                        
                                              
                    }
                    
                    
                    
                    
                
                
                }
                
                
               
            }
        
        function clicked(x){
            country = x.name;
            for(i = 0 ; i < curData.length; i = i + 10){
                if (country == curData[i].ADMIN){
                    artist1 = curData[i].Artist;
                    artist2 = curData[i+1].Artist;
                    artist3 = curData[i+2].Artist;
                    artist4 = curData[i+3].Artist;
                    artist5 = curData[i+4].Artist;
                    
                    track1 = curData[i].Track;
                    track2 = curData[i+1].Track;
                    track3 = curData[i+2].Track;
                    track4 = curData[i+3].Track;
                    track5 = curData[i+4].Track;
                    
                    stream1 = curData[i].Streams;
                    stream2 = curData[i+1].Streams;
                    stream3 = curData[i+2].Streams;
                    stream4 = curData[i+3].Streams;
                    stream5 = curData[i+4].Streams;
                    
                    

                    
                    region = country;
                    //console.log(region);
                    return region;
                    
                    return artist1;
                    return artist2;
                    return artist3;
                    return artist4;
                    return artist5;
                    
                    return track1;
                    return track2;
                    return track3;
                    return track4;
                    return track5;
                    
                    return stream1;
                    return stream2;
                    return stream3;
                    return stream4;
                    return stream5;
                    
                    
                }
            }
        }
        

        //}
       // return document.getElementById('report').value;
        
    })
    
    

    var formatDateIntoYear = d3.timeFormat("%Y");
    var formatDateIntoMonth = d3.timeFormat("%m");
    var formatDate = d3.timeFormat("%b %Y");

    var startDate = new Date("2017-01-02"),
        endDate = new Date("2017-12-31");

    var margin = {right: 50, left: 50};

    var x = d3.scaleTime()
        .domain([startDate, endDate])
        .range([0, w-100])
        .clamp(true);

    var slider = svg.append("g")
        .attr("class", "slider")
        .attr("transform", "translate(" + margin.left + "," + h + ")");

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
            .on("start drag", function() { chMon(x.invert(d3.event.x));
                                          div2.transition()
                                           // .duration(200)
                                            .style("opacity", .9);
                                        var art1 = arr[temp][120].Artist;
                                          var reg1 = arr[temp][120].ADMIN;
                                          var track1 = arr[temp][120].Track;
                                          var stream1 = arr[temp][120].Streams;
                                          
                                          var art2 = arr[temp][121].Artist;
                                          var reg2 = arr[temp][121].ADMIN;
                                          var track2 = arr[temp][121].Track;
                                          var stream2 = arr[temp][121].Streams;
                                          
                                          var art3 = arr[temp][122].Artist;
                                          var reg3 = arr[temp][122].ADMIN;
                                          var track3 = arr[temp][122].Track;
                                          var stream3 = arr[temp][122].Streams;
                                          
                                          var art4 = arr[temp][123].Artist;
                                          var reg4 = arr[temp][123].ADMIN;
                                          var track4 = arr[temp][123].Track;
                                          var stream4 = arr[temp][123].Streams;
                                          
                                          var art5 = arr[temp][124].Artist;
                                          var reg5 = arr[temp][124].ADMIN;
                                          var track5 = arr[temp][124].Track;
                                          var stream5 = arr[temp][124].Streams;
                                          
                                          var months = ["January","February","March","April","May","June","July","August","September","October","November","December"]  
                                          var indices = (+curMon -1);   
                                         // console.log(months[temp]);
                                         div2.html("Top 3 Artists in the United States in "+ months[indices]+ " 2017" + "</br>" + "</br>" + "Top Artist: " + art1 +  "</br>" + "Top Track:  " + track1 + "</br>" +"Daily Streams: "+ stream1 + "</br>" + "</br>" +
                                                  "Rank2: " +art2 + "</br>" + "Track: " + track2 + "</br>" +"Daily Streams: " + stream2 + "</br>" + "</br>"+
                                                  "Rank3: " +art3 + "</br>" + "Track: " + track3 + "</br>" +"Daily Streams: " + stream3 + "</br>" + "</br>")
                                            .style("left", (d3.select(this).attr("cx")) + "px")
                                            .style("top", (d3.select(this).attr("cy"))  + "px")
                                            .style("display","inline-block");
                                          
                                          //console.log(curMon);
                                          //console.log(temp);
                                         //Color = (Colors[temp]);
                                          //return Color;
                                          
                                          //console.log(region);
                                         
                                         //return Color;
                                         }
                
                                ));

    slider.insert("g", ".track-overlay")
        .attr("class", "ticks")
        .attr("transform", "translate(0," + 18 + ")")
      .selectAll("text")
      .data(x.ticks(10))
      .enter().append("text")
        .attr("x", x)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatDateIntoYear(d); });
    
    var label = slider.append("text")  
        .attr("class", "label")
        .attr("text-anchor", "middle")
        .text(formatDate(startDate))
        .attr("transform", "translate(0," + (-25) + ")")

    var handle = slider.insert("circle", ".track-overlay")
        .attr("class", "handle")
        .attr("r", 9);

    slider.transition() 
        .duration(500)
        .tween("chMon", function() {
          var i = d3.interpolate(0, 70);
            
          return function(t) { chMon(i(t)); };
            
        
        });

   function chMon(h) {
       
      handle.attr("cx", x(h));
      if (curMon != formatDateIntoMonth(h)) {
          curMon = formatDateIntoMonth(h);
          temp = +curMon - 1;
         // console.log(arr[temp]);
          curData = arr[temp];
        // console.log(temp)
          //return temp;
         //var Colors = ["red","black","green","red","red","blue","grey","red","red"];
         // Color = Colors[temp];
          //return Color;
          
            
          
          
      }
      label
        .attr("x", x(h))
        .text(formatDate(h));
        
       //console.log(temp)
       return temp;
       
       
       
   }
    
    
    
  
    
   
});