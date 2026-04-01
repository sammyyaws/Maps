# Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process  
# use the above to activate the venv in powershell

import uvicorn 
from fastapi import FastAPI 
from pydantic import BaseModel 
from collections import deque  

graph = {} 

app = FastAPI() 

current_location = None 


# Home route 
@app.get("/")
def home():
    return{"message":"Campus Navigation API"} 

