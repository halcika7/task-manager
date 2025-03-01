import { LanguagesIcon } from 'lucide-react';

import type { ButtonProps } from '@/shared/components/ui/button';
import { Button } from '@/shared/components/ui/button';

export default function LocaleSwitchTrigger(props: ButtonProps) {
  return (
    <Button variant="ghost" size="icon" aria-label="Language" {...props}>
      <LanguagesIcon className="size-4" />
    </Button>
  );
}
