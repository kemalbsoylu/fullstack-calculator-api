## Phase 1: Backend Foundation

**Goal:** Generate the FastAPI structure, core calculator logic, and unit tests, ensuring logic is decoupled from API routing. 

**Prompt:**
Create a clean, production-ready FastAPI backend for a calculator microservice. The code should be placed in the `backend/` directory.

Please provide the following files:
1. `backend/calculator.py`: Pure Python functions for addition, subtraction, multiplication, and division. Handle edge cases like division by zero by raising a standard Python `ValueError`.
2. `backend/schemas.py`: Pydantic models for the request and response payloads. Create an `Operation` Enum (add, subtract, multiply, divide) to enforce strict validation on the incoming request.
3. `backend/main.py`: The FastAPI application. Include CORS middleware allowing all localhost origins (for the upcoming React frontend). Create a single RESTful endpoint `POST /api/calculate` that accepts the Pydantic schema. Catch the `ValueError`s from the calculator logic and return clean `400 Bad Request` HTTP responses.
4. `backend/test_main.py`: `pytest` unit tests covering the core logic, the API endpoint, and error cases (especially division by zero and invalid operation types).

Write clean, typed Python 3.12 code. Prioritize readability and maintainability.
