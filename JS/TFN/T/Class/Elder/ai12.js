//knowledge graph

class KnowledgeGraph {
  constructor() {
    this.nodes = {};
    this.edges = [];
  }

  connect(a, b, relation) {
    this.edges.push({ a, b, relation });
  }
}