
function pixelUpdate(x_min, x_max, y_min, y_max, indicator_x, indicator_y){

  if($("#pix0").find(".tooltiptext").length == 0){
    for(var i = 0; i < 9; i ++)
      $("#pix" + i).append("<span class='tooltiptext'></span>");
  }

	var x_width = (x_max - x_min + 1)/3;
	var y_width = (y_max - y_min + 1)/3;
	var i = 0, j = 0, y;
	var x_lower, x_upper, y_lower, y_upper;

	for(; i < 3; i ++){
		for(j = 0; j < 3; j ++){
			y = 2 - j;
			var index = i * 3 + y;
			x_lower = (x_min + i * x_width).toFixed(2);
			x_upper = (x_min + (i + 1) * x_width).toFixed(2);
			y_lower = (y_min + y * y_width).toFixed(2);
			y_upper = (y_min + (y + 1) * y_width).toFixed(2);

			$("#pix" + index +" span").html("x [" + x_lower + ", " + x_upper + ")<br/>" 
										  + "y [" + y_lower + ", " + y_upper + ")");
		}
	}
}