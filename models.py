from pydantic import BaseModel
from typing import List, Optional

# Pydantic models for nodes, edges, and routing requests/responses.

# Represents a location (node) with optional name and GPS coordinates.
class Node(BaseModel):
    id: int  # Unique identifier for the node
    name: Optional[str] = None  # Optional name for the location
    latitude: float  # Latitude of the location
    longitude: float  # Longitude of the location

# Model for creating a new node (no id needed).
class NodeCreate(BaseModel):
    name: Optional[str] = None  # Optional name for the location
    latitude: float  # Latitude of the location
    longitude: float  # Longitude of the location

# Represents a connection (edge) between two nodes, with a weight (distance).
class Edge(BaseModel):
    id: int  # Unique identifier for the edge
    source: int  # Source node id
    target: int  # Target node id
    weight: float  # Weight or distance between nodes

# Model for creating a new edge (no id needed).
class EdgeCreate(BaseModel):
    source: int  # Source node id
    target: int  # Target node id
    weight: float  # Weight or distance between nodes

# Request model for finding a route between two nodes.
class RouteRequest(BaseModel):
    source: int  # Source node id
    target: int  # Target node id

# Response model for returning the shortest path and its distance.
class RouteResponse(BaseModel):
    path: List[int]  # List of node ids representing the path
    distance: float  # Total distance of the path