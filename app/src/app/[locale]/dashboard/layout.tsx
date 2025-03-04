import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import type { ReactNode } from 'react';

import { auth } from '@/modules/auth/lib';
import type { User } from '@/modules/users/types/user.type';
import { AppHeader } from '@/shared/components/app-header';
import { SidebarInset, SidebarProvider } from '@/shared/components/ui/sidebar';
import { SocketProvider } from '@/shared/provider/socket.provider';

const AppSidebar = dynamic(() =>
  import('@/shared/components/app-sidebar').then(mod => mod.AppSidebar)
);

type Props = Readonly<{
  children: ReactNode;
}>;

export default async function DashboardLayout({ children }: Props) {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user as unknown as User} />
      <SidebarInset className="space-y-4 overflow-x-hidden p-4">
        <SocketProvider session={session}>
          <AppHeader />
          <section className="container mx-auto">{children}</section>
        </SocketProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}
