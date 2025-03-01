import { Shield, UserCircle } from 'lucide-react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import { getTranslations } from 'next-intl/server';
import { getMe } from '@/modules/profile/service/get-me';
import { Tabs, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';

const SecurityTab = dynamic(
  () => import('@/modules/profile/components/security-tab')
);

const GeneralTab = dynamic(
  () => import('@/modules/profile/components/general-tab')
);

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your profile settings and security',
};

export default async function ProfilePage() {
  const user = await getMe();
  const t = await getTranslations('profile');

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <div className="max-w-max">
      <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
      <p className="text-muted-foreground mt-2">{t('description')}</p>

      <Tabs defaultValue="general" className="mt-6 w-full">
        <TabsList className="mb-6 grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <UserCircle className="h-4 w-4" />
            {t('tabs.general')}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {t('tabs.security')}
          </TabsTrigger>
        </TabsList>

        <div className="grid gap-8">
          <GeneralTab user={user} />

          <SecurityTab user={user} />
        </div>
      </Tabs>
    </div>
  );
}
