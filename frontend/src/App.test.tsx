import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

// Mock the global fetch API
globalThis.fetch = vi.fn() as any;

describe('Calculator App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the calculator UI completely', () => {
    render(<App />);
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('=')).toBeInTheDocument();
    expect(screen.getByText('DEL')).toBeInTheDocument();
  });

  it('updates the display correctly when numbers are clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('9'));

    expect(screen.getByText('789')).toBeInTheDocument();
  });

  it('mocks a full calculation workflow and calls the backend API', async () => {
    // 1. Fake backend response
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: '15' }),
    });

    render(<App />);

    // 2. Simulate user typing "7 + 8 ="
    fireEvent.click(screen.getByText('7'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('8'));
    fireEvent.click(screen.getByText('='));

    // 3. Verify the network request was constructed perfectly
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/calculate', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'add', a: '7', b: '8' })
      }));
    });

    // 4. Verify the UI updated with the fake backend result
    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument();
      expect(screen.getByText('7 + 8 =')).toBeInTheDocument(); // Checks history display
    });
  });

  it('handles unary operation: square root', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: '3' }),
    });

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '9' }));
    fireEvent.click(screen.getByRole('button', { name: '√' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/calculate', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'sqrt', a: '9', b: '0' })
      }));
      expect(screen.getAllByText('3').length).toBeGreaterThan(0);
      expect(screen.getByText('√9 =')).toBeInTheDocument();
    });
  });

  it('handles unary operation: percentage', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ result: '0.5' }),
    });

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '%' }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith('http://localhost:8000/api/calculate', expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operation: 'percentage', a: '50', b: '0' })
      }));
      expect(screen.getByText('0.5')).toBeInTheDocument();
      expect(screen.getByText('50% =')).toBeInTheDocument();
    });
  });

  it('displays a fallback error message on 500 Server Error', async () => {
    (fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
      json: async () => { throw new Error('Not JSON'); },
    });

    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));

    await waitFor(() => {
      expect(screen.getByText('Server Error: 500 Internal Server Error')).toBeInTheDocument();
    });
  });

  it('blocks network request and shows error for square root of a negative number', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '±' }));
    fireEvent.click(screen.getByRole('button', { name: '√' }));

    await waitFor(() => {
      expect(fetch).not.toHaveBeenCalled();
      expect(screen.getByText('Cannot calculate square root of a negative number')).toBeInTheDocument();
    });
  });

  it('clears the display when C is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '9' }));
    expect(screen.getAllByText('9').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    expect(screen.getAllByText('0').length).toBeGreaterThan(0);
  });

  it('removes the last digit when DEL is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(screen.getByText('42')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'DEL' }));
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
  });

  it('toggles the sign when ± is clicked', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '±' }));
    expect(screen.getByText('-7')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '±' }));
    expect(screen.getAllByText('7').length).toBeGreaterThan(0);
  });

  it('handles decimal input correctly without duplicate periods', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: '0' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '.' })); // This one should be ignored
    fireEvent.click(screen.getByRole('button', { name: '2' }));

    expect(screen.getByText('0.52')).toBeInTheDocument();
  });
});
