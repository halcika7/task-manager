import type { SocketCallback } from '@/shared/hooks/use-socket';
import { useSocket } from '@/shared/hooks/use-socket';

export default function useTaskDeletedWebSocket(
  cb: SocketCallback<'taskDeleted'>
) {
  useSocket('taskDeleted', cb);
}
