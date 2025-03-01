import { Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { ButtonProps } from '@/shared/components/ui/button';
import { Button } from '@/shared/components/ui/button';

export default function MobileNavTrigger(props: ButtonProps) {
  const t = useTranslations('main.nav');
  return (
    <Button
      variant="ghost"
      className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
      {...props}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">{t('toggleMenu')}</span>
    </Button>
  );
}
