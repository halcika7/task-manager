import { Moon, Sun } from 'lucide-react';

import type { ButtonProps } from '@/shared/components/ui/button';
import { Button } from '@/shared/components/ui/button';

export default function ThemeSwitchTrigger(props: ButtonProps) {
  return (
    <Button variant="ghost" size="icon" aria-label="Theme" {...props}>
      <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
