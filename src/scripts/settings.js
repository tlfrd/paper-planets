const d3 = require('d3');
const scaleChromatic = require('d3-scale-chromatic');

module.exports = () => {
  var christmasColours1 = [
    "#ff0000",
    "#ff7878",
    "#74d680",
    "#378b29"
  ];

  var accent = d3.scaleOrdinal(d3.schemeAccent);

  d3.select("#graticulesToggle").on("change", () => {
    if (d3.select("#graticulesToggle").property("checked")) {
      d3.select("#graticule").style("stroke", "#aaa");
    } else {
      d3.select("#graticule").style("stroke", "none");
    }
  });

  d3.select('#seaColour').on("change", () => {
    const value = d3.select("#seaColour").property("value");
    if (value === "default") {
      d3.select("#sphere").style("fill", "rgba(10,10,10,0.05)");
    } else if (value === "blue") {
      d3.select("#sphere").style("fill", "#BDD9F1");
    } else {
      const hexValue = d3.select("#seaColourHex").property("value");
      d3.select("#sphere").style("fill", "#" + hexValue);
    }
  });

  d3.select("#seaColourHex").on("change", () => {
    const seaValue = d3.select("#seaColour").property("value");
    if (seaValue === "custom") {
      const hexValue = d3.select("#seaColourHex").property("value");
      d3.select("#sphere").style("fill", "#" + hexValue);
    }
  });

  d3.select('#mapColour').on("change", () => {
    const value = d3.select("#mapColour").property("value");
    if (value === "default") {
      var countries = d3.select("#countries");
      countries
        .selectAll('path')
        .style('fill', (d,i) => {
          return christmasColours1[i%4];
        });
    } else if (value === "black") {
      var countries = d3.select("#countries");
      countries
        .selectAll('path')
        .style('fill', 'black');
    } else if (value === "population") {
    }

  });
};
