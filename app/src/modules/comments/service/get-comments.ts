import type { CommentResponse } from '@/modules/comments/types/comment-reponse.type';
import { httpClient } from '@/shared/lib/http-client';

export const getComments = async (
  taskId: string,
  page: number,
  limit: number
) => {
  try {
    const response = await httpClient.get<CommentResponse>(
      `/comments/task/${taskId}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch {
    return null;
  }
};
