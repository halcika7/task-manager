import { CheckIcon } from 'lucide-react';
import type { MouseEventHandler } from 'react';
import { useCallback, useState } from 'react';

import ButtonTrigger from '@/shared/components/table/visible-items-dropdown/button-trigger';
import { items } from '@/shared/components/table/visible-items-dropdown/items';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/shared/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/shared/components/ui/popover';
import { cn } from '@/shared/utils/cn';

type Props = Readonly<{
  value: number;
  onChange: (value: number) => void;
  isDisabled?: boolean;
  onHoverPrefetch: (value: number) => void;
}>;

function VisibleItemsDropdown({
  value,
  onChange,
  isDisabled,
  onHoverPrefetch,
}: Props) {
  const [open, setOpen] = useState(false);

  const onSelectHandler = useCallback(
    (newValue: string) => {
      const numberValue = parseInt(newValue, 10);

      if (!Number.isNaN(numberValue) && value !== numberValue) {
        onChange(numberValue);
      }

      setOpen(false);
    },
    [onChange, value]
  );

  const onHover = useCallback(
    (value: number): MouseEventHandler<HTMLDivElement> =>
      () => {
        onHoverPrefetch(value);
      },
    [onHoverPrefetch]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <ButtonTrigger value={value} disabled={isDisabled} />
      </PopoverTrigger>
      <PopoverContent className="w-20 p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {items.map(item => (
                <CommandItem
                  key={item.value}
                  value={item.value.toString()}
                  onSelect={onSelectHandler}
                  className="text-sm font-normal"
                  onMouseEnter={onHover(item.value)}
                >
                  {item.label}
                  <CheckIcon
                    className={cn(
                      'ml-auto size-4',
                      value === item.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default VisibleItemsDropdown;
