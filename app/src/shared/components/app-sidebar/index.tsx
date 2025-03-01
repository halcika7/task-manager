'use client';

import {
  CheckCircle,
  HistoryIcon,
  ListTodo,
  UserIcon,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { ComponentProps } from 'react';

import type { User } from '@/modules/users/types/user.type';
import { UserRole } from '@/modules/users/types/user.type';
import { LogoutButton } from '@/shared/components/app-sidebar/logout-button';
import LanguageSwitch from '@/shared/components/locale-switch';
import ThemeSwitch from '@/shared/components/theme-switch';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from '@/shared/components/ui/sidebar';

const navItems = [
  {
    title: 'nav.tasks',
    icon: ListTodo,
    href: '/dashboard',
    tooltip: 'nav.tasks',
  },
  {
    title: 'nav.users',
    icon: Users,
    href: '/dashboard/users',
    tooltip: 'nav.users',
    roles: [UserRole.ADMIN],
  },
  {
    title: 'nav.activityLogs',
    icon: HistoryIcon,
    href: '/dashboard/activity-logs',
    tooltip: 'nav.activityLogs',
    roles: [UserRole.ADMIN],
  },
  {
    title: 'nav.profile',
    icon: UserIcon,
    href: '/dashboard/profile',
    tooltip: 'nav.profile',
  },
];

type Props = Readonly<
  ComponentProps<typeof Sidebar> & {
    user: User;
  }
>;

export function AppSidebar({ user, ...props }: Props) {
  const t = useTranslations('appSidebar');
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuButton size="lg" asChild tooltip="TaskFlow">
            <Link
              href="/"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg p-2">
                <CheckCircle className="text-primary-foreground h-5 w-5" />
              </div>
              <div className="flex flex-col overflow-hidden transition-all data-[collapsed=true]:w-0 data-[collapsed=true]:opacity-0">
                <span className="truncate text-lg font-semibold tracking-tight">
                  TaskFlow
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {t('description')}
                </span>
              </div>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map(item =>
              !item.roles || item.roles.includes(user.role) ? (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={t(item.tooltip)}>
                    <Link
                      href={item.href}
                      className="hover:bg-accent flex w-full items-center gap-2 rounded-md p-2"
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{t(item.title)}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : null
            )}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarMenu className="gap-2">
            <SidebarMenuItem>
              <SidebarMenuButton className="" tooltip={t('nav.theme')} asChild>
                <ThemeSwitch className="w-full justify-start p-2" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                className="flex w-full items-center gap-2 rounded-md p-2"
                tooltip={t('nav.language')}
                asChild
              >
                <LanguageSwitch className="w-full justify-start p-2" />
              </SidebarMenuButton>
            </SidebarMenuItem>

            <LogoutButton />
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
