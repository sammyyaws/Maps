#  MapOut – Campus Navigation System

MapOut is a graph-based campus navigation system that allows users to create locations, connect them as paths, and visualize routes on an interactive map.

This project demonstrates the use of **graph data structures** (nodes and edges) combined with a **React frontend** and a **FastAPI backend**.

---

##  Features

Add campus locations (nodes)
-  Connect locations with paths (edges)
-  Visualize connections on a live map (Leaflet)
-  Real-time GPS tracking
-  Graph-based backend (Adjacency List)
-  Shortest path computation (Dijkstra’s Algorithm)
   REST API for managing nodes and edges

---

## Concepts Used

- Graph Data Structure
- Adjacency List Representation
- Depth-First Search (DFS)
- Breadth-First Search (BFS)
- Dijkstra’s Shortest Path Algorithm
- RESTful API Design
- State Management in React

---

## Tech Stack

### Frontend
- React.js
- React Hooks (`useState`, `useEffect`)
- Leaflet (Map rendering)

### Backend
- FastAPI
- Python
- Pydantic Models

---


---

##  How It Works

1. Users click on the map to create locations (nodes).
2. Nodes are sent to the backend and stored in a graph.
3. When multiple nodes are selected, edges are created between them.
4. The backend maintains an adjacency list to represent connections.
5. The frontend fetches edges and draws them as lines on the map.
6. Graph algorithms (DFS, BFS, Dijkstra) operate on this structure.

---

##  Getting Started

### 1. Clone the repository
### 2. Backend Setup (FastAPI)


---

##  API Endpoints

### Nodes
- `POST /nodes` → Create node
- `GET /nodes` → Get all nodes
- `GET /nodes/{id}` → Get single node

### Edges
- `POST /edges` → Create edge
- `GET /edges` → Get all edges
- `GET /nodes/{id}/edges` → Get edges of a node



### Routing & Graph Algorithms

- `POST /route/shortest` → Get shortest path (Dijkstra)
- `GET /graph/dfs/{start_node}` → Perform Depth-First Search (DFS)
- `GET /graph/bfs/{start_node}` → Perform Breadth-First Search (BFS)
- `POST /route/distance` → Get distance between nodes




