'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';

import { ProfileFormSkeleton } from '@/modules/profile/components/profile-form-skeleton';
import type { User } from '@/modules/users/types/user.type';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { TabsContent } from '@/shared/components/ui/tabs';

const ProfileForm = dynamic(
  () =>
    import('@/modules/profile/components/profile-form').then(
      mod => mod.ProfileForm
    ),
  { ssr: false, loading: () => <ProfileFormSkeleton /> }
);

type Props = Readonly<{
  user: User;
}>;

export default function GeneralTab({ user }: Props) {
  const t = useTranslations('profile.generalTab');
  return (
    <TabsContent value="general">
      <Card className="border-2">
        <CardHeader className="space-y-1.5">
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm user={user} />
        </CardContent>
      </Card>
    </TabsContent>
  );
}
