import { Trash2Icon } from 'lucide-react';
import { useCallback } from 'react';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { deleteCommentAction } from '@/modules/comments/actions/delete-comment.action';
import type { Comment } from '@/modules/comments/types/comment.type';
import AvatarInitials from '@/shared/components/avatar-initials';
import { Button } from '@/shared/components/ui/button';
import dayjs from '@/shared/lib/dayjs';

export default function CommentItem(comment: Comment) {
  const { user } = useAuth();

  const deleteComment = useCallback(async () => {
    await deleteCommentAction(comment.id);
  }, [comment.id]);

  return (
    <div className="space-y-2 border-b pb-6 [&:nth-last-child(2)]:border-b-0 [&:nth-last-child(2)]:pb-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="relative flex-shrink-0">
            <div className="ring-background relative h-8 w-8 overflow-hidden rounded-full ring-2">
              <AvatarInitials
                name={comment.user.name}
                src=""
                alt={comment.user.name}
                className="size-full object-cover"
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-sm leading-none font-medium">
              {comment.user.name}
            </p>
            <p className="text-muted-foreground text-xs">
              {dayjs(comment.createdAt).format('DD/MM/YYYY HH:mm')}
            </p>
          </div>
        </div>
        {user?.id === comment.userId && (
          <Button size="sm" variant="destructive" onClick={deleteComment}>
            <Trash2Icon className="size-4" />
          </Button>
        )}
      </div>
      <div className="bg-muted/50 ml-10 rounded-lg p-3">
        <p className="text-sm">{comment.content}</p>
      </div>
    </div>
  );
}
