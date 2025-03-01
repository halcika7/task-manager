import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import type { LocaleLinkProps } from '@/modules/i18n/routing';
import { UserRole } from '@/modules/users/types/user.type';
import UserNav from '@/shared/components/nav-bar/user-nav';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

// Mock the auth hook
const mockLogout = vi.fn();
vi.mock('@/modules/auth/hooks/use-auth', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

// Mock the LocaleLink component
vi.mock('@/modules/i18n/routing', () => ({
  LocaleLink: ({ href, children, ...props }: LocaleLinkProps) => (
    <a href={href as string} {...props}>
      {children}
    </a>
  ),
}));

describe('UserNav', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.USER,
    locale: 'en',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user information correctly', async () => {
    render(<UserNav user={mockUser} />);

    await act(async () => {
      // Open dropdown
      const avatarButton = screen.getByTestId('user-nav-avatar');
      userEvent.click(avatarButton);
    });

    await waitFor(() => {
      // Check if user information is displayed
      expect(screen.getByText('JD')).toBeInTheDocument();
      expect(screen.getByText(mockUser.email)).toBeInTheDocument();
    });
  });

  it('shows basic navigation items for regular users', async () => {
    render(<UserNav user={mockUser} />);

    await act(async () => {
      // Open dropdown
      const avatarButton = screen.getByTestId('user-nav-avatar');
      userEvent.click(avatarButton);
    });

    await waitFor(() => {
      // Check for regular user menu items
      expect(screen.getByTestId('locale-link-/dashboard')).toBeInTheDocument();
      expect(
        screen.getByTestId('locale-link-/dashboard/profile')
      ).toBeInTheDocument();
    });

    await waitFor(() => {
      // Admin-only items should not be present
      expect(
        screen.queryByTestId('locale-link-/dashboard/users')
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('locale-link-/dashboard/activity-logs')
      ).not.toBeInTheDocument();
    });
  });

  it('shows additional navigation items for admin users', async () => {
    render(
      <UserNav
        user={{
          ...mockUser,
          role: UserRole.ADMIN,
        }}
      />
    );

    // Open dropdown
    const avatarButton = screen.getByTestId('user-nav-avatar');
    userEvent.click(avatarButton);

    await waitFor(() => {
      // Check for admin menu items
      expect(
        screen.getByTestId('locale-link-/dashboard/users')
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('locale-link-/dashboard/activity-logs')
      ).toBeInTheDocument();
    });
  });

  it('calls logout function when sign out is clicked', async () => {
    render(<UserNav user={mockUser} />);

    await act(async () => {
      // Open dropdown
      const avatarButton = screen.getByTestId('user-nav-avatar');
      userEvent.click(avatarButton);
    });

    await waitFor(async () => {
      // Check if sign out button is present
      const signOutButton = screen.getByTestId('user-nav-sign-out');
      expect(signOutButton).toBeInTheDocument();

      // Click sign out button
      userEvent.click(signOutButton);
    });

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalledTimes(1);
    });
  });
});
