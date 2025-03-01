'use client';

import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useUserAction } from '@/modules/users/context/user-action.context';
import type { User } from '@/modules/users/types/user.type';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Action } from '@/shared/provider/action.provider';

interface Props {
  user: User;
}

export function UserActions({ user }: Props) {
  const { handleSetSelectedData } = useUserAction();
  const { user: currentUser } = useAuth();
  const t = useTranslations('users.columns.userActions');

  if (currentUser?.id === user.id) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">{t('openMenu')}</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleSetSelectedData(user, Action.EDIT)}
        >
          <Pencil className="mr-2 size-4" />
          {t('edit')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleSetSelectedData(user, Action.DELETE)}
          className="text-destructive focus:text-destructive"
        >
          <Trash className="mr-2 size-4" />
          {t('delete')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
