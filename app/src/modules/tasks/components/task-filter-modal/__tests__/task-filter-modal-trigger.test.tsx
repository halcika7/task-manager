import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import TaskFilterModalTrigger from '@/modules/tasks/components/task-filter-modal/task-filter-modal-trigger';
import { useActiveFiltersCount } from '@/modules/tasks/components/task-filter-modal/use-active-filters-count';

// Mock the required dependencies

vi.mock('../use-active-filters-count', () => ({
  useActiveFiltersCount: vi.fn(),
}));

// Mock the dynamic import of TaskFilterModal
vi.mock('next/dynamic', () => ({
  __esModule: true,
  default: () => {
    return function DynamicComponent(props: Record<string, unknown>) {
      return <div data-testid="mock-filter-modal" {...props} />;
    };
  },
}));

describe('TaskFilterModalTrigger', () => {
  const mockUseActiveFiltersCount = vi.mocked(useActiveFiltersCount);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseActiveFiltersCount.mockReturnValue(0);
  });

  it('should render the filter button with correct text', () => {
    render(<TaskFilterModalTrigger />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('filters');
  });

  it('should not show badge when there are no active filters', () => {
    mockUseActiveFiltersCount.mockReturnValue(0);
    render(<TaskFilterModalTrigger />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('should show badge with count when there are active filters', () => {
    mockUseActiveFiltersCount.mockReturnValue(3);
    render(<TaskFilterModalTrigger />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not render modal initially', () => {
    render(<TaskFilterModalTrigger />);
    expect(screen.queryByTestId('mock-filter-modal')).not.toBeInTheDocument();
  });

  it('should render modal when button is clicked', async () => {
    render(<TaskFilterModalTrigger />);
    const button = screen.getByRole('button');

    await fireEvent.click(button);

    expect(screen.getByTestId('mock-filter-modal')).toBeInTheDocument();
  });

  it('should close modal when onClose is called', async () => {
    render(<TaskFilterModalTrigger />);
    const button = screen.getByRole('button');

    // Open modal
    await fireEvent.click(button);
    expect(screen.getByTestId('mock-filter-modal')).toBeInTheDocument();

    // Close modal
    await fireEvent.click(button);
    expect(screen.queryByTestId('mock-filter-modal')).not.toBeInTheDocument();
  });
});
