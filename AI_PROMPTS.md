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

## Phase 2: Frontend Foundation

**Goal:** Initialize the Vite React app, build the calculator UI, and wire it up to the FastAPI backend.

**Prompt:**
Create a clean, functional React frontend for a calculator application using TypeScript and Vite. The backend is already running and accepting POST requests at `http://localhost:8000/api/calculate`.

Please provide the following:
1. The exact terminal command to create the Vite app (React + TS) named `frontend`.
2. `src/App.tsx`: The main calculator component. It should include:
   - A display screen showing the current input sequence and the result.
   - A grid of buttons for numbers 0-9, a decimal point, and operations (+, -, *, /).
   - An equals (=) button to trigger the calculation.
   - A clear (C) button to reset the state.
   - UI state to display error messages gracefully (e.g., catching 400 Bad Request for "Cannot divide by zero").
3. The logic to handle the calculator state machine (first operand, operator, second operand). Upon pressing equals, construct the `a`, `b`, and `operation` payload and send a POST request to the backend using native `fetch`.
4. `src/App.css`: Clean, modern CSS styling for a responsive calculator grid. Keep the layout centered, professional, and intuitive.

Focus on clean code, proper TypeScript typing for the fetch payload and responses, and maintainability.
