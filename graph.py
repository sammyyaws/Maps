from typing import Dict, List, Tuple, Optional
from models import Node, Edge
from collections import deque
# In-memory graph data structure for managing nodes and edges
class Graph:
    def __init__(self):
        # Dictionary of node_id to Node objects
        self.nodes: Dict[int, Node] = {}
        # Dictionary of edge_id to Edge objects
        self.edges: Dict[int, Edge] = {}
        # Adjacency list: node_id -> list of (neighbor_id, weight)
        self.adjacency: Dict[int, List[Tuple[int, float]]] = {}
        # Auto-incrementing counter for node IDs
        self.node_id_counter = 1
        # Auto-incrementing counter for edge IDs
        self.edge_id_counter = 1

    # Add a new node to the graph
    def add_node(self, node: Node) -> Node:
        node.id = self.node_id_counter
        self.nodes[node.id] = node
        self.adjacency[node.id] = []
        self.node_id_counter += 1
        return node

    # Remove a node and all its connected edges
    def remove_node(self, node_id: int):
        if node_id in self.nodes:
            del self.nodes[node_id]
            del self.adjacency[node_id]
            # Remove edges connected to this node
            to_remove = [eid for eid, e in self.edges.items() if e.source == node_id or e.target == node_id]
            for eid in to_remove:
                self.remove_edge(eid)
    def edge_exists(self, source: int, target: int) -> bool:
     return any(n == target for n, _ in self.adjacency.get(source, []))
    # Add a new edge (connection) between two nodes
    def add_edge(self, edge: Edge) -> Edge:
     if edge.source == edge.target:
        return edge  # ignore self-loops

     if self.edge_exists(edge.source, edge.target):
        return edge  # or raise ValueError

     edge.id = self.edge_id_counter
     self.edges[edge.id] = edge

     self.adjacency[edge.source].append((edge.target, edge.weight))
     self.adjacency[edge.target].append((edge.source, edge.weight))

     self.edge_id_counter += 1
     return edge

    # Remove an edge by its ID
    def remove_edge(self, edge_id: int):
        if edge_id in self.edges:
            edge = self.edges[edge_id]
            self.adjacency[edge.source] = [t for t in self.adjacency[edge.source] if t[0] != edge.target]
            self.adjacency[edge.target] = [t for t in self.adjacency[edge.target] if t[0] != edge.source]
            del self.edges[edge_id]

    # Get all edges connected to a specific node
    def get_node_edges(self, node_id: int) -> List[Edge]:
        return [e for e in self.edges.values() if e.source == node_id or e.target == node_id]






    # Dijkstra's algorithm to find the shortest path between two nodes
    def dijkstra(self, source: int, target: int) -> Tuple[List[int], float]:
        import heapq
        queue = [(0, source, [])]
        visited = set()
        while queue:
            (cost, node, path) = heapq.heappop(queue)
            if node in visited:
                continue
            path = path + [node]
            if node == target:
                return path, cost
            visited.add(node)
            for neighbor, weight in self.adjacency.get(node, []):
                if neighbor not in visited:
                    heapq.heappush(queue, (cost + weight, neighbor, path))
        return [], float('inf')
    
    # bfs  reachable nodes
    def get_reachable_nodes(self, start: int):
     visited = set()
     queue = deque([start])

     reachable = []

     while queue:
        node = queue.popleft()

        if node in visited:
            continue

        visited.add(node)
        reachable.append(node)

        for neighbor, _ in self.adjacency.get(node, []):
            if neighbor not in visited:
                queue.append(neighbor)

     return reachable
#traversals
    def bfs_traversal(self, start: int):
     visited = set()
     queue = deque([start])
     order = []

     while queue:
        node = queue.popleft()

        if node in visited:
            continue

        visited.add(node)
        order.append(node)

        for neighbor, _ in self.adjacency.get(node, []):
            if neighbor not in visited:
                queue.append(neighbor)

     return order
 # dfs traversal part
    def dfs_traversal(self, start: int):
     visited = set()
     order = []

     def dfs(node: int):
        if node in visited:
            return

        visited.add(node)
        order.append(node)

        for neighbor, _ in self.adjacency.get(node, []):
            dfs(neighbor)

     dfs(start)
     return order
# Singleton instance of the graph used throughout the app
graph = Graph()