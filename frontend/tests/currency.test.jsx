import { vi, describe, it, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { formatPrice, CURRENCY_SYMBOL, CURRENCY_CODE } from '../src/utils/currency.js';

vi.mock('../src/api/client.js', () => ({
  default: { get: vi.fn() },
  resolveImage: (s) => s
}));

import api from '../src/api/client.js';
import Menu from '../src/pages/public/Menu.jsx';

describe('currency utility', () => {
  it('uses Moroccan Dirham as the currency', () => {
    expect(CURRENCY_CODE).toBe('MAD');
    expect(CURRENCY_SYMBOL).toBe('DH');
  });

  it('formats whole numbers as "<amount> DH"', () => {
    expect(formatPrice(120)).toBe('120 DH');
    expect(formatPrice(85)).toBe('85 DH');
    expect(formatPrice(15)).toBe('15 DH');
  });

  it('formats decimal prices without losing precision', () => {
    expect(formatPrice(29.5)).toBe('29.50 DH');
  });

  it('never emits euro or dollar symbols', () => {
    const out = formatPrice(90);
    expect(out).not.toContain('€');
    expect(out).not.toContain('EUR');
    expect(out).not.toContain('$');
  });
});

describe('Menu page currency display', () => {
  const items = [
    { _id: 'a1', name: 'Tagine', description: 'Lamb tagine', price: 85, category: 'Mains', image: '', featured: true, published: true },
    { _id: 'a2', name: 'Moroccan Tea', description: 'Mint tea', price: 15, category: 'Drinks', image: '', featured: false, published: true }
  ];

  beforeEach(() => {
    api.get.mockResolvedValue({ data: items });
  });

  it('shows prices in DH and no euro references', async () => {
    render(<MemoryRouter><Menu /></MemoryRouter>);
    await waitFor(() => expect(screen.getByText('85 DH')).toBeInTheDocument());
    expect(screen.getByText('15 DH')).toBeInTheDocument();
    expect(screen.queryByText(/EUR/)).toBeNull();
    expect(screen.queryByText(/€/)).toBeNull();
  });
});
