# NOC_Tool

NOTE: this tool was built for MAESD and contained private data that had to be removed. An updated version with new, open data and a different purpose will be added soon. 

The main point of this repo is to give users an idea of how to use my implementation of scroll.js with d3 to create their own beautiful data animation projects. 

An interactive web app with bubble map visually representing types of occupations youth are working in per census division, animating per economical region on scroll, with bubble sizes changing via data field selected by the user. 

![](ezgif.com-gif-maker.gif)

## Project

See full project here: https://smokbel.github.io/forcegraphPOC.html

## TODO (Completed)

### SCROLLER
- [x] Page scroll event tracker
- - [x] at id, get id and find which viz to show
- - [x] the y scroll position of each section to be relative to the top
        of the div screen
### D3 CHARTS
- [x] Ontario census division map
- - [x] Choropleth fill based on csv YJC data
- - - [x] Different color fills for each region
- - - [x] REPLACE DELETED DATA
- - [x] Clickable and zooms on scroll
- - [x] Data bubbles on each division
- - - [x] Data bubbles to change with selection change on dropdown menu
- [x] D3 legend 
