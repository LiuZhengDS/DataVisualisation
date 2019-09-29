function map(data_process,indicator_x_abbr,indicator_y_abbr){
  
  // set window/frame size for map
  var height = 670;
  var width = 650*1.5;  

  var svg = d3.select('#map').append('svg');
  var features;
  d3.json("./DATA/world.json", function(data){

    //remove Antarctica from the map
    features = _.filter(data.features, function(value, key){
      return value.properties.name != 'Antarctica';
    });

    // projection
    var projection = d3.geo.mercator();
    var oldScala = projection.scale();
    var oldTranslate = projection.translate();
    // set new scale and size of map
    xy = projection.scale(oldScala * (width / oldTranslate[0] / 2))
      .translate([width / 2, height * 0.7]);
    // obtain path after projection as 'xy'
    path = d3.geo.path()
      .projection(xy);

    // set up tooltip
    var tooltip = d3.select("#scatter")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    var world = svg.append("g");

    // when do not choose data and click "choose", display initialised map
    if (isClick == false){
      svg.attr('width', width)
      .attr('height', height)
      .append("text")
      .attr("x", (width / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("World Map with Data Visualisation"); // initialised map title
      
      // draw map based on path achieved above
      var country = world.selectAll('path')
        .data(features)
        .enter()
        .append('svg:path')
        .attr('d', path)
        //fill in colour based on initialised colour as follow:
        .attr('fill', rgba = 'rgba(128, 128, 128, 0.5)')
        //set up stroke parameter as follow:
        .attr('stroke', 'rgba(128, 128, 128, 0.5)')
        .attr('stroke-width', 1)

        // mouse hover function
        .on('mouseover', function(d){
          tooltip.transition()
            .duration(200)
            .style("opacity", 0.9);
          // before choose attributes, we only show country name (initialisatoin)
          tooltip.html(d.properties.name)
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY + 20) + "px")
            .style("opacity", 1.0);
          d3.select(this).attr('fill', '#FAD7A0'); // mouseover colour
        })

        // remove mouse from countries
        .on('mouseout', function(d){
          d3.select(this)
            .attr('fill', 'rgba(128, 128, 128, 0.5)'); // go back to initialised colour
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        })

        .on("click", function country(d){
          console.log(d.properties.name)
          country = d.properties.name;
        })

      function getCountry(){
        return country;
      }
    }

    // choose data and click "choose", start visualisation
    else if (isClick == true){
      svg.attr('width', width)
      .attr('height', height)
      .append("text")
      .attr("x", (width / 2))
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .text("World Map with " + indicator_x_abbr + " and " + indicator_y_abbr); // based on indicator selected, display new title of map

      // get maximum and minimum value of both indicator x and y
      var x_max = Number.MIN_SAFE_INTEGER,
          y_max = Number.MIN_SAFE_INTEGER,
          x_min = Number.MAX_SAFE_INTEGER,
          y_min = Number.MAX_SAFE_INTEGER;  

        j = JSON.parse(data_process);
        j.forEach(function(d){
        d.x = parseFloat(d.x);
        d.y = parseFloat(d.y);
        if (d.x > x_max)
          x_max = d.x;
        else if (d.x < x_min)
          x_min = d.x;
        if (d.y > y_max)
          y_max = d.y;
        else if (d.y < y_min)
          y_min = d.y;
      });
      
      var x_width = (x_max - x_min + 1) / 3;
      var y_width = (y_max - y_min + 1) / 3;
      var text = '{"x_width" : ' + x_width + ', "x_min" : ' + x_min + ', "y_min" : ' + y_min + ', "y_width" :' + y_width + '}'
      var obj = JSON.parse(text);

      function getColor(obj, x, y){
        var x_index = parseInt((x - obj.x_min) / obj.x_width);
        var y_index = parseInt((y - obj.y_min) / obj.y_width);
        var color;

        if (x_index == 0 && y_index == 0)
          color = "#e8e8e8";
        else if (x_index == 0 && y_index == 1)
          color = "#dfb0d6";
        else if (x_index == 0 && y_index == 2)
          color = "#be64ac";
        else if (x_index == 1 && y_index == 0)
          color = "#ace4e4";
        else if (x_index == 1 && y_index == 1)
          color = "#a5add3";
        else if (x_index == 1 && y_index == 2)
          color = "#8c62aa";
        else if (x_index == 2 && y_index == 0)
          color = "#5ac8c8";
        else if (x_index == 2 && y_index == 1)
          color = "#5698b9";
        else
          color = "#3b4994";

        return color;
      }

      var country = world.selectAll('path')
        .data(features)
        .enter()
        .append('svg:path')
        .attr('d', path)
        //fill in color based on the color matrix
        .attr('fill', function(d){
          for (i = 0; i < j.length; i++){
            // if mouse is over the country i
            if (d.id == j[i].country){
              var cl = getColor(obj, j[i].x, j[i].y); // get colour based on x,y value
            }
          }
          return cl;
        })
        
        //set up stroke parameter
        .attr('stroke', 'rgba(128, 128, 128, 0.5)')
        .attr('stroke-width', 1)
        .on('mouseover', function(d){
          // before choose attributes, we only show country name from map
          for (i = 0; i < j.length; i++){
            if (d.id == j[i].country){
              tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
                // tooltip window display data value of indicators x and y
                tooltip.html(d.properties.name + "</span><br/>" 
                + indicator_x_abbr + ": <b>" + j[i].x.toFixed(2) + "</b></br>"
                + indicator_y_abbr + ": <b>" + j[i].y.toFixed(2) + "</b>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 20) + "px")
                .style("background", getColor(obj, j[i].x, j[i].y))
                .style("opacity", 1.0);
              d3.select(this)
                .attr('fill', '#FAD7A0');
            }
          }
        })
        // move out mouse country colour go back to colour form getColor()
        .on('mouseout', function(d){
          d3.select(this)
            .attr('fill', function(d){
            for (i = 0; i < j.length; i++){
              if (d.id == j[i].country){
                var cl = getColor(obj, j[i].x, j[i].y);
              }
            }
            return cl;
          });
          tooltip.transition()
            .duration(500)
            .style("opacity", 0);
        })

        .on("click", function country(d){
          console.log(d.properties.name)
          country = d.properties.name;
        })

      function getCountry(){
        return country;
      }
    }
  })
}