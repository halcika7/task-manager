import { useMemo } from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';

type Props = Readonly<{
  name: string;
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}>;

function AvatarInitials({
  name,
  src,
  alt,
  className,
  width = 44,
  height = 44,
}: Props) {
  const initials = useMemo(() => {
    const splitName = name
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(n => n[0]);
    const initials = splitName.slice(0, 2).join('');
    return initials || 'NN';
  }, [name]);

  return (
    <Avatar className={className}>
      {src ? (
        <AvatarImage src={src} alt={alt} width={width} height={height} />
      ) : null}
      {!src && (
        <AvatarFallback className="bg-indigo-400 text-white uppercase">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default AvatarInitials;
