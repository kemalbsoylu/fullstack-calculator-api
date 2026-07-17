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

## Phase 3: Testing & Coverage Expansion

**Goal:** Expand the test suites for both the React frontend (Vitest) and FastAPI backend (pytest) to achieve high test coverage across all mathematical operations, UI state changes, and error edge cases.

**Frontend Prompt:**
Expand the Vitest test suite for a React calculator application to increase coverage.
The current `App.test.tsx` covers basic rendering and a simple addition workflow. I need you to write additional test cases using React Testing Library to cover the remaining logical branches in the state machine.

Please provide the updated `App.test.tsx` file with new `it()` blocks covering the following scenarios:
1. Unary Operations: Test the `calculateImmediate` logic. Simulate a user clicking "9" then "√" and verify the mocked fetch payload and UI update. Do the same for "%".
2. Error Handling & Guards: 
   - Mock a `500 Server Error` fetch response and verify the UI displays the graceful fallback error message.
   - Simulate typing "-5" and clicking "√", verifying the UI blocks the network request and displays "Cannot calculate square root of a negative number".
3. State Modifiers: Test the `C` (Clear) button resetting the display to '0', the `DEL` button removing the last digit, and the `±` toggle sign button.
4. Decimals: Test typing "0.5" to ensure the decimal input logic works without duplicate periods.

Use `globalThis.fetch = vi.fn() as any;` for mocking, and keep the assertions strictly focused on the DOM state (`screen.getByText`) and the `fetch` arguments.

**Backend Prompt:**
Expand the `pytest` suite for a FastAPI calculator backend to achieve high coverage, specifically targeting edge cases and error handling.
The current `test_main.py` covers basic binary operations (+, -, *, /) and a division-by-zero edge case. We recently added exponentiation, square roots, and percentages.

Please provide the updated `test_main.py` file with new test functions covering the following:
1. New Operations: Add successful test cases for `power`, `sqrt`, and `percentage` targeting the `POST /api/calculate` endpoint.
2. Edge Cases & Exceptions:
   - Test `power` with an excessively large exponent that triggers the `decimal.Overflow` catch block (expecting a 400 status code).
   - Test `sqrt` with a negative number (e.g., -9) to trigger the ValueError catch block (expecting a 400 status code).
3. Validation: Ensure that the default `b` value schema works correctly when sending a payload for a unary operation (like `sqrt`) without the `b` field included.

Write idiomatic, clean `pytest` code using the FastAPI `TestClient`.
