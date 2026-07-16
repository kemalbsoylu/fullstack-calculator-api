import { useState } from 'react';
import './App.css';

type Operation = 'add' | 'subtract' | 'multiply' | 'divide' | 'power';
type UnaryOperation = 'sqrt' | 'percentage';

interface CalculateRequest {
  operation: Operation | UnaryOperation;
  a: string;
  b: string;
}

interface CalculateResponse {
  result: string;
}

interface ErrorResponse {
  detail: string;
}

function App() {
  const [display, setDisplay] = useState<string>('0');
  const [historyDisplay, setHistoryDisplay] = useState<string>('');
  const [firstOperand, setFirstOperand] = useState<string | null>(null);
  const [operator, setOperator] = useState<Operation | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState<boolean>(false);
  const [isCalculated, setIsCalculated] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getOperatorSymbol = (op: Operation) => {
    switch (op) {
      case 'add': return '+';
      case 'subtract': return '−';
      case 'multiply': return '×';
      case 'divide': return '÷';
      case 'power': return '^';
      default: return '';
    }
  };

  const clear = () => {
    setDisplay('0');
    setHistoryDisplay('');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForNewValue(false);
    setIsCalculated(false);
    setError(null);
  };

  const deleteLast = () => {
    if (waitingForNewValue) return;

    if (isCalculated) {
      setIsCalculated(false);
      setHistoryDisplay('');
      setFirstOperand(null);
      setOperator(null);
    }

    if (display.length > 1) {
      if (display.length === 2 && display.startsWith('-')) {
        setDisplay('0');
      } else {
        setDisplay(display.slice(0, -1));
      }
    } else {
      setDisplay('0');
    }
  };

  const toggleSign = () => {
    if (display === '0') return;

    const newDisplay = display.startsWith('-') ? display.slice(1) : '-' + display;
    setDisplay(newDisplay);

    // If toggled after a calculation, treat it as a new input rather than chaining
    if (isCalculated) {
      setIsCalculated(false);
      setHistoryDisplay('');
      setFirstOperand(null);
      setOperator(null);
    }
  };

  const inputDigit = (digit: string) => {
    setError(null);

    if (isCalculated) {
      // Start fresh if a number is typed immediately after a result
      setDisplay(digit);
      setFirstOperand(null);
      setOperator(null);
      setHistoryDisplay('');
      setIsCalculated(false);
      setWaitingForNewValue(false);
    } else if (waitingForNewValue) {
      setDisplay(digit);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    setError(null);

    if (isCalculated) {
      setDisplay('0.');
      setFirstOperand(null);
      setOperator(null);
      setHistoryDisplay('');
      setIsCalculated(false);
      setWaitingForNewValue(false);
      return;
    }

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

    if (operator && waitingForNewValue && !isCalculated) {
      setOperator(nextOperator);
      setHistoryDisplay(`${firstOperand} ${getOperatorSymbol(nextOperator)}`);
      return;
    }

    if (isCalculated) {
      // Chain the calculation using the previous result
      setIsCalculated(false);
      setOperator(nextOperator);
      setHistoryDisplay(`${display} ${getOperatorSymbol(nextOperator)}`);
      setWaitingForNewValue(true);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(display);
    }

    setOperator(nextOperator);
    setHistoryDisplay(`${display} ${getOperatorSymbol(nextOperator)}`);
    setWaitingForNewValue(true);
  };

const calculateImmediate = async (op: UnaryOperation) => {
    // Guard: Prevent negative square root network spam
    if (op === 'sqrt' && parseFloat(display) < 0) {
      setError("Cannot calculate square root of a negative number");
      return;
    }

    setIsLoading(true);
    setError(null);

    // b is required by schema, but backend math ignores it for unary operations
    const payload: CalculateRequest = {
      operation: op,
      a: display,
      b: "0"
    };

    try {
      const response = await fetch('http://localhost:8000/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        let errorMessage = 'Calculation failed';
        try {
          const errorData: ErrorResponse = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          errorMessage = `Server Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data: CalculateResponse = await response.json();

      if (op === 'sqrt') {
         setHistoryDisplay(`√${display} =`);
      } else {
         setHistoryDisplay(`${display}% =`);
      }

      setDisplay(String(data.result));
      setFirstOperand(String(data.result));
      setOperator(null);
      setWaitingForNewValue(true);
      setIsCalculated(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const calculate = async () => {
    if (firstOperand === null || operator === null || waitingForNewValue) {
      return;
    }

    if (operator === 'divide' && parseFloat(display) === 0) {
      setError("Cannot divide by zero");
      return;
    }

    const payload: CalculateRequest = {
      operation: operator,
      a: firstOperand,
      b: display
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
        let errorMessage = 'Calculation failed';
        try {
          const errorData: ErrorResponse = await response.json();
          errorMessage = errorData.detail || errorMessage;
        } catch {
          errorMessage = `Server Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const data: CalculateResponse = await response.json();

      setHistoryDisplay(`${firstOperand} ${getOperatorSymbol(operator)} ${display} =`);
      setDisplay(String(data.result));
      setFirstOperand(String(data.result));
      setOperator(null);
      setWaitingForNewValue(true);
      setIsCalculated(true);
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
          <div className="history-display" style={{ fontSize: '0.8em', color: '#888', minHeight: '1.2em', textAlign: 'right' }}>
            {historyDisplay}
          </div>
          <div className="main-display">{display}</div>
        </div>

        <div className="keypad">
          {/* Row 1: Controls & Modifiers */}
          <button className="btn clear" onClick={clear}>C</button>
          <button className="btn delete" onClick={deleteLast}>DEL</button>
          <button className="btn" onClick={toggleSign}>±</button>
          <button className="btn operator" onClick={() => handleOperator('divide')}>÷</button>

          {/* Row 2: Advanced Math */}
          <button className="btn operator" onClick={() => handleOperator('power')}>^</button>
          <button className="btn" onClick={() => calculateImmediate('sqrt')}>√</button>
          <button className="btn" onClick={() => calculateImmediate('percentage')}>%</button>
          <button className="btn operator" onClick={() => handleOperator('multiply')}>×</button>

          {/* Row 3: Numbers */}
          <button className="btn" onClick={() => inputDigit('7')}>7</button>
          <button className="btn" onClick={() => inputDigit('8')}>8</button>
          <button className="btn" onClick={() => inputDigit('9')}>9</button>
          <button className="btn operator" onClick={() => handleOperator('subtract')}>−</button>

          {/* Row 4: Numbers */}
          <button className="btn" onClick={() => inputDigit('4')}>4</button>
          <button className="btn" onClick={() => inputDigit('5')}>5</button>
          <button className="btn" onClick={() => inputDigit('6')}>6</button>
          <button className="btn operator" onClick={() => handleOperator('add')}>+</button>

          {/* Row 5 & 6: Numbers and Equals */}
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
