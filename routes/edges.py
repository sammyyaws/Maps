from fastapi import APIRouter, HTTPException
from typing import List
from models import Edge, EdgeCreate
from graph import graph

# Router for edge-related endpoints
router = APIRouter()

# Create a new edge (connection between two nodes)
@router.post("/edges", response_model=Edge)
def create_edge(edge: EdgeCreate):
    if edge.source not in graph.nodes or edge.target not in graph.nodes:
        raise HTTPException(status_code=404, detail="Source or target node not found")
    new_edge = Edge(id=0, **edge.dict())
    return graph.add_edge(new_edge)

# Get all edges (connections)
@router.get("/edges", response_model=List[Edge])
def get_edges():
    return list(graph.edges.values())

# Get all edges connected to a specific node
@router.get("/nodes/{node_id}/edges", response_model=List[Edge])
def get_node_edges(node_id: int):
    if node_id not in graph.nodes:
        raise HTTPException(status_code=404, detail="Node not found")
    return graph.get_node_edges(node_id)
