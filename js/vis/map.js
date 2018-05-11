function map() {

  // Constants/defaults

  let width = 960,
      height = 700,
      active = d3.select(null),
      zoomInVal = 'translate(0,0)scale(1)',
      og = 1.0;

  // Threshold scale for the CD fill colors;

  let colors = d3.scaleThreshold()
      .domain([.3, .4, .6, .8, 1, 2, 3, 4, 5])
      .range(d3.schemeYlOrRd[9]);

  // Scale for bubble radius

  let radius = d3.scalePow()
       .exponent(0.2)
       .domain([0,3000])
       .range([1,8]);

  // CHART FUNCTION STARTS HERE -->

  function chart(selection) {

    function ready(error, censusDivision, data, cd) {
      if (error)
      throw error;

      let featureCollection = topojson.feature(censusDivision, censusDivision.objects.censusdiv);

      // Topojson data is already projected. d3.geoIdentity allows us to use the projection.fitSize()
      // (which modifies scale and translate) method but otherwise doesn't project the data

      let projection = d3.geoIdentity()
        .reflectY(true)
        .fitSize([width, height], featureCollection)

      let thePath = d3.geoPath()
        .projection(projection);

      let svg = selection.append('svg')
        .attr('width', width)
        .attr('height', height);

      let g = svg.append('g')
        .attr('id', 'ont')
        .attr('transform', zoomInVal)
        .style("filter", "url(#drop-shadow)"); //this is the shadow which will be defined below

     //d3.map() used for the FILL of the census divs: getter-setter method

      let percMap = d3.map();
        cd.forEach(function(d) {
          percMap
            .set(d.geo, d.percent)
      });

      //Drawing the CENSUS DIVISIONS -->

      let divisions = g
      .selectAll('path')
        .data(featureCollection.features)
          .enter()
          .append('path')
          .attr('d', thePath)
          .attr('class', 'thepaths')
          .attr('fill', (d)=>{
              return colors(percMap.get(d.properties.CDNAME))
            })
          .attr('class', 'polygons')
          .style('opacity', og)
          .on('click', clicked);

      divisions
         .transition()
         .duration(750)

      //ZOOM IN ON CLICK FUNCTION -->

      function clicked(d) {
        if (active.node() === this) return reset();
        active.classed("active", false);
        active = d3.select(this).classed("active", true);

      //.bounds() function returns the closest bounding box (two dimensional array)
      // of the specified polygon;

      var bounds = thePath.bounds(d),
            dx = bounds[1][0] - bounds[0][0],
            dy = bounds[1][1] - bounds[0][1],
            x = (bounds[0][0] + bounds[1][0]) / 2,
            y = (bounds[0][1] + bounds[1][1]) / 2,
            scale = 0.6 / Math.max(dx / width, dy / height),
            translate = [width / 2 - scale * x, height / 2 - scale * y];

      g.transition()
          .duration(750)
          .style("stroke-width", 5 / scale + "px")
          .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
      };

      //zoom out once active feature is clicked on again
      function reset() {
       active.classed('active', false);
       active = d3.select(null);

        g.transition()
          .duration(750)
          .attr('transform', '');
    };

    //new linear data object created to easily call data
      let newData = {}
       data.forEach((row)=>{
         if(typeof newData[row.geography] !== 'object' ) {
           newData[row.geography] = {}
        }
         newData[row.geography][row.noc] = row
       })

      //DROPDOWN MENU -->

      //d3.nest() to return all unique noc values as keys
      let nest1 = d3.nest()
        .key(function(d) {return d.noc; })
        .entries(data);

      //.map function to create an array of unique nocs in the data
       let nocs = nest1.map(function(d) { return d.key; });

       let currentNocIndex = 0;

       let nocMenu = d3.select('#dropDown')
         nocMenu
           .append("select")
           .attr("id", "selectorMenu")
           .selectAll("option")
             .data(nest1)
             .enter()
             .append("option")
             .attr("value", function(d) { return d.key; })
             .text(function(d) { return d.key; });

      //BUBBLES ON MAP ---->

      //function to create the initial bubbles
      var drawBubbles = function(occupation) {

        g.append('g')
        .selectAll('circle')
         .data(featureCollection.features)
          .enter()
          .append('circle')
          .attr('transform', function(d) {return 'translate(' + thePath.centroid(d) + ')';})
          .attr('class', 'circle')
          .style('opacity', 0)
          .attr('r', (d) => {
              return radius(newData[d.properties.CDNAME][occupation].nocCount)
            })
          .on('mouseover', function (d) {
                d3.select(this)
                .classed('circlehover', true);
                CDtext
                 .html(d.properties.CDNAME).style('opacity', 0.9);
                countText
                 .html(newData[d.properties.CDNAME][occupation].nocCount).style('opacity', 0.9); })
         .on('mouseout', hideDetail)
      }

      drawBubbles(nocs[currentNocIndex]);

      onNocChange();

      //redraw bubbles for selected occupation
      function updateBubbles(occupation) {
        var drawBubbles = d3
          .selectAll('.circle')
          //.style('opacity', 0.8)
          .on('mouseover', function (d) {
                d3.select(this)
                .classed('circlehover', true);
                 CDtext
                  .html(d.properties.CDNAME).style('opacity', 0.9);
                 countText
                  .html(newData[d.properties.CDNAME][occupation].nocCount).style('opacity', 0.9);
              })
          .transition()
          .duration(600)
          .attr('r', (d) => {
              return radius(newData[d.properties.CDNAME][occupation].nocCount)
            })
      }

      //run update function when dropdown selection changes
      nocMenu.on("change", onNocChange)

      //update function for selected noc
      function onNocChange() {
        updateBubbles(d3.select('#selectorMenu').property('value'));
      }

      // SHADOW ---->

      var defs = g.append('defs');
      var filter = defs.append('filter')
         .attr('id', 'drop-shadow')
         .attr('height', '320%');
      filter.append('feGaussianBlur')
         .attr("in", "SourceAlpha")
         .attr("stdDeviation", 5)
         .attr("result", "blur");
      filter.append("feOffset")
         .attr("in", "blur")
         .attr("dx", 8)
         .attr("dy", 3)
         .attr("result", "coloredBlur");

      var feMerge = filter.append("feMerge");

      feMerge.append("feMergeNode")
          .attr("in", "coloredBlur")
      feMerge.append("feMergeNode")
          .attr("in", "SourceGraphic");

    //  TOOLTIP --->

      var CDtext = d3.select('#CD')
         .append('text')
         .attr('class', 'tooltip')
         .style('opacity', 0.1);

      var countText = d3.select('#count')
         .append('text')
         .attr('class', 'tooltip')
         .style('opacity', 0.1);

      //reused transition function
      function fadeOut(selection) {
        return selection
        .transition()
        .duration(100)
        .style('opacity', 0.1);
      }

      //hiding tooltip
      function hideDetail(d) {
        d3.select(this)
        .classed('circlehover', false)
        .classed('circle', true)
        CDtext.call(fadeOut);
        countText.call(fadeOut);
      }

    //END OF READY FUNCTION -->

    }

    //queue the data
    d3.queue()
      .defer(d3.json, 'data/ontcd.json')
      .defer(d3.csv, 'data/educationAndNOC.csv')
      .defer(d3.csv, 'data/cddata.csv')
      .await(ready);


    var regionTexts = d3.select('#region')
       .append('text')
       .attr('height', '10em')
       .attr('width', '10em')
       .style('padding', '0.3em')
       .style('border-radius', '0.5em')

    //REUSEABLE/CHANGEABLE ELEMENTS (called in layout.js file) -->

    //the color/name change of regions on scroll
    chart.regions = function(region, fill) {
      if (region, fill) {
        regionTexts.html(region)
        .style('background-color', fill)
      }
     return chart;
    }

    //animated bubble opacity
    chart.bubbles = function(rad) {
      if (rad) {
        d3.selectAll('circle')
          .transition()
          .duration(900)
          .style('opacity', 0.8)
        }
      return chart;
    }

    //zoom in translation on scroll
    chart.zoomIn = function(val) {
      if(val) {
        d3.select('#ont')
          .transition()
          .duration(800)
          .attr('transform', val)
      }
     return chart;
    }

    //to change the opacity of entire map
    chart.opacity = function(opy) {
    if (opy) {
      d3.selectAll('.polygons')
        .transition()
        .duration(800)
        .style('opacity', opy)
      }
      return chart;
    }

    //END OF CHART FUNCTION -->
  }
  return chart;
}
