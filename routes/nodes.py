from fastapi import APIRouter, HTTPException
from typing import List
from models import Node, NodeCreate
from graph import graph

# Router for node-related endpoints
router = APIRouter()

# Create a new node (location)
@router.post("/nodes", response_model=Node)
def create_node(node: NodeCreate):
    new_node = Node(id=0, **node.dict())  # id will be set by the graph logic
    return graph.add_node(new_node)

# Get all nodes (locations)
@router.get("/nodes", response_model=List[Node])
def get_nodes():
    return list(graph.nodes.values())

# Get a single node by its id
@router.get("/nodes/{node_id}", response_model=Node)
def get_node(node_id: int):
    node = graph.nodes.get(node_id)
    if not node:
        raise HTTPException(status_code=404, detail="Node not found")
    return node

