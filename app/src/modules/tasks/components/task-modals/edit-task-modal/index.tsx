'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import { updateTask } from '@/modules/tasks/actions/update-task/update-task.action';
import type { UpdateTaskSchema } from '@/modules/tasks/actions/update-task/update-task.schema';
import { updateTaskSchema } from '@/modules/tasks/actions/update-task/update-task.schema';
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
import FormTextarea from '@/shared/components/form/textarea';
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

type Props = Readonly<{
  isOpen: boolean;
  onClose: () => void;
}>;

export default function EditTaskModal({ isOpen, onClose }: Props) {
  const { selectedData } = useTaskAction();
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('tasks');

  const defaultValues = useMemo(() => {
    return {
      id: selectedData?.id,
      title: selectedData?.title,
      description: selectedData?.description,
      priority: selectedData?.priority,
      status: selectedData?.status,
      category: selectedData?.category,
      assigneeId: selectedData?.assignedToId,
      dueDate: selectedData?.dueDate
        ? new Date(selectedData.dueDate)
        : undefined,
    };
  }, [selectedData]);

  const form = useForm<UpdateTaskSchema>({
    defaultValues,
    resolver: zodResolver(updateTaskSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const handleUpdateTask = useCallback(
    (data: UpdateTaskSchema) => {
      startTransition(async () => {
        const sonner = await import('sonner');

        try {
          const formData = new FormData();

          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value as string);
          });

          const rsp = await updateTask(formData);

          if (rsp.error) {
            Object.entries(rsp.error).forEach(([key, value]) => {
              form.setError(key as keyof UpdateTaskSchema, {
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
          onClose();
        } catch {
          sonner.toast.error(t('validation.updateTask.error'));
        }
      });
    },
    [form, onClose, t]
  );

  return (
    <Dialog open={isOpen} onOpenChange={isPending ? undefined : onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('editTaskModal.title')}</DialogTitle>
          <DialogDescription>
            {t('editTaskModal.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateTask)}>
            <div className="mb-4 grid max-h-[50vh] gap-4 overflow-y-auto py-4">
              <FormInput
                control={form.control}
                name="title"
                label={t('createTaskModal.inputs.title.label')}
                placeholder={t('createTaskModal.inputs.title.placeholder')}
                disabled={isPending}
              />
              <FormTextarea
                control={form.control}
                name="description"
                label={t('createTaskModal.inputs.description.label')}
                placeholder={t(
                  'createTaskModal.inputs.description.placeholder'
                )}
                disabled={isPending}
              />
              <FormSelect
                label={t('createTaskModal.inputs.priority.label')}
                placeholder={t('createTaskModal.inputs.priority.placeholder')}
                name="priority"
                options={taskPriorityOptions}
                control={form.control}
                disabled={isPending}
              />
              <UsersCombobox
                control={form.control}
                name="assigneeId"
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
                placeholder={t('createTaskModal.inputs.status.placeholder')}
                name="status"
                options={taskStatusOptions}
                control={form.control}
                disabled={isPending}
              />
              <FormSelect
                label={t('createTaskModal.inputs.category.label')}
                placeholder={t('createTaskModal.inputs.category.placeholder')}
                name="category"
                options={taskCategoryOptions}
                control={form.control}
                disabled={isPending}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={isPending ? undefined : onClose}
                disabled={isPending}
              >
                {t('editTaskModal.buttons.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={isPending || !form.formState.isValid}
              >
                {t('editTaskModal.buttons.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
