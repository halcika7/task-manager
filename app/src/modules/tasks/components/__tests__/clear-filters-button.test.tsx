import { fireEvent, render, screen } from '@testing-library/react';
import { useQueryStates } from 'nuqs';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ClearFiltersButton from '@/modules/tasks/components/clear-filters-button';
import { useActiveFiltersCount } from '@/modules/tasks/components/task-filter-modal/use-active-filters-count';
import { emptyTasksSearchParams } from '@/modules/tasks/utils/search-tasks-params';

// Mock the required dependencies
vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('nuqs', () => ({
  useQueryStates: vi.fn(),
}));

vi.mock(
  '@/modules/tasks/components/task-filter-modal/use-active-filters-count',
  () => ({
    useActiveFiltersCount: vi.fn(),
  })
);

describe('ClearFiltersButton', () => {
  const mockUseActiveFiltersCount = vi.mocked(useActiveFiltersCount);
  const mockUseQueryStates = vi.mocked(useQueryStates);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should not render when there are no active filters', () => {
    mockUseActiveFiltersCount.mockReturnValue(0);
    mockUseQueryStates.mockReturnValue([emptyTasksSearchParams, vi.fn()]);
    render(<ClearFiltersButton />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render when there are active filters', () => {
    mockUseActiveFiltersCount.mockReturnValue(1);
    mockUseQueryStates.mockReturnValue([emptyTasksSearchParams, vi.fn()]);
    render(<ClearFiltersButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByText('clearFilters')).toBeInTheDocument();
  });

  it('should call setSearchParams with empty params when clicked', async () => {
    mockUseActiveFiltersCount.mockReturnValue(1);
    const setSearchParamsMock = vi.fn();
    mockUseQueryStates.mockReturnValue([
      emptyTasksSearchParams,
      setSearchParamsMock,
    ]);

    render(<ClearFiltersButton />);

    const button = screen.getByRole('button');
    await fireEvent.click(button);

    expect(setSearchParamsMock).toHaveBeenCalledTimes(1);
    expect(setSearchParamsMock).toHaveBeenCalledWith(emptyTasksSearchParams);
  });
});
