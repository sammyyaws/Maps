from fastapi import APIRouter, HTTPException
from models import RouteRequest, RouteResponse
from graph import graph

# Router for routing-related endpoints (shortest path, distance)
router = APIRouter()

# Get the shortest path between two nodes using Dijkstra's algorithm
@router.post("/route/shortest", response_model=RouteResponse)
def shortest_route(req: RouteRequest):
    if req.source not in graph.nodes or req.target not in graph.nodes:
        raise HTTPException(status_code=404, detail="Source or target node not found")
    path, distance = graph.dijkstra(req.source, req.target)
    if not path:
        raise HTTPException(status_code=404, detail="No path found")
    return RouteResponse(path=path, distance=distance)

# Get the distance between two nodes (without returning the path)
@router.post("/route/distance")
def route_distance(req: RouteRequest):
    if req.source not in graph.nodes or req.target not in graph.nodes:
        raise HTTPException(status_code=404, detail="Source or target node not found")
    _, distance = graph.dijkstra(req.source, req.target)
    if distance == float('inf'):
        raise HTTPException(status_code=404, detail="No path found")
    return {"distance": distance}