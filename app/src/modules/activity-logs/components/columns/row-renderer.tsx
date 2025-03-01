import type { Row } from '@tanstack/react-table';

import type { ActivityLogWithSubRow } from '@/modules/activity-logs/components/activity-log-table';
import CommentDetails from '@/modules/activity-logs/components/columns/comment-details';
import TaskDetails from '@/modules/activity-logs/components/columns/task-details';
import UserDetails from '@/modules/activity-logs/components/columns/user-details';
import type { ActivityLog } from '@/modules/activity-logs/types/activity-log.type';
import type { Comment } from '@/modules/comments/types/comment.type';
import type { Task } from '@/modules/tasks/types/task.type';
import type { User } from '@/modules/users/types/user.type';
import { TableCell, TableRow } from '@/shared/components/ui/table';

type Props = Readonly<{
  row: Row<ActivityLogWithSubRow>;
}>;

const RowRenderer = ({ row }: Props) => {
  const renderDetails = () => {
    const action = row.original.action;

    if (action.includes('TASK')) {
      return <TaskDetails log={row.original as ActivityLog<Task>} />;
    }

    if (action.includes('USER')) {
      return <UserDetails log={row.original as ActivityLog<User>} />;
    }

    if (action.includes('COMMENT')) {
      return (
        <CommentDetails
          log={
            row.original as ActivityLog<{
              task: Task;
              comment: Comment;
            }>
          }
        />
      );
    }

    return null;
  };

  return (
    <TableRow className="group/row w-full">
      <TableCell className="w-full p-6" colSpan={6}>
        {renderDetails()}
      </TableCell>
    </TableRow>
  );
};

export default RowRenderer;
