import type { SearchParams } from 'nuqs/server';

import ActivityLogFilterModalTrigger from '@/modules/activity-logs/components/activity-log-filter-modal/activity-log-filter-modal-trigger';
import ActivityLogTable from '@/modules/activity-logs/components/activity-log-table';
import { getActivityLogs } from '@/modules/activity-logs/service/get-activity-logs';
import type { ActivityLog } from '@/modules/activity-logs/types/activity-log.type';
import { activityLogSearchParamsLoader } from '@/modules/activity-logs/utils/search-activity-log-params';

type Props = Readonly<{
  searchParams: Promise<SearchParams>;
}>;

export default async function ActivityLogsPage({ searchParams }: Props) {
  const params = await activityLogSearchParamsLoader(searchParams);
  const activityLogsResponse = await getActivityLogs(params);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <ActivityLogFilterModalTrigger />
      </div>
      <ActivityLogTable
        pageCount={activityLogsResponse?.meta.totalPages || 0}
        initialData={(activityLogsResponse?.data || []) as ActivityLog[]}
        searchState={{
          pageIndex: params.page,
          pageSize: params.limit,
        }}
        rowCount={activityLogsResponse?.meta.total || 0}
        initialSorting={[
          {
            id: params.orderBy,
            desc: params.orderDir === 'desc',
          },
        ]}
      />
    </div>
  );
}
