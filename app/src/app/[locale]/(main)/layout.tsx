import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import { getSession } from '@/modules/auth/lib/session';
import NavBar from '@/shared/components/nav-bar';

const MainFooter = dynamic(() => import('@/shared/components/main-footer'));

type Props = Readonly<{
  children: ReactNode;
}>;

export default async function MainLayout({ children }: Props) {
  const session = await getSession();

  return (
    <main className="bg-background container mx-auto flex h-full min-h-screen w-screen flex-col items-center justify-center space-y-12">
      <NavBar user={session?.user} />
      {children}
      <MainFooter />
    </main>
  );
}
