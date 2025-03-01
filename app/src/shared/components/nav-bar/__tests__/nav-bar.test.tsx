import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthProvider } from '@/modules/auth/provider/auth.provider';
import type { LocaleLinkProps } from '@/modules/i18n/routing';
import type { User } from '@/modules/users/types/user.type';
import { UserRole } from '@/modules/users/types/user.type';
import NavBar from '@/shared/components/nav-bar/index';

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: UserRole.USER,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  locale: 'en',
};

const component = () => (
  <AuthProvider session={mockUser}>
    <NavBar />
  </AuthProvider>
);

// Mock dependencies
vi.mock('@/modules/i18n/routing', () => ({
  LocaleLink: ({ href, children, ...props }: LocaleLinkProps) => (
    <a href={href as string} {...props}>
      {children}
    </a>
  ),
}));

describe('NavBar', () => {
  it('should render logo and navigation links', () => {
    render(component());

    expect(screen.getByText('TaskFlow')).toBeInTheDocument();
    expect(screen.getByText('features')).toBeInTheDocument();
    expect(screen.getByText('pricing')).toBeInTheDocument();
    expect(screen.getByText('about')).toBeInTheDocument();
    expect(screen.getByText('contact')).toBeInTheDocument();
  });

  it('should render sign in and get started buttons when user is not logged in', () => {
    render(component());

    expect(screen.getByText('signIn')).toBeInTheDocument();
    expect(screen.getByText('getStarted')).toBeInTheDocument();
  });

  it('should render correct href for navigation links', () => {
    render(component());

    const links = screen.getAllByRole('link');
    expect(links[0]).toHaveAttribute('href', '/'); // Logo
    expect(links[1]).toHaveAttribute('href', '/'); // Features
    expect(links[2]).toHaveAttribute('href', '/'); // Pricing
    expect(links[3]).toHaveAttribute('href', '/'); // About
    expect(links[4]).toHaveAttribute('href', '/'); // Contact
    expect(links[5]).toHaveAttribute('href', '/auth/login'); // Sign In
    expect(links[6]).toHaveAttribute('href', '/auth/register'); // Get Started
  });
});
