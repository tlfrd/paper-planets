const d3 = require('d3');

module.exports = () => {
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
};
