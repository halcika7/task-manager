'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import type { CreateTaskSchema } from '@/modules/tasks/actions/create-task/create-task.schema';
import { createTaskSchema } from '@/modules/tasks/actions/create-task/create-task.schema';
import { createTaskAction } from '@/modules/tasks/actions/create-task/create-user.action';
import { useTaskAction } from '@/modules/tasks/context/task-action.context';
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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Form } from '@/shared/components/ui/form';
import { Action } from '@/shared/provider/action.provider';

const defaultValues: Partial<CreateTaskSchema> = {
  title: '',
  description: '',
  assigneeId: '',
};

export default function CreateTaskModal() {
  const { action, handleSetSelectedData } = useTaskAction();
  const [isPending, startTransition] = useTransition();
  const form = useForm<CreateTaskSchema>({
    defaultValues,
    resolver: zodResolver(createTaskSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  const t = useTranslations('tasks');

  const handleClose = useCallback(() => {
    handleSetSelectedData(null, null);
  }, [handleSetSelectedData]);

  const handleSubmit = useCallback(
    (data: CreateTaskSchema) => {
      startTransition(async () => {
        const sonner = await import('sonner');

        try {
          const formData = new FormData();

          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
          });

          const rsp = await createTaskAction(formData);

          if (rsp.error) {
            Object.entries(rsp.error).forEach(([key, value]) => {
              form.setError(key as keyof CreateTaskSchema, {
                message: value[0],
              });
            });
            return;
          }

          if (!rsp.success) {
            sonner.toast.error(t(rsp.message));
            return;
          }

          sonner.toast.success(t(rsp.message));
          handleClose();
        } catch {
          sonner.toast.error(t('validation.createTask.error'));
        }
      });
    },
    [form, handleClose, t]
  );
  return (
    <Dialog
      open={action === Action.CREATE}
      onOpenChange={isPending ? undefined : handleClose}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('createTaskModal.title')}</DialogTitle>
          <DialogDescription>
            {t('createTaskModal.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="mb-4 grid max-h-[50vh] gap-4 overflow-y-auto py-4">
              <FormInput
                label={t('createTaskModal.inputs.title.label')}
                name="title"
                placeholder={t('createTaskModal.inputs.title.placeholder')}
                control={form.control}
                disabled={isPending}
              />
              <FormInput
                label={t('createTaskModal.inputs.description.label')}
                name="description"
                placeholder={t(
                  'createTaskModal.inputs.description.placeholder'
                )}
                control={form.control}
                disabled={isPending}
              />
              <FormSelect
                label={t('createTaskModal.inputs.priority.label')}
                name="priority"
                options={taskPriorityOptions}
                control={form.control}
                disabled={isPending}
                placeholder={t('createTaskModal.inputs.priority.placeholder')}
              />
              <UsersCombobox
                name="assigneeId"
                control={form.control}
                disabled={isPending}
                emptyMessage={t('createTaskModal.inputs.assignee.emptyMessage')}
                label={t('createTaskModal.inputs.assignee.label')}
                placeholder={t('createTaskModal.inputs.assignee.placeholder')}
              />
              <FormDatePicker
                label={t('createTaskModal.inputs.dueDate.label')}
                name="dueDate"
                mode="single"
                control={form.control}
                disabled={isPending}
                modifiers={{
                  disabled: date => date <= new Date(),
                }}
                placeholder={t('createTaskModal.inputs.dueDate.placeholder')}
              />
              <FormSelect
                label={t('createTaskModal.inputs.status.label')}
                name="status"
                options={taskStatusOptions}
                control={form.control}
                disabled={isPending}
                placeholder={t('createTaskModal.inputs.status.placeholder')}
              />
              <FormSelect
                label={t('createTaskModal.inputs.category.label')}
                name="category"
                options={taskCategoryOptions}
                control={form.control}
                disabled={isPending}
                placeholder={t('createTaskModal.inputs.category.placeholder')}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isPending}
                type="button"
              >
                {t('createTaskModal.buttons.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid || isPending}
              >
                {t('createTaskModal.buttons.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
