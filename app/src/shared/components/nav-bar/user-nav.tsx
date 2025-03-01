'use client';

import {
  ActivityIcon,
  ListIcon,
  LogOut,
  User as UserIcon,
  UsersIcon,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import { LocaleLink } from '@/modules/i18n/routing';
import type { User } from '@/modules/users/types/user.type';
import { UserRole } from '@/modules/users/types/user.type';
import AvatarInitials from '@/shared/components/avatar-initials';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

type Props = Readonly<{
  user: User;
}>;

export default function UserNav({ user }: Props) {
  const t = useTranslations('main.userNav');
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative size-10 rounded-full"
          data-testid="user-nav-avatar"
        >
          <AvatarInitials
            name={user.name}
            src=""
            alt={user.name}
            className="size-10"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs leading-none">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <LocaleLink href="/dashboard" data-testid="locale-link-/dashboard">
            <DropdownMenuItem className="cursor-pointer">
              <ListIcon className="mr-2 size-4" />
              {t('tasks')}
            </DropdownMenuItem>
          </LocaleLink>
          {user.role === UserRole.ADMIN && (
            <LocaleLink
              href="/dashboard/users"
              data-testid="locale-link-/dashboard/users"
            >
              <DropdownMenuItem className="cursor-pointer">
                <UsersIcon className="mr-2 size-4" />
                {t('users')}
              </DropdownMenuItem>
            </LocaleLink>
          )}
          <LocaleLink
            href="/dashboard/profile"
            data-testid="locale-link-/dashboard/profile"
          >
            <DropdownMenuItem className="cursor-pointer">
              <UserIcon className="mr-2 size-4" />
              {t('profile')}
            </DropdownMenuItem>
          </LocaleLink>
          {user.role === UserRole.ADMIN && (
            <LocaleLink
              href="/dashboard/activity-logs"
              data-testid="locale-link-/dashboard/activity-logs"
            >
              <DropdownMenuItem className="cursor-pointer">
                <ActivityIcon className="mr-2 size-4" />
                {t('activityLogs')}
              </DropdownMenuItem>
            </LocaleLink>
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive cursor-pointer"
          onClick={logout}
        >
          <LogOut className="mr-2 size-4" data-testid="user-nav-sign-out" />
          {t('signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
