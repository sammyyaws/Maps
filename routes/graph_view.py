from fastapi import APIRouter
from graph import graph

router = APIRouter()

@router.get("/graph")
def get_graph():
    return {
        "nodes": list(graph.nodes.values()),
        "edges": list(graph.edges.values())
    }
