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
});
