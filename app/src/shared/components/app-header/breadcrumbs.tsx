'use client';

import { usePathname } from 'next/navigation';
import { Fragment, useMemo } from 'react';

import type { LocaleLinkProps } from '@/modules/i18n/routing';
import { LocaleLink } from '@/modules/i18n/routing';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/shared/components/ui/breadcrumb';

interface BreadcrumbSegment {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

function formatBreadcrumbLabel(segment: string): string {
  // Remove any dynamic route parameters (e.g., [id] -> '')
  const cleanSegment = segment.replace(/\[.*?\]/g, '');

  // Split by hyphens and capitalize each word
  return cleanSegment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generateBreadcrumbs(pathname: string): BreadcrumbSegment[] {
  // Remove locale from pathname if it exists
  const pathWithoutLocale = pathname.split('/').slice(2).join('/');

  const segments = pathWithoutLocale.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbSegment[] = [];

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${decodeURIComponent(segment)}`;

    breadcrumbs.push({
      label: formatBreadcrumbLabel(decodeURIComponent(segment)),
      href: currentPath,
      isCurrentPage: index === segments.length - 1,
    });
  });

  return breadcrumbs;
}

export function AppBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => generateBreadcrumbs(pathname), [pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <Fragment key={breadcrumb.href}>
            <BreadcrumbItem key={breadcrumb.href}>
              {breadcrumb.isCurrentPage ? (
                <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink asChild>
                    <LocaleLink
                      href={breadcrumb.href as LocaleLinkProps['href']}
                    >
                      {breadcrumb.label}
                    </LocaleLink>
                  </BreadcrumbLink>
                </>
              )}
            </BreadcrumbItem>
            {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
