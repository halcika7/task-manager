import type { SocketCallback } from '@/shared/hooks/use-socket';
import { useSocket } from '@/shared/hooks/use-socket';

export default function useTaskCreatedWebSocket(
  cb: SocketCallback<'taskCreated'>
) {
  useSocket('taskCreated', cb);
}
