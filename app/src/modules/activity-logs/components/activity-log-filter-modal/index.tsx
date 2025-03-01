'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';
import { useCallback } from 'react';
import type { DateRange } from 'react-day-picker';

import { useForm } from 'react-hook-form';
import { useActiveFiltersCount } from '@/modules/activity-logs/components/activity-log-filter-modal/use-active-filters-count';
import {
  activityLogActions,
  entityTypes,
} from '@/modules/activity-logs/components/activity-log-filter-modal/utils';
import type { ActivityLogSearchParams } from '@/modules/activity-logs/utils/search-activity-log-params';
import { activityLogSearchParams } from '@/modules/activity-logs/utils/search-activity-log-params';
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

type Props = Readonly<{
  onClose: () => void;
  open: boolean;
}>;

export function ActivityLogFilterModal({ onClose, open }: Props) {
  const [searchParams, setSearchParams] = useQueryStates(
    activityLogSearchParams,
    { history: 'push', shallow: false }
  );
  const activeFiltersCount = useActiveFiltersCount();
  const t = useTranslations('activityLogs.filterModal');

  const form = useForm({
    defaultValues: {
      ...searchParams,
      dateRange: {
        from: searchParams?.dateFrom
          ? new Date(searchParams.dateFrom)
          : undefined,
        to: searchParams?.dateTo ? new Date(searchParams.dateTo) : undefined,
      },
    },
  });

  const applyFilters = useCallback(
    (data: ActivityLogSearchParams & { dateRange: DateRange | null }) => {
      setSearchParams({
        ...data,
        dateFrom: data.dateRange?.from?.toISOString() || null,
        dateTo: data.dateRange?.to?.toISOString() || null,
      });
      onClose();
    },
    [onClose, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({
      action: null,
      entityType: null,
      dateFrom: null,
      dateTo: null,
      search: null,
      page: null,
      limit: null,
      orderBy: null,
      orderDir: null,
    });
    onClose();
  }, [onClose, setSearchParams]);

  return (
    <Dialog open={open}>
      <DialogContent className="gap-0 p-0 sm:max-w-[400px]">
        <DialogDescription className="sr-only">
          {t('dialogTitle')}
        </DialogDescription>
        <DialogHeader className="flex flex-row items-center justify-between border-b p-4">
          <DialogTitle className="text-xl">{t('dialogTitle')}</DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="size-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(applyFilters)}>
            <div className="space-y-6 overflow-y-auto scroll-smooth p-6">
              <div className="space-y-4">
                <FormInput
                  id="search"
                  placeholder={t('inputs.search.placeholder')}
                  label={t('inputs.search.label')}
                  name="search"
                  control={form.control}
                />
                <FormSelect
                  name="action"
                  control={form.control}
                  options={activityLogActions}
                  label={t('inputs.action.label')}
                  placeholder={t('inputs.action.placeholder')}
                />
                <FormSelect
                  name="entityType"
                  control={form.control}
                  options={entityTypes}
                  label={t('inputs.entityType.label')}
                  placeholder={t('inputs.entityType.placeholder')}
                />
                <FormDatePicker
                  name="dateRange"
                  control={form.control}
                  mode="range"
                  label={t('inputs.dateRange.label')}
                  placeholder={t('inputs.dateRange.placeholder')}
                />
              </div>
            </div>
            <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
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
                  <Button variant="destructive" size="sm" onClick={onClose}>
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
