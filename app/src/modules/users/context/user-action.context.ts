'use client';

import type { User } from '@/modules/users/types/user.type';
import { createActionContext } from '@/shared/provider/action.provider';

export const { Provider: UserActionProvider, useAction: useUserAction } =
  createActionContext<User>();
