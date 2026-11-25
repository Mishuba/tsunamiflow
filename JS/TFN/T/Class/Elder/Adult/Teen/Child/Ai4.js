import { AiBasic } from "./Toddler/Ai3";


export class Aiintermedi extends AiBasic {

    constructor() {

    }
    addNode(id, data = {}) {
        if (!id) throw new Error('Node id is required');
        this.nodes[id] = { id, ...data };
        return this.nodes[id];
    }

    getNode(id) {
        return this.nodes[id] || null;
    }

    removeNode(id) {
        delete this.nodes[id];
        this.edges = this.edges.filter(edge => edge.a !== id && edge.b !== id);
    }

    connect(a, b, relation, directed = true, metadata = {}) {
        if (!this.nodes[a] || !this.nodes[b]) {
            throw new Error('Both nodes must exist before connecting them');
        }
        this.edges.push({ a, b, relation, directed, metadata });
    }

    removeEdge(a, b, relation) {
        this.edges = this.edges.filter(edge => !(edge.a === a && edge.b === b && edge.relation === relation));
    }

    getEdges(filter = {}) {
        return this.edges.filter(edge => {
            return Object.entries(filter).every(([key, value]) => edge[key] === value);
        });
    }

    getNeighbors(id, relation = null, direction = 'outgoing') {
        const neighbors = new Set();
        for (const edge of this.edges) {
            if (direction !== 'incoming' && edge.a === id && (!relation || edge.relation === relation)) {
                neighbors.add(edge.b);
            }
            if (direction !== 'outgoing' && edge.b === id && (!relation || edge.relation === relation)) {
                neighbors.add(edge.a);
            }
            if (!edge.directed && edge.a === id && !relation) {
                neighbors.add(edge.b);
            }
            if (!edge.directed && edge.b === id && !relation) {
                neighbors.add(edge.a);
            }
        }
        return Array.from(neighbors).map(nodeId => this.getNode(nodeId));
    }

    findPath(start, end, maxDepth = 5) {
        const visited = new Set();
        const path = [];
        const results = [];

        const dfs = (current, depth) => {
            if (depth > maxDepth) return;
            if (current === end) {
                results.push([...path]);
                return;
            }
            visited.add(current);
            for (const edge of this.getEdges({ a: current })) {
                if (!visited.has(edge.b)) {
                    path.push(edge);
                    dfs(edge.b, depth + 1);
                    path.pop();
                }
            }
            visited.delete(current);
        };

        dfs(start, 0);
        return results;
    }

    KnowledgetoJSON() {
        return JSON.stringify({ nodes: this.nodes, edges: this.edges });
    }

    static KnowledgefromJSON(json) {
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        const graph = new KnowledgeGraph();
        graph.nodes = { ...data.nodes };
        graph.edges = Array.isArray(data.edges) ? [...data.edges] : [];
        return graph;
    }
} 