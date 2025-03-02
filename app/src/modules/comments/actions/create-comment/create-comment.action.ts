'use server';

import type { CreateCommentSchema } from '@/modules/comments/actions/create-comment/create-comment-schema';
import { createCommentSchema } from '@/modules/comments/actions/create-comment/create-comment-schema';
import type { Comment } from '@/modules/comments/types/comment.type';
import { httpClient } from '@/shared/lib/http-client';

export async function createComment(formData: FormData) {
  const data = Object.fromEntries(formData.entries()) as CreateCommentSchema;
  const validatedFields = createCommentSchema.safeParse(data);

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  try {
    const response = await httpClient.post<Comment>('/comments', {
      content: data.content,
      taskId: data.taskId,
    });

    if (!response.data?.id) {
      return { message: 'createComment.error', success: false };
    }

    return { message: 'createComment.success', success: true };
  } catch {
    return { message: 'createComment.error', success: false };
  }
}
