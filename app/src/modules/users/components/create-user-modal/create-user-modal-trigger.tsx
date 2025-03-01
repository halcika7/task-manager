'use client';

import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

import { useUserAction } from '@/modules/users/context/user-action.context';
import { Button } from '@/shared/components/ui/button';
import { Action } from '@/shared/provider/action.provider';
import { cn } from '@/shared/utils/cn';

export default function CreateUserModalTrigger() {
  const { setAction } = useUserAction();
  const t = useTranslations('users.createUserModal');

  const handleClick = useCallback(() => {
    setAction(Action.CREATE);
  }, [setAction]);

  return (
    <Button
      size="sm"
      className={cn(
        'relative h-9 gap-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600',
        'font-medium text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
        'transition-all duration-200 ease-in-out',
        'hover:from-blue-600 hover:to-blue-700 hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.05)]',
        'active:scale-[0.98] active:duration-75',
        'disabled:pointer-events-none disabled:opacity-50'
      )}
      onClick={handleClick}
    >
      <Plus className="size-4" strokeWidth={2.5} />
      {t('trigger')}
    </Button>
  );
}
