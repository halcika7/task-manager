'use client';

import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQueryStates } from 'nuqs';
import { useCallback } from 'react';
import type { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';

import { useActiveFiltersCount } from '@/modules/users/components/user-filter-modal/use-active-filters-count';
import type { UsersSearchParams } from '@/modules/users/utils/search-users-params';
import { usersSearchParams } from '@/modules/users/utils/search-users-params';
import { roles } from '@/modules/users/utils/utils';
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

export function UserFilterModal({ onClose, open }: Props) {
  const t = useTranslations('users');
  const [searchParams, setSearchParams] = useQueryStates(usersSearchParams, {
    shallow: false,
    history: 'replace',
  });
  const form = useForm({
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
  const activeFiltersCount = useActiveFiltersCount();

  const applyFilters = useCallback(
    ({ dateRange, ...data }: UsersSearchParams & { dateRange: DateRange }) => {
      setSearchParams({
        ...data,
        dateFrom: dateRange?.from?.toISOString() ?? null,
        dateTo: dateRange?.to?.toISOString() ?? null,
      });
      onClose();
    },
    [onClose, setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams({
      page: 1,
      limit: 10,
      orderBy: 'createdAt',
      orderDir: 'desc',
    });
    onClose();
  }, [onClose, setSearchParams]);

  return (
    <Dialog open={open}>
      <DialogContent className="gap-0 p-0 sm:max-w-[400px]">
        <DialogDescription className="sr-only">
          {t('filterModal.title')}
        </DialogDescription>
        <DialogHeader className="flex flex-row items-center justify-between border-b p-4">
          <DialogTitle className="text-xl">
            {t('filterModal.title')}
          </DialogTitle>
          <DialogClose asChild>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(applyFilters)}>
            <div className="space-y-4 p-4">
              <FormInput
                name="search"
                control={form.control}
                label={t('filterModal.inputs.search.label')}
                placeholder={t('filterModal.inputs.search.placeholder')}
              />
              <FormSelect
                name="role"
                control={form.control}
                label={t('filterModal.inputs.role.label')}
                placeholder={t('filterModal.inputs.role.placeholder')}
                options={roles}
              />
              <FormDatePicker
                name="dateRange"
                label={t('filterModal.inputs.dateRange.label')}
                placeholder={t('filterModal.inputs.dateRange.placeholder')}
                control={form.control}
                mode="range"
                modifiers={{
                  disabled: date => date > new Date(),
                }}
              />
            </div>
            <DialogFooter className="flex items-center border-t p-4 sm:justify-between">
              {activeFiltersCount > 0 ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={clearFilters}
                >
                  {t('filterModal.buttons.clearFilters')}
                </Button>
              ) : (
                <div />
              )}
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="destructive" size="sm" onClick={onClose}>
                    {t('filterModal.buttons.cancel')}
                  </Button>
                </DialogClose>
                <Button size="sm" type="submit">
                  {t('filterModal.buttons.applyFilters')}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
