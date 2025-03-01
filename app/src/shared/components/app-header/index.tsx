import { AppBreadcrumbs } from '@/shared/components/app-header/breadcrumbs';
import { Separator } from '@/shared/components/ui/separator';
import { SidebarTrigger } from '@/shared/components/ui/sidebar';

export function AppHeader() {
  return (
    <header className="container mx-auto flex shrink-0 items-center gap-2 transition-[width,height] ease-linear">
      <SidebarTrigger className="-ml-1" />
      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />
      <AppBreadcrumbs />
    </header>
  );
}
