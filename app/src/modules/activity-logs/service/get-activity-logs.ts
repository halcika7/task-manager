import type { ActivityLogResponse } from '@/modules/activity-logs/types/activity-log.type';
import {
  type ActivityLogSearchParams,
  serializeActivityLogSearchParams,
} from '@/modules/activity-logs/utils/search-activity-log-params';
import { httpClient } from '@/shared/lib/http-client';

export async function getActivityLogs(params: ActivityLogSearchParams) {
  try {
    const queryString = serializeActivityLogSearchParams(params);

    const response = await httpClient.get<ActivityLogResponse>(
      `/activity-logs${queryString}`
    );

    return response.data;
  } catch {
    return null;
  }
}
