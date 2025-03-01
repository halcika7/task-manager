'use client';

import { LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useAuth } from '@/modules/auth/hooks/use-auth';
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui/sidebar';

export function LogoutButton() {
  const t = useTranslations('appSidebar.nav');
  const { logout } = useAuth();

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className="text-destructive flex w-full cursor-pointer items-center gap-2 rounded-md p-2"
        tooltip={t('logout')}
        onClick={logout}
      >
        <LogOut className="h-5 w-5" />
        <span>{t('logout')}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
