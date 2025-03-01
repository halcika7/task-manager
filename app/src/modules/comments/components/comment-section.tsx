'use client';

import { MessageSquareIcon } from 'lucide-react';
import dynamic from 'next/dynamic';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import CreateCommentSkeleton from '@/modules/comments/components/create-comment/create-comment-skeleton';
import type { CommentResponse } from '@/modules/comments/types/comment-reponse.type';
import { Badge } from '@/shared/components/ui/badge';

const CreateComment = dynamic(
  () => import('@/modules/comments/components/create-comment'),
  { ssr: false, loading: () => <CreateCommentSkeleton /> }
);

const CommentsList = dynamic(
  () => import('@/modules/comments/components/list')
);

type Props = Readonly<{
  taskId: string;
  comments: CommentResponse | null;
}>;

export default function CommentSection({ taskId, comments }: Props) {
  const [totalComments, setTotalComments] = useState(comments?.meta.total ?? 0);
  const t = useTranslations('tasks');
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquareIcon className="text-muted-foreground h-5 w-5" />
        <h2 className="font-semibold">{t('comments')}</h2>
        <Badge variant="secondary" className="ml-2">
          {totalComments}
        </Badge>
      </div>
      <section className="space-y-4">
        <CreateComment taskId={taskId} />
        <CommentsList
          taskId={taskId}
          initialData={comments}
          setTotalComments={setTotalComments}
        />
      </section>
    </div>
  );
}
