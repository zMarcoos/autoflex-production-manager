import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';

describe('App Component', () => {
  beforeEach(() => {
    window.fetch = vi.fn();
  });

  it('renders the main title correctly', async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(<App />);

    expect(screen.getByText('🏭 Autoflex Production Manager')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    window.fetch.mockImplementation(() => new Promise(() => { }));

    render(<App />);

    expect(screen.getByRole('button', { name: /Carregando.../i })).toBeInTheDocument();
  });

  it('renders products after fetching', async () => {
    const mockProducts = [
      { id: 1, name: 'Luxury Table', price: 500.0 }
    ];

    window.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] })
      .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
      .mockResolvedValueOnce({ ok: true, json: async () => [] });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Luxury Table')).toBeInTheDocument();
      expect(screen.getByText('R$ 500.00')).toBeInTheDocument();
    });
  });
});
