import { ActivityLogActions } from '@/modules/activity-logs/types/activity-log.type';

export const entityTypes = [
  { label: 'activityLogs.filterModal.entityTypes.USER', value: 'USER' },
  { label: 'activityLogs.filterModal.entityTypes.TASK', value: 'TASK' },
  { label: 'activityLogs.filterModal.entityTypes.COMMENT', value: 'COMMENT' },
];

export const activityLogActions: {
  label: string;
  value: ActivityLogActions;
}[] = [
  {
    label: 'activityLogs.filterModal.actions.CREATE_USER',
    value: ActivityLogActions.CREATE_USER,
  },
  {
    label: 'activityLogs.filterModal.actions.UPDATE_USER',
    value: ActivityLogActions.UPDATE_USER,
  },
  {
    label: 'activityLogs.filterModal.actions.DELETE_USER',
    value: ActivityLogActions.DELETE_USER,
  },
  {
    label: 'activityLogs.filterModal.actions.CREATE_TASK',
    value: ActivityLogActions.CREATE_TASK,
  },
  {
    label: 'activityLogs.filterModal.actions.UPDATE_TASK',
    value: ActivityLogActions.UPDATE_TASK,
  },
  {
    label: 'activityLogs.filterModal.actions.DELETE_TASK',
    value: ActivityLogActions.DELETE_TASK,
  },
  {
    label: 'activityLogs.filterModal.actions.CREATE_COMMENT',
    value: ActivityLogActions.CREATE_COMMENT,
  },
  {
    label: 'activityLogs.filterModal.actions.UPDATE_COMMENT',
    value: ActivityLogActions.UPDATE_COMMENT,
  },
  {
    label: 'activityLogs.filterModal.actions.DELETE_COMMENT',
    value: ActivityLogActions.DELETE_COMMENT,
  },
  {
    label: 'activityLogs.filterModal.actions.TASK_REMINDER',
    value: ActivityLogActions.TASK_REMINDER,
  },
];
