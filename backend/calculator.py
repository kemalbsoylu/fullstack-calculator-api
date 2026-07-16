from decimal import Decimal, InvalidOperation, Overflow

def add(a: Decimal, b: Decimal) -> Decimal:
    return a + b

def subtract(a: Decimal, b: Decimal) -> Decimal:
    return a - b

def multiply(a: Decimal, b: Decimal) -> Decimal:
    return a * b

def divide(a: Decimal, b: Decimal) -> Decimal:
    if b == Decimal('0'):
        raise ValueError("Cannot divide by zero")
    return a / b

def power(a: Decimal, b: Decimal) -> Decimal:
    try:
        return a ** b
    except (InvalidOperation, Overflow):
        raise ValueError("Result too large or mathematically invalid")

def sqrt(a: Decimal) -> Decimal:
    if a < Decimal('0'):
        raise ValueError("Cannot calculate square root of a negative number")
    return a.sqrt()

def percentage(a: Decimal) -> Decimal:
    return a / Decimal('100')
