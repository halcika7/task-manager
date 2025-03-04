import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';

import { auth } from '@/modules/auth/lib';
import type { User } from '@/modules/users/types/user.type';
import NavBar from '@/shared/components/nav-bar';

const MainFooter = dynamic(() => import('@/shared/components/main-footer'));

type Props = Readonly<{
  children: ReactNode;
}>;

export default async function MainLayout({ children }: Props) {
  const session = await auth();

  return (
    <main className="bg-background container mx-auto flex h-full min-h-screen w-screen flex-col items-center justify-center space-y-12">
      <NavBar user={session?.user as unknown as User} />
      {children}
      <MainFooter />
    </main>
  );
}
