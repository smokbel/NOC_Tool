d3.legend = function() {

  // Defaults

  var t = [0, 0],
      cb = null,
      colors = d3.scaleOrdinal()
        .domain(["A", "B", "C", "D"])
        .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b"]);

  // Adjust the legends rectangle sizes below -> boxW = rectangle width; boxH = rectangle height;

  var boxW = 80,
      boxH = 30,
      padding = 1,
      dx = boxW + padding;

  // To change whether you want a vertical legend or a horizontal one, simply switch the
  // x and y translate values below. It is currently a horizontal legend

  function legend(selection) {
    selection.each(function() {
      var legend = d3.select(this).selectAll(".legend")
        .data( colors.domain().slice().reverse() )
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(" + (t[1] + i * dx) + "," + t[0] + ")"; });

  // Customize the shape of the legend

      legend.append("rect")
        .attr("x", 0)
        .attr('y', 0)
        .attr("width", boxW)
        .attr("height", boxH)
        .style("fill", colors);

  // Adjust the legend text attributes below

      legend.append("text")
        .attr("x", 21)
        .attr("y", boxH + 20)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("font-size", "0.8em")
        .text(function(d) { return d; });

      if (typeof cb == "function") cb();
    })
  }

  legend.translate = function(_) {
    if (!arguments.length) return t;
    t = _;
    return legend;
  };

  legend.colors = function(_) {
    if (!arguments.length) return colors;
    colors = _;
    return legend;
  };

  legend.cb = function(_) {
    if (!arguments.length) return cb;
    cb = _;
    return legend;
  };

  return legend;
}
