import type { SocketCallback } from '@/shared/hooks/use-socket';
import { useSocket } from '@/shared/hooks/use-socket';

export default function useTaskUpdateWebSocket(
  cb: SocketCallback<'taskUpdated'>
) {
  useSocket('taskUpdated', cb);
}
