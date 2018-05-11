var colorsLeg = d3.scaleThreshold()
  .domain(['.3','.4','.6', '.8', '1', '2', '3', '>4'])
  .range(d3.schemeYlOrRd[9]);

var legend = d3.legend()
      .translate([10 , 0])
      .colors(colorsLeg)

  d3.select("#legendHere")
  .append("svg")
    .attr("width", 800)
    .attr("height", 90)
    .append("g")
      .attr("class", "legendQuant")
      .attr("transform", "translate(30,10)")
      .call(legend);
