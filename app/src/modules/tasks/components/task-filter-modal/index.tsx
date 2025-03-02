'use client';

import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';
import { useCallback } from 'react';
import type { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';

import { useActiveFiltersCount } from '@/modules/tasks/components/task-filter-modal/use-active-filters-count';
import type { TasksSearchParams } from '@/modules/tasks/utils/search-tasks-params';
import {
  emptyTasksSearchParams,
  tasksSearchParams,
} from '@/modules/tasks/utils/search-tasks-params';
import {
  taskCategoryOptions,
  taskPriorityOptions,
  taskStatusOptions,
} from '@/modules/tasks/utils/task-form-options';
import UsersCombobox from '@/modules/users/components/users-combobox';
import FormDatePicker from '@/shared/components/form/date-picker';
import FormInput from '@/shared/components/form/input';
import FormSelect from '@/shared/components/form/select';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form } from '@/shared/components/ui/form';

interface Props {
  open: boolean;
  onClose: () => void;
}

type FormData = TasksSearchParams & { dateRange: DateRange };

export function TaskFilterModal({ onClose, open }: Props) {
  const [searchParams, setSearchParams] = useQueryStates(tasksSearchParams, {
    history: 'push',
    shallow: false,
  });
  const activeFiltersCount = useActiveFiltersCount();
  const t = useTranslations('tasks.filterModal');

  const form = useForm<FormData>({
    defaultValues: {
      ...searchParams,
      dateRange: {
        from: searchParams.dateFrom
          ? new Date(searchParams.dateFrom)
          : undefined,
        to: searchParams.dateTo ? new Date(searchParams.dateTo) : undefined,
      },
    },
  });

  const applyFilters = useCallback(
    (data: FormData) => {
      setSearchParams({
        ...data,
        dateFrom: data.dateRange.from?.toISOString() ?? null,
        dateTo: data.dateRange.to?.toISOString() ?? null,
      });
      onClose();
    },
    [onClose, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(emptyTasksSearchParams);
    onClose();
  }, [onClose, setSearchParams]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="gap-0 p-0 sm:max-w-[400px]">
        <DialogDescription className="sr-only">{t('title')}</DialogDescription>
        <DialogHeader className="flex flex-row items-center justify-between border-b p-4">
          <DialogTitle className="text-xl">{t('title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(applyFilters)}>
            <div className="max-h-[50vh] space-y-6 overflow-y-auto scroll-smooth p-6">
              <div className="space-y-4">
                <FormInput
                  name="search"
                  placeholder={t('inputs.search.placeholder')}
                  label={t('inputs.search.label')}
                  control={form.control}
                />

                <FormSelect
                  name="status"
                  options={taskStatusOptions}
                  control={form.control}
                  placeholder={t('inputs.status.placeholder')}
                  label={t('inputs.status.label')}
                />

                <FormSelect
                  name="priority"
                  options={taskPriorityOptions}
                  control={form.control}
                  placeholder={t('inputs.priority.placeholder')}
                  label={t('inputs.priority.label')}
                />

                <FormSelect
                  name="category"
                  options={taskCategoryOptions}
                  control={form.control}
                  placeholder={t('inputs.category.placeholder')}
                  label={t('inputs.category.label')}
                />

                <UsersCombobox
                  name="assigneeId"
                  control={form.control}
                  placeholder={t('inputs.assignee.placeholder')}
                  label={t('inputs.assignee.label')}
                />

                <UsersCombobox
                  name="createdById"
                  control={form.control}
                  placeholder={t('inputs.createdBy.placeholder')}
                  label={t('inputs.createdBy.label')}
                />

                <FormDatePicker
                  name="dateRange"
                  control={form.control}
                  placeholder={t('inputs.dateRange.placeholder')}
                  label={t('inputs.dateRange.label')}
                  mode="range"
                  numberOfMonths={2}
                />
              </div>
            </div>
            <DialogFooter className="flex flex-row items-center justify-end gap-2 border-t p-4 sm:justify-end">
              {activeFiltersCount > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={clearFilters}
                >
                  {t('clearFilters')}
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="destructive" size="sm" type="button">
                    {t('cancel')}
                  </Button>
                </DialogClose>
                <Button size="sm" type="submit">
                  {t('applyFilters')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
