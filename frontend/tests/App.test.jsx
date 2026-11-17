import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import NotFound from '../src/pages/public/NotFound.jsx';
import { Badge, EmptyState } from '../src/components/ui/index.jsx';
import Login from '../src/pages/admin/Login.jsx';
import { AuthProvider } from '../src/context/AuthContext.jsx';

describe('NotFound page', () => {
  it('renders the 404 heading and a link home', () => {
    render(<MemoryRouter><NotFound /></MemoryRouter>);
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to homepage/i })).toHaveAttribute('href', '/');
  });
});

describe('UI primitives', () => {
  it('renders a badge with its label', () => {
    render(<Badge tone="green">Published</Badge>);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('renders an empty state title', () => {
    render(<EmptyState title="Nothing to show" />);
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });
});

describe('Admin login form', () => {
  it('renders email and password fields and a sign-in button', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
});
