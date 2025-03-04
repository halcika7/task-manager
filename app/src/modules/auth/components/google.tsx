'use client';

import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { BACKEND_URL } from '@/shared/constants';

export default function GoogleLogin() {
  return (
    <Button
      variant="outline"
      className="flex w-full items-center justify-center"
      asChild
    >
      <Link href={BACKEND_URL + '/auth/google'}>Google</Link>
    </Button>
  );
}
