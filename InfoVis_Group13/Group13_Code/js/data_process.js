document.write("<script language=javascript src='js/map.js'></script>");
document.write("<script language=javascript src='js/scatter.js'></script>");
var data_process;  
var array_data = [];
var isClick = false; //control variabe(if click the choose button, the value turns to true)

map(data_process);
var cks = document.getElementsByName("category");
var elem = document.querySelector('input[type="range"]');

//show Year value 
var rangeValue = function(){
  var newValue = elem.value;
  var target = document.querySelector('.value');
  target.innerHTML = newValue;
};

elem.addEventListener("input", rangeValue);
  // control choose two
for (i = 0; i < cks.length; i++) {     
  cks[i].onclick = function(){
    if(!this.checked) return;
    var len = 2;
    var sum = 0;
    for(var j = 0; j < cks.length; j++){
      var ck = cks[j];
      if(ck.checked){
        sum++;
      }
    }
    if(sum > len){
      alert("Choose up to two!");
      this.checked = false;
    }
  }
}
document.getElementById("btnOperate").onclick = function () {                
  var items = document.getElementsByName("category");  
  isClick = true;  
  // load the country code data
  d3.csv("./DATA/birth rate.csv",
    function(error,data){
      var json = []; ///form the data format as json format
      for (var i = 0; i < data.length; i++) {
        var j = {};
        j.country = data[i]["Country Code"];
        j.x = 0;
        j.y = 0;
        j.obj = i;
        json.push(j); 
      }
      data_process = JSON.stringify(json);
    });
   
    var indicator_x;
    var indicator_y;
    var indicator_x_abbr;
    var indicator_y_abbr;
    // the max value used in scatter plot
    var x_max = Number.MIN_SAFE_INTEGER;
    var y_max = Number.MIN_SAFE_INTEGER;
    var x_min = Number.MAX_SAFE_INTEGER;
    var y_min = Number.MAX_SAFE_INTEGER;
    for (k = 0; k < items.length; k++) {                    
        if (items[k].checked){ 
          // choose one item to control use which document   
          d3.csv("./DATA/"+items[k].value+".csv", 
          function(error, data) {
            var obj = document.getElementById("range1");  
              for(i = 0;i<data.length;i++)
              {  
                var json = JSON.parse(data_process);
                if(json[i].x == 0)//first item
                { 
                  indicator_x = data[i]["Indicator Name"];
                  indicator_x_abbr = indicator_x.split(/[,(]/)[0];// split indicator name with comma, 
                                                              // the word before comma is abbreviation
                  json[i].x = parseFloat(data[i][obj.value]);
                  if(json[i].x > x_max)
                    x_max = json[i].x;
                  else if(json[i].x < x_min)
                    x_min =json[i].x;
                  if(data[i][obj.value].length==0)//assign to the blank data 
                    json[i].x =-1;
                  data_process = JSON.stringify(json);
                }
                else if(json[i].x!=0)//second item
                {
                  indicator_y = data[i]["Indicator Name"];
                  indicator_y_abbr = indicator_y.split(/[,(]/)[0];
                  json[i].y = parseFloat( data[i][obj.value]);
                  if(json[i].y > y_max)
                    y_max = json[i].y;
                  else if(json[i].y < y_min)
                    y_min =json[i].y;
                  if(data[i][obj.value].length==0)
                    json[i].y=-1;
                  data_process = JSON.stringify(json);
                }
              }
           
            var json = JSON.parse(data_process);
            if(json[0].y!=0)//the final data_process
            {
              for(var check = json.length-1;check>-1;check--)
              {
                if((json[check].x==-1)||(json[check].y==-1))
                {
                  json.splice(check,1);//delete the blank data from json 
                }
              }
              data_process =  JSON.stringify(json);
              scatter(data_process,x_min,x_max,y_min,y_max,indicator_x,indicator_y,indicator_x_abbr,indicator_y_abbr);
              pixelUpdate(x_min, x_max, y_min, y_max,indicator_x_abbr,indicator_y_abbr);
              map(data_process,indicator_x_abbr,indicator_y_abbr);
            }  
          });          
      }                 
    }
  };




