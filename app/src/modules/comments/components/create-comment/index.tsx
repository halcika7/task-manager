'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { SendIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useTransition } from 'react';
import { useForm } from 'react-hook-form';

import type { CreateCommentSchema } from '@/modules/comments/actions/create-comment/create-comment-schema';
import { createCommentSchema } from '@/modules/comments/actions/create-comment/create-comment-schema';
import { createComment } from '@/modules/comments/actions/create-comment/create-comment.action';
import FormTextarea from '@/shared/components/form/textarea';
import { Button } from '@/shared/components/ui/button';
import { Form } from '@/shared/components/ui/form';

type Props = Readonly<{
  taskId: string;
}>;

export default function CreateComment({ taskId }: Props) {
  const [isPending, startTransition] = useTransition();
  const t = useTranslations('comments');

  const form = useForm<CreateCommentSchema>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { taskId, content: '' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const handleSubmit = useCallback(
    async (data: CreateCommentSchema) => {
      startTransition(async () => {
        const sonner = await import('sonner');

        try {
          const formData = new FormData();
          formData.append('content', data.content);
          formData.append('taskId', data.taskId);

          const response = await createComment(formData);

          if (response.error) {
            Object.entries(response.error).forEach(([key, value]) => {
              form.setError(key as keyof CreateCommentSchema, {
                message: value[0],
              });
            });
            return;
          }

          if (response.success) {
            form.reset({ content: '', taskId });
            return;
          }

          sonner.toast.error(t('createComment.error'));
        } catch {
          sonner.toast.error(t('createComment.error'));
        }
      });
    },
    [startTransition, form, taskId, t]
  );

  return (
    <Form {...form}>
      <form className="flex gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
        <FormTextarea
          name="content"
          placeholder={t('placeholder')}
          className="min-h-[80px] w-full"
          control={form.control}
          disabled={isPending}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!form.formState.isValid || isPending}
        >
          <SendIcon className="size-4" />
        </Button>
      </form>
    </Form>
  );
}
