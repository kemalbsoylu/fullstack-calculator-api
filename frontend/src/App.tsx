import { useState } from 'react';
import './App.css';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

interface CalculateRequest {
  operation: Operation;
  a: number;
  b: number;
}

interface CalculateResponse {
  result: number;
}

interface ErrorResponse {
  detail: string;
}

function App() {
  const [display, setDisplay] = useState<string>('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<Operation | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForNewValue(false);
    setError(null);
  };

  const inputDigit = (digit: string) => {
    setError(null);
    if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    setError(null);
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (nextOperator: Operation) => {
    setError(null);
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator && !waitingForNewValue) {
      // If the user hasn't typed a new number yet, they're just changing the operator.
      // If they have typed a new number, ideally we calculate the intermediate result here.
      // But keeping it simple for the requirements.
    }
    
    setOperator(nextOperator);
    setWaitingForNewValue(true);
  };

  const calculate = async () => {
    if (firstOperand === null || operator === null) {
      return;
    }

    const b = parseFloat(display);
    const payload: CalculateRequest = {
      operation: operator,
      a: firstOperand,
      b: b
    };

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        throw new Error(errorData.detail || 'Calculation failed');
      }

      const data: CalculateResponse = await response.json();
      setDisplay(String(data.result));
      setFirstOperand(data.result);
      setOperator(null);
      setWaitingForNewValue(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="calculator-container">
      <div className="calculator">
        <div className="display">
          <div className="error-screen">{error && <span className="error-text">{error}</span>}</div>
          <div className="main-display">{display}</div>
        </div>

        <div className="keypad">
          <button className="btn clear span-2-col" onClick={clear}>C</button>
          <button className="btn operator" onClick={() => handleOperator('divide')}>÷</button>
          <button className="btn operator" onClick={() => handleOperator('multiply')}>×</button>
          
          <button className="btn" onClick={() => inputDigit('7')}>7</button>
          <button className="btn" onClick={() => inputDigit('8')}>8</button>
          <button className="btn" onClick={() => inputDigit('9')}>9</button>
          <button className="btn operator" onClick={() => handleOperator('subtract')}>−</button>
          
          <button className="btn" onClick={() => inputDigit('4')}>4</button>
          <button className="btn" onClick={() => inputDigit('5')}>5</button>
          <button className="btn" onClick={() => inputDigit('6')}>6</button>
          <button className="btn operator" onClick={() => handleOperator('add')}>+</button>

          <button className="btn" onClick={() => inputDigit('1')}>1</button>
          <button className="btn" onClick={() => inputDigit('2')}>2</button>
          <button className="btn" onClick={() => inputDigit('3')}>3</button>
          <button className="btn equals span-2-row" onClick={calculate} disabled={isLoading}>=</button>

          <button className="btn span-2-col" onClick={() => inputDigit('0')}>0</button>
          <button className="btn" onClick={inputDecimal}>.</button>
        </div>
      </div>
    </div>
  );
}

export default App;
