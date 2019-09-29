var margin = {top: 30, right: 20, bottom: 30, left: 50},
  width = 600 - margin.left - margin.right,
  height = 600 - margin.top - margin.bottom;

var svg = d3.select("#scatter").append("svg");

var tooltip = d3.select("#scatter").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Calcute RGB color based on coordinates
function getColor(obj, x, y){
  var x_index = parseInt((x-obj.x_min)/obj.x_width);
  var y_index = parseInt((y-obj.y_min)/obj.y_width);
  var color;

  if(x_index == 0 && y_index == 0)
    color = "#e8e8e8";
  else if(x_index == 0 && y_index == 1)
    color = "#dfb0d6";
  else if(x_index == 0 && y_index == 2)
    color = "#be64ac";
  else if(x_index == 1 && y_index == 0)
    color = "#ace4e4";
  else if(x_index == 1 && y_index == 1)
    color = "#a5add3";
  else if(x_index == 1 && y_index == 2)
    color = "#8c62aa";
  else if(x_index == 2 && y_index == 0)
    color = "#5ac8c8";
  else if(x_index == 2 && y_index == 1)
    color = "#5698b9";
  else 
    color = "#3b4994";

  return color;
}

// Draw scatter plot
function scatter(data, x_min, x_max, y_min, y_max, indicator_x, indicator_y,indicator_x_abbr,indicator_y_abbr){

  d3.selectAll("svg").remove();
  d3.selectAll("g").remove();
  d3.selectAll('circle').remove();
  d3.select('text').remove();

  data = JSON.parse(data);

  svg = d3.select("#scatter").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var x_width = (x_max - x_min + 1)/3;
  var y_width = (y_max - y_min + 1)/3;

  var text = '{"x_width" : '+ x_width + ', "x_min" : ' + x_min + ', "y_min" : '+ y_min + ', "y_width" :' + y_width + '}'
  var obj = JSON.parse(text);

  // Setup x-axis
  var xScale = d3.scale.linear()
                 .domain([ x_min - x_width/3, x_max + x_width/3])
                 .range([0, width]);
  var xAxis = d3.svg.axis().scale(xScale).orient("bottom");
      
  // Setup Y-axis
  var yScale = d3.scale.linear()
                       .domain([y_min - y_width/3, y_max + y_width/3])
                       .range([height, 0]);
  var yAxis = d3.svg.axis().scale(yScale).orient('left');

  // Draw x-axis
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text(indicator_x);
   
  // Draw y-axis
  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text(indicator_y);

  // Circles
  var circles = svg.selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx',function (d) { return xScale(d.x) })
      .attr('cy',function (d) { return yScale(d.y) })
      .attr('r','5')
      .attr('fill', d => getColor(obj, d.x, d.y))
      .on("mouseover", function(d) {    
            d3.select(this).transition().duration(500).attr('r',10).attr('stroke-width',3)
            tooltip.transition()    
                .duration(200)    
                .style("opacity", .9);    
            tooltip.html("Country: <span><b>" + d.country + "</b></span><br/>"
              + indicator_x_abbr + ": <b>" + d.x.toFixed(2) + "</b><br>" + indicator_y_abbr +": <b>" + d.y.toFixed(2) + "</b>")
                .style("left", (d3.event.pageX) + "px")   
                .style("top", (d3.event.pageY - 28) + "px")
                .style("background", getColor(obj, d.x, d.y));  
            })          
        .on("mouseout", function(d) { 
            d3.select(this).transition().duration(500).attr('r',5).attr('stroke-width',1) 
            tooltip.transition()    
                .duration(500)    
                .style("opacity", 0); 
        });

  
  // Titile
  svg.append("text")
      .attr("x", (width / 2))       
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "18px") 
      .text("Scatter plot showing "+ indicator_x_abbr +" and "+ indicator_y_abbr);
}
