import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useQueryStates } from 'nuqs';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import TaskSortSelect from '@/modules/tasks/components/task-sort-select/task-sort-select';
import { emptyTasksSearchParams } from '@/modules/tasks/utils/search-tasks-params';

describe('TaskSortSelect', () => {
  const mockUseQueryStates = vi.mocked(useQueryStates);
  const setSearchParamsMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseQueryStates.mockReturnValue([
      { ...emptyTasksSearchParams },
      setSearchParamsMock,
    ]);
  });

  it('should render with default placeholder when no sort is selected', () => {
    render(<TaskSortSelect />);
    expect(screen.getByRole('button')).toHaveTextContent('placeholder');
  });

  it('should render with selected sort option when sort is applied', () => {
    mockUseQueryStates.mockReturnValue([
      {
        ...emptyTasksSearchParams,
        orderBy: 'dueDate',
        orderDir: 'desc',
      },
      setSearchParamsMock,
    ]);

    render(<TaskSortSelect />);
    expect(screen.getByRole('button')).toHaveTextContent('dueDate.desc');
  });

  it('should show dropdown menu when clicked', async () => {
    render(<TaskSortSelect />);
    const button = screen.getByRole('button');
    userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('dueDate.desc')).toBeInTheDocument();
      expect(screen.getByText('dueDate.asc')).toBeInTheDocument();
      expect(screen.getByText('createdAt.desc')).toBeInTheDocument();
      expect(screen.getByText('createdAt.asc')).toBeInTheDocument();
    });
  });

  it('should call setSearchParams with correct params when sort option is selected', async () => {
    render(<TaskSortSelect />);
    const user = userEvent.setup();

    await act(async () => {
      // Click the button to open dropdown
      const button = screen.getByRole('button');
      await user.click(button);
    });

    // Wait for dropdown menu to be visible
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    // Click the option
    const dueDateDescOption = screen.getByText('dueDate.desc');
    await user.click(dueDateDescOption);

    // Verify the search params were updated
    expect(setSearchParamsMock).toHaveBeenCalledTimes(1);
    expect(setSearchParamsMock).toHaveBeenCalledWith({
      orderBy: 'dueDate',
      orderDir: 'desc',
    });
  });

  // it('should not call setSearchParams when clicking an option without data-sort', async () => {
  //   render(<TaskSortSelect />);
  //   const user = userEvent.setup();

  //   // Open dropdown
  //   const button = screen.getByRole('button');
  //   await user.click(button);

  //   // Wait for dropdown to be visible
  //   await waitFor(() => {
  //     expect(screen.getByRole('menu')).toBeInTheDocument();
  //   });

  //   // Create a menu item without data-sort and click it
  //   const menuContent = screen.getByRole('menu');
  //   const menuItem = document.createElement('div');
  //   menuItem.role = 'menuitem';
  //   menuItem.textContent = 'Test Option';
  //   menuContent.appendChild(menuItem);

  //   await user.click(menuItem);

  //   // Verify setSearchParams was not called
  //   expect(setSearchParamsMock).not.toHaveBeenCalled();
  // });
});
