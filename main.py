# Main entry point for the FastAPI application.
from fastapi import FastAPI
from routes.nodes import router as nodes_router  # Endpoints for node management
from routes.edges import router as edges_router  # Endpoints for edge management
from routes.routing import router as routing_router  # Endpoints for routing/shortest path
from routes.graph_view import router as graph_view_router  # Endpoint for full graph view

# Create FastAPI app instance
app = FastAPI()

# Include routers for different API sections
app.include_router(nodes_router)
app.include_router(edges_router)
app.include_router(routing_router)
app.include_router(graph_view_router)

# Home route for API health check
@app.get("/")
def home():
    return {"message": "Campus Navigation API"}