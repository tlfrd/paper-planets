const d3 = require('d3');
const UnionFind = require('union-find');

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

module.exports = kruskal;
