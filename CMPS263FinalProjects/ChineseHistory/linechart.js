

var svg = d3.select("svg"),
    margin = {top: 20, right: 520, bottom: 230, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
/**
var svg = d3.select("svg"),
    position 
    margin = {top: 20, right: 120, bottom: 30, left: 50},
    width = 1080 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(0,"+ height + ")");

var padding = 70;

**/


d3.csv("territory_dataWithBegining.csv", 
    function(d) {
  //  console.log(d3.schemeCategory20[parseInt(num)]);
    d.Year = +d.Year;
    d.close = +d.Area1;
    return d;
    }, 
    function(error, data) {
    if (error) throw error; 
    console.log(data);
    dropDownGenerator(data);
    
    // to be modified
	d3.select('#inds')
			.on("change", function () {    //. on() is knid of a listener waiting for user interaction defined in "type" and carries out the function upon triggering
				var sect = document.getElementById("inds");
				var selectedDynasty = sect.options[sect.selectedIndex].value;
				updateGraph(data,selectedDynasty);
                updateDynastyIntro(selectedDynasty);
			});

	// generate initial graph
	updateGraph(data,null);
    
    
    
  //updateGraph(data);
  //defining all the plotting message here
  }
); 
  
//====================== ALL self-defined functions go below ================================
//===========================================================================================    

function updateDynastyIntro(selectedDynasty){
    d3.selectAll(".dynastyIntro")
	.transition().duration(100)
    .style("opacity", 0);
    console.log("add txt triggered")
    dynastyText = d3.select("svg").append("text")
        .attr("y", 120)
        .attr("x", 1250)
        .style("text-anchor", "middle")
        .text(dynastyInfo(selectedDynasty))
        .attr("class","dynastyIntro");
}

//=========================Blarry's detailed modification goes here!!!!======================================
//@para selectedDynasty is a string of dynasty name
//should return the text format info
//===========================================================================================================
function dynastyInfo(selectedDynasty){
    if(selectedDynasty == "Qin"){
        d3.select("#annotation_1").text("The Qin Dynasty (221–206 BC) was the first and shortest imperial dynasty in China,famous for great building projects like the Great Wall and the Terracotta Army.");
    }
    else if(selectedDynasty == "Western Han"){
        d3.select("#annotation_1").text("The Western Han Dynasty (206BC - 24AD) was regarded as the first unified and powerful empire in Chinese history.");
    }
    else if(selectedDynasty == "Eastern Han"){
        d3.select("#annotation_1").text("Liu Xiu, a descendant of Western Han royalty defeated the usurper, thus establishing the Eastern Han(25 AD - 220 AD). ");
    }
    else if(selectedDynasty == "Three Kingdoms"){
        d3.select("#annotation_1").text("The Three Kingdoms period (220 AD - 265 AD) was a period in history when China was divided into three states. This period marks the start of a dark age full of war and misery.");
    }
    else if(selectedDynasty == "Western Jin"){
        d3.select("#annotation_1").text("Although the Western Jin(265 AD - 316 AD) unified the whole nation, it was still an unstable and decayed dynasty with little social development.");
    }
    else if(selectedDynasty == "Eastern Jin"){
        d3.select("#annotation_1").text("The Eastern Jin Dynasty(317 - 420) was established by the last of the Western Jin and governing a limited area lying to the South of Yangtze River.");
    }
    else if(selectedDynasty == "Northern & Southern Dynasty"){
        d3.select("#annotation_1").text("It was a period of war and chaos. From 420 to 589 AD, there were four successive Southern Dynasties, and five Northern Dynasties.");
    }
    else if(selectedDynasty == "Sui"){
        d3.select("#annotation_1").text("The Sui Dynasty(581 - 618 AD) lasted for only 38 years because of a tyrannical second emperor. However,it reunified  the whole country and ended the dark age, bringing peace to its people.");
    }
    else if(selectedDynasty == "Tang"){
        d3.select("#annotation_1").text("Tang Dynasty(618 - 907 AD) was the most glistening historic period in China's history. Many believe Tang was the most powerful and prosperous country in the world at that time.");
    }
    else if(selectedDynasty == "Five Dynasties & Ten Kingdoms"){
        d3.select("#annotation_1").text("After Zhu usurped the Tang Dynasty and founded his own, China again fell into civil war. There were a total of five dynasties and ten kingdoms during this period.");
    }
    else if(selectedDynasty == "Northern Song"){
        d3.select("#annotation_1").text(" Song era was a period of technological advances and prosperity. But it was just not strong enough to hold off its enemies. In 1127, the Jin army captured its capital and most members of the imperial family, ending Northern Song.");
    }
    else if(selectedDynasty == "Southern Song"){
        d3.select("#annotation_1").text(" The younger brother of the last Northern Song emperor, founded  the Southern Song Dynasty. However, due to continuous attacks by the Jin army, the newly-installed regime had to flee to southern region and it never extricated itself completely from the endless battles.");
    }
    else if(selectedDynasty == "Yuan"){
        d3.select("#annotation_1").text(" For the first time in its long history, China was completely subjugated by foreign conquerors, making Yuan Dynasty(1271 - 1368) the first foreign-led dynasty in China. ");
    }
    else if(selectedDynasty == "Ming"){
        d3.select("#annotation_1").text(" Ming Dynasty(1368 - 1644) was one of the most stable but also one of the most autocratic of all Chinese dynasties.");
    }
    else if(selectedDynasty == "Qing"){
        d3.select("#annotation_1").text("Population of China went from 60 million to 400 million under the ruling of Qing(1636 - 1912). However, the prosperity blinded its rulers, who refused to learn from western countries.");
    }
     else if(selectedDynasty == "Republic of China"){
        d3.select("#annotation_1").text("Republic of China(1912 - 1949) was founded in 1912, after the Qing dynasty, the last imperial dynasty, was overthrown in the Xinhai Revolution.");
    }
    else if(selectedDynasty == "PRC"){
        d3.select("#annotation_1").text("People's Republic of China(1949 - now).");
    }
    
}





function updateGraph(data,dynasty) {
  var line = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.close); });
  var x = d3.scaleLinear()
    .rangeRound([0, width]);
  var y = d3.scaleLinear()
    .rangeRound([height, 0]);
  x.domain(d3.extent(data, function(d) { return d.Year; }));
  y.domain(d3.extent(data, function(d) { return d.close; })).nice();
    
  console.log(x(25));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(10)
               .tickFormat(function(d){if (d < 0) {return "BC" + -d} else {return "AC" + d}}))
    .select(".domain")
    .text("Year");

  g.append("g")
      .call(d3.axisLeft(y));
    
    
  if(dynasty != null)
      highlightGenerator(data, dynasty,x,y);

  var path = g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    var totalLength = path.node().getTotalLength();
    
    path
    .attr("stroke-dasharray", totalLength + "," + totalLength)
    .attr("stroke-dashoffset", totalLength)
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attr("stroke-dashoffset", 0);
    
svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left - 39)
    .attr("x", 0 - (height / 2) + 30)
        .style("text-anchor", "middle")
        .text("Territory Area (10,000 Sq. km)");//add label

    svg.append("text")             
        .attr("transform",
              "translate(" + 1170 + " ," + 
               505 + ")")
        .style("text-anchor", "end")
        .text("Year");
    
//=======================================================Recursive Work From Blarry Begins==================================================================================   
//======================================================================================================================================================================== 
    
    svg.append("circle").attr("cx", 900).attr("cy", 80).attr("r", 4).style("fill", "red");
    svg.append("circle").attr("cx", 900).attr("cy", 100).attr("r", 4).style("fill", "black");
    svg.append("text").attr("x", 910).attr("y", 85).text("Positive events(clickable)").style("fill", "red");
    svg.append("text").attr("x", 910).attr("y", 105).text("Negative events(clickable)").style("fill", "black");
    
     svg.append("circle").attr("cx", 50).attr("cy", 401).attr("r", 4).style("fill", "red").on("click", mouseClick_1);
    
    function mouseClick_1() {
        d3.select("#annotation").text("From BC 230 to BC 221,  King Ying Zheng of Qin accomplished the impossible: defeating all 6 other warring states in ten years and for the first time in history uniting China, then became the first emperor of China. Althogh Qin dynasty quickly collapsed after his death, the political system of centralization of authority that he designed lived on for more than 2000 years.");
}
    
    

      g.append("circle").attr("cx", 29).attr("cy",408).attr("r", 4).style("fill", "red").on("click", mouseClick_2);
  
       
    function mouseClick_2() {
         d3.select("#annotation").text("In 157 BC, Emperor Wu of Han, who is considered one of the greatest emperors of China's history, started his 54-year reign: a record not broken until 1,800 years later. Emperor Wu led a vast territorial expansion and successfully repelled the nomadic Xiongnu from systematically raiding northern China.");
}
    
     g.append("circle").attr("cx", 102).attr("cy", 336  ).attr("r", 4).style("fill", "black").on("click", mouseClick_3);

    function mouseClick_3() {
        d3.select("#annotation").text("In 9 AD, Wang Mang,who was a Han Dynasty official, usurped the throne from the Liu family and founded the Xin Dynasty, ruling 9–23 AD.The Han dynasty was restored by Liu family years after his overthrow. His rule marks the separation between the Western Han Dynasty (before Xin) and Eastern Han Dynasty (after Xin).");
}
    
   /* svg.append("circle").attr("cx", 218.02502234137623).attr("cy", 290.01603375527426).attr("r", 4).style("fill", "black").on("click", mouseClick_4);
    
    function mouseClick_4() {
        text.text(" After the middle period of the Eastern Han, rampant corruption and injustice finally caused major rebellion from farmers in 184 AC, known as the Yellow Turbans Uprising.")
       .attr("x",100)
       .attr("y",30);
}
*/
    
    
        g.append("circle").attr("cx", 236).attr("cy", 354.5).attr("r", 4).style("fill", "black").on("click", mouseClick_4_1);

        function mouseClick_4_1() {
        d3.select("#annotation").text("From 291 AD to 306 AD, the regency over the developmentally disabled Emperor Hui of Jin led to War of the Eight Princes, which was a series of civil wars among princes. Country was significantly weakened by it and only 5 years later, it lost its capital and Emperor Huai of Jin was taken by Xiongnu. Country fled south, giving up large area of land.");
}
    

    
    
    g.append("circle").attr("cx", 279).attr("cy", 392).attr("r", 4).style("fill", "red").on("click", mouseClick_4_2);

        function mouseClick_4_2() {
        d3.select("#annotation").text("Northern Wei was a dynasty founded by the Tuoba clan of race Xianbei in 386. Althogh it is not founded by race Han, Emperor Xiaowen compelled his own Xianbei people and others to adopt Chinese surnames, speak Chinese languages and wear Chinese clothes.The empire unified northern China in 439 AC, gaining large area of lands. ");
}
    
    
    
    g.append("circle").attr("cx",347).attr("cy", 317).attr("r", 4).style("fill", "black").on("click", mouseClick_4_3);

        function mouseClick_4_3() {
        d3.select("#annotation").text("In 534 AC, Northern Wei was deafeated.");
}
    
  
    
    g.append("circle").attr("cx", 369).attr("cy", 398).attr("r", 4).style("fill", "red").on("click", mouseClick_4_4);
    
    function mouseClick_4_4() {
       d3.select("#annotation").text("In 581 AC, Emperor Wen of Sui founded Sui dynasty, which later on finally reunified China after 300 years of war. Emperor Wen's reign was a great period of prosperity not seen since the Han Dynasty. Sui also defeated four other region powers, thanks to its powerful military.");
}
    
    
    
    g.append("circle").attr("cx", 390).attr("cy", 369).attr("r", 4).style("fill", "red").on("click", mouseClick_5);
    
    function mouseClick_5() {
        d3.select("#annotation").text("In 626 AC, Emperor Taizong of Tang, who is considered to be one of the greatest emperors, usurped the throne from his brother. His era, the ''Reign of Zhenguan'' is considered a golden age during which Tang China flourished economically and militarily. For more than a century after his death, China enjoyed prosperity and peace while making large territorial expansion .");
}

    
    g.append("circle").attr("cx", 449).attr("cy",  294).attr("r", 4).style("fill", "black").on("click", mouseClick_6);

    function mouseClick_6() {
         d3.select("#annotation").text("The An–Shi Rebellion,started In 755 AC by general An,was a devastating rebellion against the Tang dynasty. Emperor Xuanzong of Tang was blamed for over-trusting general An by giving him an army of 200,000. The rebellion and subsequent disorder resulted in a huge loss of life and large-scale destruction. It significantly weakened the Tang dynasty, and led to the loss of the Western Regions.");
}
   
      
    
    g.append("circle").attr("cx", 656).attr("cy",  393).attr("r", 4).style("fill", "red").on("click", mouseClick_6_1);

    function mouseClick_6_1() {
        d3.select("#annotation").text("In 1206, Genghis Khan founded the Mongol Empire, which later on became the largest contiguous empire in history. In 1271, Kublai Khan, successor of Genghis Khan,  officially proclaimed the Yuan dynasty in the traditional Chinese style, and conquested Southern Song Dynasty in 1279.");
}
    
      
    g.append("circle").attr("cx", 731).attr("cy", 155).attr("r", 4).style("fill", "red").on("click", mouseClick_7);

    function mouseClick_7() {
        d3.select("#annotation").text("From 1368 to 1435, Ming dynasty thrived because of four diligent and determined Emperors. Although its territory is significantly smaller than Yuan, people of China enjoyed prosperity.");
}
    
    console.log(x(1654)); //93.08310991957104
    console.log(y(1300)); //324.36286919831224
    
    g.append("circle").attr("cx", 825).attr("cy", 306).attr("r", 4).style("fill", "black").on("click", mouseClick_8);

    function mouseClick_8() {
        d3.select("#annotation").text("Wanli Emperor began his reign In 1563. During the early part of his reign, he showed himself to be a competent and diligent emperor while the empire remained powerful. But during the last 20 years of his reign, he refused to play the emperor's role in government, and delegated many responsibilities to eunuchs. His reign was a significant factor contributing to the rapid decline of the Ming dynasty.  ");
}
    
    
     g.append("circle").attr("cx",863).attr("cy", 350).attr("r", 4).style("fill", "red").on("click", mouseClick_9);

    function mouseClick_9() {
        d3.select("#annotation").text(" Emperor Kangxi's reign started in year 1654 and lasted 61 years, making him the longest-reigning emperor in Chinese history. His reign is celebrated as the beginning of an era known as the ''High Qing'', during which the dynasty reached the zenith of its social, economic and military power. ");
}
    
     g.append("circle").attr("cx", 926).attr("cy", 206).attr("r", 4).style("fill", "black").on("click", mouseClick_9_1);

    function mouseClick_9_1() {
        d3.select("#annotation").text(" In 1792, the first envoy of Britain, whose primary aim was to open trade with Qing Dynasty, arrived in China. Even though they came with gifts and humble attitude, China refused to open trade. Emperor Qianlong arrogantly told the embassy: Our heavenly country needs nothing from you. But we shall graciously open trading spot in Macau for your needs.");
}
    
    
    
         g.append("circle").attr("cx", 948).attr("cy", 213).attr("r", 4).style("fill", "black").on("click", mouseClick_10);

    function mouseClick_10() {
        d3.select("#annotation").text(" In the 17th and 18th centuries demand for Chinese goods in Europe created a trade imbalance between Qing Dynasty and Great Britain. To counter this imbalance, the British started selling opium , an addictive drug, to local middlemen in China. In 1839, Great Britain waged war against Qing for ordering a blockade of foreign trade and destroying 1210 tons of opium without offering compensation.")
    }
    
    
    
