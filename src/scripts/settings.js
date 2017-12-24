const d3 = require('d3');

module.exports = () => {
  d3.select("#graticulesToggle").on("change", () => {
    if (d3.select("#graticulesToggle").property("checked")) {
      d3.select("#graticule").style("stroke", "#aaa");
    } else {
      d3.select("#graticule").style("stroke", "none");
    }
  });
};
