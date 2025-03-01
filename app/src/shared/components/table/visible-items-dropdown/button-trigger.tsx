import { ChevronDownIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { forwardRef } from 'react';

import { items } from '@/shared/components/table/visible-items-dropdown/items';
import type { ButtonProps } from '@/shared/components/ui/button';
import { Button } from '@/shared/components/ui/button';

const ButtonTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ value, ...props }, ref) => {
    const t = useTranslations('table');
    return (
      <Button
        {...props}
        ref={ref}
        variant="outline"
        role="combobox"
        className="text-caption text-neutral-90 md:text-caption h-9 justify-between font-medium"
        aria-label="Items per page-label"
        id="Items per page-button"
        size="sm"
      >
        {value
          ? items.find(item => item.value === value)?.label
          : t('itemsPerPage')}
        <ChevronDownIcon className="ml-1 size-3 shrink-0" />
        <span className="sr-only">{t('itemsPerPage')}</span>
      </Button>
    );
  }
);
ButtonTrigger.displayName = 'ButtonTrigger';

export default ButtonTrigger;