//=======================================================Recursive Work From Blarry Ends==================================================================================   
//========================================================================================================================================================================   



}
    
/***
dropDownGenerator takes in the csv data and generate the option in drop down box 
@para data : [year, dynast1, area]
***/
function dropDownGenerator(data) {
    var dropDownText = "<option disabled selected value> -- select a dynasty -- </option>";
    var lastDynasty = "invalidDynasty";
    data = data.slice(0,data.length - 1);
    data.forEach(function(row){
        if(row.Dynasty1 != lastDynasty){
            dropDownText += "<option value = '" + row.Dynasty1 + "'>" + row.Dynasty1 + "</option>";
            lastDynasty = row.Dynasty1;
        };
    })
    console.log(data)
    document.getElementById("inds").innerHTML = dropDownText;
                 
}
    
// define global var here for changing color
function highlightGenerator(data, dynasty,x,y){
//    var colorScale = d3.scaleOrdinal(d3.schemeCategory20);
    var index1 = -1, index2 = -1;
    for(var i = 0; i < data.length; i++){
        if(data[i].Dynasty1 == dynasty){
            index1 = i;
            for(var j = i; j < data.length; j++){
                if(data[j].Dynasty1 != dynasty){
                    index2 = j;
                    i = data.length;    //optimizing loop time by ending the loop
                    break;
                }
            }
        }
    }
    console.log(index2);
    if(index2 == -1)
        index2 = data.length;
    
    
    
    var area = d3.area()               //x is common-used x coordinates, while y is two groups of lines to define lower and upper boundary.
                 .x(function(d) { return x(d.Year); })
                 .y1(function(d) { return y(d.close); });
    
    console.log(index1);
    console.log(index2);
    highLightedData = data.slice(index1,index2 + 1);
    console.log(highLightedData);
    area.y0(y(0));
    
    g.append("path")
      .datum(highLightedData)
      .attr("d", area)
      .attr("fill", function(){
        
            //no boolean var in js, use this statement to imitate a flip-flop
        return d3.schemeCategory20[highLightedData[0].color]
        })
      .style("opacity", 0.5)
      .attr("class", "highlight");
    
    console.log("from year"+data[index1].Year);
    console.log("to year"+data[index2].Year);
    var text =g.append("text")
      .attr("transform", "translate(" + x( (data[index1].Year + data[index2].Year)/2 ) + "," + height * 1.05 + "),rotate(-45)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
     .style("font-size", 15)
    
      .text(dynasty)
      .attr("class", "highlightText");
    ;    
}
    
function clearAll(){
  d3.selectAll(".highlight")
	.transition().duration(100)
			.attr("d", function(d){
        return null;
      });
    
  d3.selectAll(".highlightText")
	.transition().duration(100)
    .style("opacity", 0);
    
};
    
