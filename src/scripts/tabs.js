var generateCutOutTab = function(svg, line1, outDistance, inDistance, direction) {
  var t = calcLineTranslation(outDistance, line1, direction);

  var x1 = line1[0].x - t.dx,
      y1 = line1[0].y - t.dy,
      x2 = line1[1].x - t.dx,
      y2 = line1[1].y - t.dy;

  var newLine = [{x: x1, y: y1},{x: x2, y: y2}];

  var point1 = calcPointOnLine(newLine, inDistance),
      point2 = calcPointOnLine(newLine, 1 - inDistance);

  var tab = svg.append("g")
    .attr("id", "tabs")

  var line2 = tab.append("line")
    .attr("x1", point1.x)
    .attr("y1", point1.y)
    .attr("x2", point2.x)
    .attr("y2", point2.y);

  var connector1 = tab.append("line")
    .attr("x1", line1[0].x)
    .attr("y1", line1[0].y)
    .attr("x2", point1.x)
    .attr("y2", point1.y);

  var connector2 = tab.append("line")
    .attr("x1", line1[1].x)
    .attr("y1", line1[1].y)
    .attr("x2", point2.x)
    .attr("y2", point2.y);
}

function calcLineTranslation(distance, line1, direction) {
  var x1_x0 = line1[1].x - line1[0].x,
      y1_y0 = line1[1].y - line1[0].y,
      x2_x0, y2_y0;

  if (y1_y0 === 0) {
    x2_x0 = 0;
    y2_y0 = distance;
  } else {
    var angle = Math.atan((x1_x0) / (y1_y0));
    x2_x0 = direction * distance * Math.cos(angle) * -1;
    y2_y0 = direction * distance * Math.sin(angle);
  }

  return {
    dx: x2_x0,
    dy: y2_y0
  };
}

function calcPointOnLine(line1, percent) {
  var x1_x0 = line1[1].x - line1[0].x,
      y1_y0 = line1[1].y - line1[0].y;

  var newX = line1[0].x + percent*x1_x0,
      newY = line1[0].y + percent*y1_y0;

  return {
    x: newX,
    y: newY
  }
}

module.exports = {
  addTabs: generateCutOutTab
};
