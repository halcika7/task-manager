export enum ActivityLogActions {
  CREATE_USER = 'CREATE_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  CREATE_TASK = 'CREATE_TASK',
  UPDATE_TASK = 'UPDATE_TASK',
  DELETE_TASK = 'DELETE_TASK',
  CREATE_COMMENT = 'CREATE_COMMENT',
  UPDATE_COMMENT = 'UPDATE_COMMENT',
  DELETE_COMMENT = 'DELETE_COMMENT',
  TASK_REMINDER = 'TASK_REMINDER',
}

export type ActivityLogAction = keyof typeof ActivityLogActions;

export interface ActivityLog<T = unknown> {
  id: string;
  action: ActivityLogAction;
  entityId: string;
  entityType: string;
  details: T;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ActivityLogResponse {
  data: ActivityLog[];
  meta: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}
