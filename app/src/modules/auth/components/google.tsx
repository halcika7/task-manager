'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { APP_API_URL } from '@/shared/constants';

export default function GoogleLogin() {
  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center"
      asChild
    >
      <Link href={APP_API_URL + '/auth/google'}>Google</Link>
    </Button>
  );
}
