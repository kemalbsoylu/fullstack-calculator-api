# FullStack Calculator API

A fullstack calculator application featuring a clean, responsive React frontend and a robust Python/FastAPI backend microservice. 

## Tech Stack
* **Backend:** Python 3.12, FastAPI, Pydantic, Pytest. Managed with `uv`.
* **Frontend:** React, TypeScript, Vite, Vitest. Native CSS without external UI libraries.

## Setup & Installation

### Backend (FastAPI)
The backend uses standard Python with `uv` for dependency management.

1. Ensure you are in the project root directory.
2. Install dependencies (assuming you have `uv` installed):
   ```bash
   uv pip install -r pyproject.toml
   ```
3. Run the development server:
   ```bash
   uv run uvicorn backend.main:app --reload
   ```
   *The API will be available at `http://127.0.0.1:8000`*

   *Swagger API documentation is available at `http://127.0.0.1:8000/docs`*

### Frontend (React/Vite)
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The UI will be available at `http://localhost:5173`*

## Testing & Coverage

Both layers feature comprehensive unit testing with coverage reporting.

### Backend Tests (pytest)
From the project root directory, run the test suite and view the coverage report:
```bash
uv run pytest --cov=backend --cov-report=term-missing
```

### Frontend Tests (Vitest)
From the `frontend` directory, run the test suite:
```bash
npm run test
```
To generate the coverage report:
```bash
npm run coverage
```

## API Usage Examples

The backend exposes a single RESTful endpoint for calculations, expecting strict typing via Pydantic.

**POST `/api/calculate`**

```json
// Request (Binary Operation)
{
  "operation": "add",
  "a": "15.5",
  "b": "4.2"
}

// Response (200 OK)
{
  "result": "19.7"
}
```

*Note: Operands are passed as strings to ensure floating-point precision is maintained when parsed by the backend. For unary operations like `sqrt` or `percentage`, the `b` parameter can be omitted or sent as `"0"`.*

## Design Decisions & Assumptions

1. **Language Selection:** Python and FastAPI were chosen to prioritize shipping a highly testable, functional MVP. Furthermore, Python's native `decimal` module provided a robust, built-in solution for the precision floating-point arithmetic required by a calculator without needing to implement custom math libraries.
2. **Precision over Speed:** Standard floating-point math often introduces subtle inaccuracies (e.g., `0.1 + 0.2 = 0.30000000000000004`). To prevent this, the Python backend casts all incoming string operands to `Decimal` before performing any arithmetic, ensuring absolute correctness.
3. **Stateless API:** The backend handles no state. The React frontend is entirely responsible for managing the calculator's state machine, tracking the first operand, the operator, and handling the transition into a finalized state.
4. **Lean Frontend Architecture:** To prioritize maintainability and avoid infrastructure bloat, the frontend avoids heavy state management libraries (like Redux) or complex data fetching tools (like React Query or Axios). Native `useState` and `fetch` were used to deliver the UI quickly. The responsive grid design relies on native CSS `max-width` properties to ensure mobile support without importing UI component frameworks.

## Future Optimizations
* Add comprehensive visual calculation history.
* Refine the state machine to allow seamless multi-operator chaining before equality (e.g., `2 + 3 * 4`).
