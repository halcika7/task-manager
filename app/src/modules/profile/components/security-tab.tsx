'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import type { User } from '@/modules/users/types/user.type';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { TabsContent } from '@/shared/components/ui/tabs';

const PasswordForm = dynamic(
  () =>
    import('@/modules/profile/components/password-form').then(
      mod => mod.PasswordForm
    ),
  { ssr: false }
);

type Props = Readonly<{
  user: User;
}>;

export default function SecurityTab({ user }: Props) {
  const t = useTranslations('profile.securityTab');
  return (
    <TabsContent value="security">
      <Card className="border-2">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <PasswordForm user={user} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
