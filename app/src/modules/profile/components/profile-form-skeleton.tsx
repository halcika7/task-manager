'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/shared/components/ui/button';
import { CardFooter } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

export function ProfileFormSkeleton() {
  const t = useTranslations('profile.profileForm');
  return (
    <div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label>{t('inputs.email.label')}</Label>
          <Input
            name="email"
            placeholder={t('inputs.email.placeholder')}
            autoComplete="email"
          />
        </div>
        <div className="grid gap-2">
          <Label>{t('inputs.name.label')}</Label>
          <Input
            name="name"
            placeholder={t('inputs.name.placeholder')}
            autoComplete="off"
          />
        </div>
      </div>
      <CardFooter className="px-0 pt-6">
        <div className="flex items-center gap-4">
          <Button type="submit" disabled className="px-8">
            {t('buttons.save')}
          </Button>
        </div>
      </CardFooter>
    </div>
  );
}
