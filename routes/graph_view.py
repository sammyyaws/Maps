from fastapi import APIRouter,HTTPException
from graph import graph

router = APIRouter()

@router.get("/graph")
def get_graph():
    return {
        "nodes": list(graph.nodes.values()),
        "edges": list(graph.edges.values())
    }

@router.get("/graph/bfs/{start_node}")
def bfs_graph(start_node: int):
    if start_node not in graph.nodes:
        raise HTTPException(status_code=404, detail="Node not found")

    order = graph.bfs_traversal(start_node)

    return {
        "start": start_node,
        "bfs_order": order
    }
@router.get("/graph/dfs/{start_node}")
def dfs_graph(start_node: int):
    if start_node not in graph.nodes:
        raise HTTPException(status_code=404, detail="Node not found")

    order = graph.dfs_traversal(start_node)

    return {
        "start": start_node,
        "dfs_order": order
    }