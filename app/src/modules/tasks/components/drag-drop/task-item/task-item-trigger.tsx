import { MoreHorizontalIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ButtonProps } from '@/shared/components/ui/button';
import { Button } from '@/shared/components/ui/button';
import { cn } from '@/shared/utils/cn';

type Props = Readonly<ButtonProps & { isOpen?: boolean }>;

export default function TaskItemTrigger({ isOpen, ...props }: Props) {
  const t = useTranslations('tasks.taskItem');
  return (
    <Button
      variant="ghost"
      className={cn(
        'hover:bg-accent/10 -mt-2.5 -mr-2.5 h-8 w-8 p-0 transition-all group-hover:opacity-100 group-focus:opacity-100 sm:opacity-0',
        {
          'bg-accent/10 opacity-100': isOpen,
        }
      )}
      {...props}
    >
      <MoreHorizontalIcon className="h-4 w-4" />
      <span className="sr-only">{t('openMenu')}</span>
    </Button>
  );
}
