import type { SocketCallback } from '@/shared/hooks/use-socket';
import { useSocket } from '@/shared/hooks/use-socket';

export default function useTaskReminderWebSocket(
  cb: SocketCallback<'taskReminder'>
) {
  useSocket('taskReminder', cb);
}
