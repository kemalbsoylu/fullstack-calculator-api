from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_add():
    response = client.post("/api/calculate", json={"operation": "add", "a": 5, "b": 3})
    assert response.status_code == 200
    assert response.json() == {"result": "8"}

def test_subtract():
    response = client.post("/api/calculate", json={"operation": "subtract", "a": 5, "b": 3})
    assert response.status_code == 200
    assert response.json() == {"result": "2"}

def test_multiply():
    response = client.post("/api/calculate", json={"operation": "multiply", "a": 5, "b": 3})
    assert response.status_code == 200
    assert response.json() == {"result": "15"}

def test_divide():
    response = client.post("/api/calculate", json={"operation": "divide", "a": 6, "b": 3})
    assert response.status_code == 200
    assert response.json() == {"result": "2"}

def test_divide_by_zero():
    response = client.post("/api/calculate", json={"operation": "divide", "a": 5, "b": 0})
    assert response.status_code == 400
    assert response.json() == {"detail": "Cannot divide by zero"}

def test_invalid_operation():
    response = client.post("/api/calculate", json={"operation": "modulus", "a": 5, "b": 3})
    assert response.status_code == 422 # Pydantic validation error

def test_missing_field():
    response = client.post("/api/calculate", json={"operation": "add", "b": 5})
    assert response.status_code == 422 # Pydantic validation error

def test_decimal_precision():
    response = client.post("/api/calculate", json={"operation": "add", "a": 0.1, "b": 0.2})
    assert response.status_code == 200
    assert response.json() == {"result": "0.3"}

def test_power():
    response = client.post("/api/calculate", json={"operation": "power", "a": 2, "b": 3})
    assert response.status_code == 200
    assert response.json() == {"result": "8"}

def test_sqrt():
    response = client.post("/api/calculate", json={"operation": "sqrt", "a": 16})
    assert response.status_code == 200
    assert response.json() == {"result": "4"}

def test_percentage():
    response = client.post("/api/calculate", json={"operation": "percentage", "a": 50})
    assert response.status_code == 200
    assert response.json() == {"result": "0.5"}

def test_power_overflow():
    # An excessively large exponent to trigger decimal.Overflow
    response = client.post("/api/calculate", json={"operation": "power", "a": 9, "b": 999999999})
    assert response.status_code == 400
    assert "Result too large or mathematically invalid" in response.json()["detail"]

def test_sqrt_negative():
    response = client.post("/api/calculate", json={"operation": "sqrt", "a": -9})
    assert response.status_code == 400
    assert "Cannot calculate square root of a negative number" in response.json()["detail"]

def test_unary_operation_missing_b():
    # b field should default to 0 and work correctly without being in the payload
    response = client.post("/api/calculate", json={"operation": "sqrt", "a": 25})
    assert response.status_code == 200
    assert response.json() == {"result": "5"}
