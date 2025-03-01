import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useActiveFiltersCount } from '@/modules/tasks/components/task-filter-modal/use-active-filters-count';

const mockGet = vi.fn();

describe('useActiveFiltersCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mock('next/navigation', () => ({
      useSearchParams: vi.fn(() => ({
        get: mockGet,
      })),
    }));
  });

  it('should return 0 when no filters are active', () => {
    mockGet.mockReturnValue(null);
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(0);
  });

  it('should count page filter', () => {
    mockGet.mockImplementation((key: string) => (key === 'page' ? '2' : null));
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count limit filter', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'limit' ? '20' : null
    );
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count search filter', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'search' ? 'test' : null
    );
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count status filter', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'status' ? 'OPEN' : null
    );
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count priority filter', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'priority' ? 'HIGH' : null
    );
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count category filter', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'category' ? 'WORK' : null
    );
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count assigneeId filter', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'assigneeId' ? '123' : null
    );
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count createdById filter', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'createdById' ? '123' : null
    );
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count date range as one filter when either dateFrom or dateTo is present', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'dateFrom') return '2024-01-01';
      if (key === 'dateTo') return '2024-12-31';
      return null;
    });
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count sort as one filter when either orderBy or orderDir is present', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'orderBy') return 'dueDate';
      if (key === 'orderDir') return 'desc';
      return null;
    });
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(1);
  });

  it('should count multiple active filters', () => {
    mockGet.mockImplementation((key: string) => {
      switch (key) {
        case 'search':
          return 'test';
        case 'status':
          return 'OPEN';
        case 'priority':
          return 'HIGH';
        default:
          return null;
      }
    });
    const { result } = renderHook(() => useActiveFiltersCount());
    expect(result.current).toBe(3);
  });
});
