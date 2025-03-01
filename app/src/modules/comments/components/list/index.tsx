'use client';

import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import CommentItem from '@/modules/comments/components/comment-item';
import type { CommentResponse } from '@/modules/comments/types/comment-reponse.type';
import type { Comment } from '@/modules/comments/types/comment.type';
import { useSocket } from '@/shared/hooks/use-socket';
import { httpClient } from '@/shared/lib/http-client';
import { socketService } from '@/shared/lib/socket';
import {
  getNextPageParam,
  getPreviousPageParam,
} from '@/shared/utils/query-client-get-pages';

type Props = Readonly<{
  taskId: string;
  initialData?: CommentResponse | null;
  setTotalComments: (total: number) => void;
}>;

type InfiniteQueryData = {
  pages: CommentResponse[];
  pageParams: number[];
};

export default function CommentsList({
  taskId,
  initialData = null,
  setTotalComments,
}: Props) {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [params] = useState({
    page: 1,
    limit: 10,
  });

  const { data, hasNextPage, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ['comments', taskId, params],
      queryFn: async ({ pageParam = params.page }) => {
        const response = await httpClient.get<CommentResponse>(
          `/comments/task/${taskId}?page=${pageParam}&limit=${params.limit}`
        );
        return response.data;
      },
      initialPageParam: params.page,
      getNextPageParam: getNextPageParam,
      getPreviousPageParam,
      initialData: initialData
        ? {
            pages: [initialData],
            pageParams: [params.page],
          }
        : undefined,
    });

  // Create a stable callback for handling new comments
  const handleNewComment = useCallback(
    (newComment: Comment) => {
      queryClient.setQueryData<InfiniteQueryData>(
        ['comments', taskId, params],
        oldData => {
          if (!oldData) return oldData;

          // Create a new first page with the new comment
          const firstPage = oldData.pages[0];
          const updatedFirstPage = {
            ...firstPage,
            data: [newComment, ...firstPage.data],
            meta: {
              ...firstPage.meta,
              total: firstPage.meta.total + 1,
            },
          };

          // Update the total comments
          setTotalComments(firstPage.meta.total + 1);

          // Update the pages array
          return {
            ...oldData,
            pages: [updatedFirstPage, ...oldData.pages.slice(1)],
          };
        }
      );
    },
    [queryClient, taskId, params, setTotalComments]
  );

  const handleCommentDeleted = useCallback(
    (deletedComment: Comment) => {
      queryClient.setQueryData<InfiniteQueryData>(
        ['comments', taskId, params],
        oldData => {
          if (!oldData) return oldData;

          // Remove the deleted comment from all pages
          const updatedPages = oldData.pages.map(page => ({
            ...page,
            data: page.data.filter(comment => comment.id !== deletedComment.id),
            meta: {
              ...page.meta,
              total: page.meta.total - 1,
            },
          }));

          // Update the total comments
          setTotalComments(updatedPages[0].meta.total);

          return {
            ...oldData,
            pages: updatedPages,
          };
        }
      );
    },
    [queryClient, taskId, params, setTotalComments]
  );

  // Use the stable callback with useSocket
  useSocket('commentAdded', handleNewComment);
  useSocket('commentDeleted', handleCommentDeleted);

  const allComments = useMemo(() => {
    return data?.pages.flatMap(page => page?.data ?? []) ?? [];
  }, [data]);

  // Join the specific task room when component mounts
  useEffect(() => {
    if (taskId) {
      socketService.joinTask(taskId);

      return () => {
        socketService.leaveTask(taskId);
      };
    }
  }, [taskId]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetching && !isLoading) {
          fetchNextPage();
        }
      },
      { threshold: 0.5, rootMargin: '-200px 0px 0px 0px' }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetching, isLoading]);

  return (
    <div className="space-y-6">
      {allComments.map(comment => (
        <CommentItem key={comment.id} {...comment} />
      ))}

      {/* Loading indicator and intersection observer target */}
      <div ref={loadMoreRef} className="h-4">
        {isFetching && (
          <div className="flex justify-center py-4">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
