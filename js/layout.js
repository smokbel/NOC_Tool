// maps width and height redefined, to create zoom transitions as proportions to
// the maps height and width;

var height = 700,
    width = 620;

let mapChart = map();
d3.select('#mapChart').call(mapChart);

let layout = function() {
  return [
    {
      name: 'mainHeader',
      type: 'header',
      el: d3.select('#mainHeader'),
      height: 700
    },
    {
      name: 'subHeader',
      type: 'header',
      el: d3.select('#subHeader'),
      height: 780
    },
    {
      name: 'map',
      el: d3.select('#mapText'),
      chartEl: d3.select('#mapChart'),
      type: 'chart',
      height: 5000,
      animations: [
        {
          name: 'initial',
          draw: () => {
            leftFixed("#regionText", false)
            mapChart.zoomIn('translate(0,0)scale(1)')
            .opacity(1)
            .bubbles()
            d3.select('#mapChart').classed('fixed-chart', true)
          },
          height: 0.05
        },
        {
          name: 'northern',
          draw: () => {
            leftFixed("#regionText", true)
            mapChart.zoomIn('translate('+(-0.24*width) +', '+ (-0.13*height)+') scale(1.4)')
            .regions('Northern Region', 'green')
            .bubbles(true)
            d3.select('#mapChart').classed('fixed-chart', true)
          },
          height: 0.1
        },
        {
          name: 'western',
          draw: () => {
            leftFixed("#regionText", true)
            mapChart.zoomIn('translate('+ (-4.5*width) +', '+ (-4.42*height) +') scale(5.5)')
            .regions('Western Region', '#FFC000')
            .bubbles(true)
            d3.select('#mapChart').classed('fixed-chart', true).classed('is-bottom', false)
          },
          height: 0.17
        },
        {
          name: 'eastern',
          draw: () => {
            leftFixed("#regionText", true)
            mapChart.zoomIn('translate('+ (-5.16*width) +', '+ (-3.57*height) +') scale(5)')
            .regions('Eastern Region', '#9649CB')
            .bubbles(true)
            d3.select('#mapChart').classed('fixed-chart', true).classed('is-bottom', false)
          },
          height: 0.25
        },
        {
          name: 'central',
          draw: () => {
            leftFixed("#regionText", true)
            mapChart.zoomIn('translate('+ (-7.6*width) +', '+ (-6.25*height) +') scale(8)')
            .regions('Central Region', 'orange')
            .bubbles(true)
            d3.select('#mapChart').classed('fixed-chart', true).classed('is-bottom', false)
          },
          height: 0.32
        },
        {
          name: 'finalanim',
          draw: () => {
            leftFixed('#regionText', false)
            mapChart.zoomIn('translate(0,0)')
            .bubbles()
            d3.select('#mapChart').classed('fixed-chart', false).classed('is-bottom', true)
          },
          height: 0.35
        }
      ]
    }
  ]
}

function leftFixed(id, state) {
  console.log("leftFixed fired")
  if(!id) {
    console.log("Need to provide an ID")
    return false
  }

  if(state){
    d3.select(id).classed('posFixed', true)
  } else {
    d3.select(id).classed('posFixed', false)
  }
}
