from enum import Enum
from pydantic import BaseModel
from decimal import Decimal

class Operation(str, Enum):
    add = "add"
    subtract = "subtract"
    multiply = "multiply"
    divide = "divide"

class CalculateRequest(BaseModel):
    operation: Operation
    a: Decimal
    b: Decimal

class CalculateResponse(BaseModel):
    result: Decimal