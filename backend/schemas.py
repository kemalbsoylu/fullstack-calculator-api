from enum import Enum
from pydantic import BaseModel
from decimal import Decimal

class Operation(str, Enum):
    add = "add"
    subtract = "subtract"
    multiply = "multiply"
    divide = "divide"
    power = "power"
    sqrt = "sqrt"
    percentage = "percentage"

class CalculateRequest(BaseModel):
    operation: Operation
    a: Decimal
    b: Decimal = Decimal('0')

class CalculateResponse(BaseModel):
    result: Decimal