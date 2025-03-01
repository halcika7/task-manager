import { SendIcon } from 'lucide-react';

import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';

export default function CreateCommentSkeleton() {
  return (
    <div className="flex gap-2">
      <Skeleton className="min-h-[80px] w-full rounded-md" />
      <Button type="submit" size="icon" disabled>
        <SendIcon className="size-4" />
      </Button>
    </div>
  );
}
