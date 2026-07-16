from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import CalculateRequest, CalculateResponse, Operation
import backend.calculator as calculator

app = FastAPI(title="Calculator API")

# Add CORS middleware for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/calculate", response_model=CalculateResponse)
def calculate(request: CalculateRequest):
    try:
        if request.operation == Operation.add:
            result = calculator.add(request.a, request.b)
        elif request.operation == Operation.subtract:
            result = calculator.subtract(request.a, request.b)
        elif request.operation == Operation.multiply:
            result = calculator.multiply(request.a, request.b)
        elif request.operation == Operation.divide:
            result = calculator.divide(request.a, request.b)
        elif request.operation == Operation.power:
            result = calculator.power(request.a, request.b)
        elif request.operation == Operation.sqrt:
            result = calculator.sqrt(request.a)
        elif request.operation == Operation.percentage:
            result = calculator.percentage(request.a)
        else:
            # Should not be reached due to Pydantic Enum validation
            raise ValueError(f"Unknown operation: {request.operation}")

        return CalculateResponse(result=result)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
