from enum import Enum
from pydantic import BaseModel

class Operation(str, Enum):
    add = "add"
    subtract = "subtract"
    multiply = "multiply"
    divide = "divide"

class CalculateRequest(BaseModel):
    operation: Operation
    a: float
    b: float

class CalculateResponse(BaseModel):
    result: float
