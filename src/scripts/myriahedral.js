const d3 = require('d3');
const geoProjection = require('d3-geo-projection');

var radians = Math.PI / 180,
degrees = 1 / radians;

function myriahedral(k, width, height, poly, faceProjection) {

  // it is possible to pass a specific projection on each face
  // by default is is a gnomonic projection centered on the face's centroid
  // scale 1 by convention
  var i = 0;
  faceProjection = faceProjection || function(face) {
    var c = d3.geoCentroid({type: "MultiPoint", coordinates: face});
    return d3.geoGnomonic()
      .scale(1)
      .translate([0, 0])
      .rotate([-c[0], -c[1]]);
  };

  // the faces from the polyhedron each yield
  // - face: its vertices
  // - contains: does this face contain a point?
  // - project: local projection on this face
  var faces = poly.map(function(face) {
    var polygon = face.slice();
    face = face.slice(0,-1);
    return {
      face: face,
      contains: function(lambda, phi) {
        // todo:  use geoVoronoi.find() instead?
        return d3.geoContains({ type: "Polygon", coordinates: [ polygon ] },
          [lambda * degrees, phi * degrees]);
      },
      project: faceProjection(face)
    };
  });

  // Build a tree of the faces, starting with face 0 (North Pole)
  // which has no parent (-1)
  var parents = [-1];
  var search = poly.length - 1;
  do {
    k.features.forEach(l => {
      var s = l.properties.source.index,
          t = l.properties.target.index;
      if (parents[s] !== undefined && parents[t] === undefined) {
        parents[t] = s;
        search --;
      }
      else if (parents[t] !== undefined && parents[s] === undefined) {
        parents[s] = t;
        search --;
      }
    });
  } while (search > 0);

  // console.log('vertices', JSON.stringify(vertices));
  // console.log('parents', JSON.stringify(parents));

  parents
  .forEach(function(d, i) {
    var node = faces[d];
    node && (node.children || (node.children = [])).push(faces[i]);
  });

  // console.log('faces', faces);


  // Polyhedral projection
  var proj = geoProjection.geoPolyhedral(faces[0], function(lambda, phi) {
      for (var i = 0; i < faces.length; i++) {
        if (faces[i].contains(lambda, phi)) return faces[i];
      }
    },
    (72 * 1.5) * radians    // rotation of the root face in the projected (pixel) space
  )
  .rotate([-8,0,-32])
  .fitExtent([[20,20],[width-20, height-20]], {type:"Sphere"})

    proj.faces = faces;
    return proj;
}

module.exports = myriahedral;
