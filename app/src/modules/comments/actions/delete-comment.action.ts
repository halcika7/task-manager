'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { httpClient } from '@/shared/lib/http-client';

export async function deleteCommentAction(commentId: string) {
  try {
    const response = await httpClient.delete<{ success: boolean }>(
      `/comments/${commentId}`
    );

    if (!response.data?.success) {
      return { success: false, message: 'deleteComment.error' };
    }

    revalidatePath('[locale]/dashboard', 'page');
    redirect('/dashboard');
  } catch {
    return { success: false, message: 'deleteComment.error' };
  }
}
