import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useQueryStates } from 'nuqs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { TaskFilterModal } from '@/modules/tasks/components/task-filter-modal/index';
import { emptyTasksSearchParams } from '@/modules/tasks/utils/search-tasks-params';
import { MediaQueryProvider } from '@/shared/provider/media-query.provider';

// Mock dependencies
vi.mock('@/modules/users/components/users-combobox', () => ({
  default: ({ label }: { label: string }) => <div>{label}</div>,
}));

const onCloseMock = vi.fn();

const component = () => (
  <MediaQueryProvider>
    <TaskFilterModal open={true} onClose={onCloseMock} />
  </MediaQueryProvider>
);

describe('TaskFilterModal', () => {
  const mockUseQueryStates = vi.mocked(useQueryStates);
  const setSearchParamsMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQueryStates.mockReturnValue([
      { ...emptyTasksSearchParams },
      setSearchParamsMock,
    ]);
  });

  it('should render all filter inputs', () => {
    render(component());

    expect(screen.getByText('inputs.search.label')).toBeInTheDocument();
    expect(screen.getByText('inputs.status.label')).toBeInTheDocument();
    expect(screen.getByText('inputs.priority.label')).toBeInTheDocument();
    expect(screen.getByText('inputs.category.label')).toBeInTheDocument();
    expect(screen.getByText('inputs.assignee.label')).toBeInTheDocument();
    expect(screen.getByText('inputs.createdBy.label')).toBeInTheDocument();
    expect(screen.getByText('inputs.dateRange.label')).toBeInTheDocument();
  });

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(component());

    await user.click(screen.getByText('cancel'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('should apply filters when form is submitted', async () => {
    const user = userEvent.setup();
    render(component());

    // Fill in some filter values
    await user.type(
      screen.getByLabelText('inputs.search.label'),
      'test search'
    );

    // Submit the form
    await user.click(screen.getByText('applyFilters'));

    // Verify the search params were updated
    expect(setSearchParamsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        search: 'test search',
        dateFrom: null,
        dateTo: null,
      })
    );
    expect(onCloseMock).toHaveBeenCalled();
  });
});
