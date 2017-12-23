// https://github.com/mikolalysenko/union-find
UnionFind = (function() {

"use strict"; "use restrict";


function UnionFind(count) {
  this.roots = new Array(count);
  this.ranks = new Array(count);
  
  for(var i=0; i<count; ++i) {
    this.roots[i] = i;
    this.ranks[i] = 0;
  }
}

var proto = UnionFind.prototype

Object.defineProperty(proto, "length", {
  "get": function() {
    return this.roots.length
  }
})

proto.makeSet = function() {
  var n = this.roots.length;
  this.roots.push(n);
  this.ranks.push(0);
  return n;
}

proto.find = function(x) {
  var x0 = x
  var roots = this.roots;
  while(roots[x] !== x) {
    x = roots[x]
  }
  while(roots[x0] !== x) {
    var y = roots[x0]
    roots[x0] = x
    x0 = y
  }
  return x;
}

proto.link = function(x, y) {
  var xr = this.find(x)
    , yr = this.find(y);
  if(xr === yr) {
    return;
  }
  var ranks = this.ranks
    , roots = this.roots
    , xd    = ranks[xr]
    , yd    = ranks[yr];
  if(xd < yd) {
    roots[xr] = yr;
  } else if(yd < xd) {
    roots[yr] = xr;
  } else {
    roots[yr] = xr;
    ++ranks[xr];
  }
}

	return UnionFind;
})()

function kruskal(graph, dist) {
// 1   A := ø
	const A = [];
// 2   pour chaque sommet v de G :
// 3      créerEnsemble(v)
  let n = -Infinity;
  graph.forEach(l => {
    if (l.source.index > n) n = l.source.index;
    if (l.target.index > n) n = l.target.index;
  })
  const uf = new UnionFind(n);
// 4   trier les arêtes de G par poids croissant
	graph = graph.map(l => {
		l.w = l.length || dist(l.source, l.target);
		return l;
	})
  graph.sort((a,b) => d3.ascending(a.w, b.w))
// 5   pour chaque arête (u, v) de G prise par poids croissant :
  .forEach(l => {
// 6      si find(u) ≠ find(v) :
		if (uf.find(l.source.index) != uf.find(l.target.index)) {
// 7         ajouter l'arête (u, v) à l'ensemble A
			A.push(l);
// 8         union(u, v)
			uf.link(l.source.index, l.target.index);
		}
	});
// 9   retourner A
	return A;
//	yield uf;
}