const d3 = require('d3');
const myriahedral = require('./myriahedral');
const kruskal = require('./kruskal');
const voronoi = require('d3-geo-voronoi');

module.exports = function() {

var radians = Math.PI / 180,
  degrees = 1 / radians;

d3.json('https://rawgit.com/visionscarto/some-geo-data/master/ne_110m_admin_0_countries/countries.geojson', function(err, world) {

  var width = 960, height = 500;

  d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

  var n = world.features.length;

  function spherical(cartesian) {
    return [
      Math.atan2(cartesian[1], cartesian[0]),
      Math.asin(Math.max(-1, Math.min(1, cartesian[2])))
    ];
  }

  function to_degrees(v){
    return v.map(d => d * degrees);
  }

  function normalize (a) {
    var d = Math.sqrt(a[0]*a[0] + a[1]*a[1] + a[2]*a[2]);
    return a.map (e => e / d);
  }

  var g = (1 + Math.sqrt(5)) / 2;

  var vertices = [
    [0, 1, g],
    [g, 0, 1],
    [1, g, 0]
  ];

  vertices = d3.merge([
    vertices,
    vertices.map(d => d.map(e => e * (e == 1 ? -1 : 1))),
    vertices.map(d => d.map(e => e * (e > 1 ? -1 : 1))),
    vertices.map(d => d.map(e => e * (e > 0 ? -1 : 1)))
  ])
  .map(normalize)
  .map(spherical)
  .map(to_degrees);

  var points = {
    type: "FeatureCollection",
    features: vertices.map(function(f, i) {
      return {
        type: "Point",
        index: i,
        coordinates: f
      }
    })
  };

  var v = voronoi.geoVoronoi()(points);

  var links = v.links().features.map(d => d.properties)//.filter(d => d.urquhart)

  // prefer certain links
  links.forEach(l => {
    var u = d3.extent([l.source.index, l.target.index]).join('-');
    l.length = 1 - 0.5 * (['0-1', '1-4', '1-8', '2-4', '2-5', '3-7', '3-8', '6-10', '8-9'].indexOf(u) > -1)
  });

  var k = {
    type: "FeatureCollection",
    features: kruskal(links).map(l => ({
      type:"LineString",
      coordinates: [l.source.coordinates, l.target.coordinates],
      properties: l
    }))
  };

  var projection = myriahedral(k, width, height,
    v.polygons().features.map(d => d.geometry.coordinates[0])
  );

  var faces = projection.faces;

  var path = d3.geoPath().projection(projection);

  var svg = d3.select("svg");

  svg.append('path')
    .attr('id', 'sphere')
    .datum({ type: "Sphere" })
    .attr('d', path);

  svg.append('path')
    .attr('id', 'graticule')
    .datum(d3.geoGraticule()())
    .attr('d', path);

  var countries = svg.append('g').attr('id', 'countries')

  countries
    .selectAll('path')
    .data(world.features)
    .enter()
    .append('path')
    .attr("d", path)
    .style('fill', (_,i) => d3.schemeCategory20[i%20]);

  projection.rotate([0,0,0])

  var ko = k.features.map(d => {
    var x = d.coordinates.map(projection),
        delta = [x[1][0]-x[0][0], x[1][1]-x[0][1]];
    var angle = Math.atan2(delta[1], delta[0]),
        len = Math.sqrt(delta[0]*delta[0] + delta[1]*delta[1]);
    var A = 0.61803 /* g - 1 - epsilon */, B = 36 * radians;
    var y0 = [x[0][0] + len * Math.cos(angle + B) * A,
              x[0][1] + len * Math.sin(angle + B) * A
            ];
    var y1 = [x[0][0] + len * Math.cos(angle - B) * A,
              x[0][1] + len * Math.sin(angle - B) * A
            ];
    return [y0,y1].map(projection.invert);
  });

  svg.append('g')
    .selectAll('path')
    .data([{type:"MultiLineString", coordinates: ko}])
    .enter()
    .append('path')
    .attr('d', path)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 0.5)
    .attr('stroke-dasharray', '3');

  svg.append('g')
    .attr('class', 'sites')
    .selectAll('circle')
    .data(points.features)
    .enter()
    .append('circle')
    .attr('transform', d => `translate(${projection(d.coordinates)})`)
    .attr('r', 10);

  svg.append('g')
    .selectAll('text')
    .data(points.features)
    .enter()
    .append('text')
    .text((d,i) => i)
    .attr('transform', d => `translate(${projection(d.coordinates)})`)
    .attr('text-anchor', 'middle')
    .attr('dy', 5);

});

};
