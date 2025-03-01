import dynamic from 'next/dynamic';
import type { SearchParams } from 'nuqs/server';

import { columns } from '@/modules/users/components/columns/columns';
import CreateUserModalTrigger from '@/modules/users/components/create-user-modal/create-user-modal-trigger';
import UserFilterModalTrigger from '@/modules/users/components/user-filter-modal/user-filter-modal-trigger';
import { UserActionProvider } from '@/modules/users/context/user-action.context';
import { getUsers } from '@/modules/users/service/get-users';
import type { User } from '@/modules/users/types/user.type';
import { loaderUsersParams } from '@/modules/users/utils/search-users-params';
import DataTable from '@/shared/components/table';

const UserDialogs = dynamic(() =>
  import('@/modules/users/components/user-dialogs').then(mod => mod.UserDialogs)
);

type Props = Readonly<{
  searchParams: Promise<SearchParams>;
}>;

export default async function UsersPage({ searchParams }: Props) {
  const params = await loaderUsersParams(searchParams);
  const usersResponse = await getUsers(params);

  return (
    <UserActionProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-3">
            <UserFilterModalTrigger />
            <CreateUserModalTrigger />
          </div>
        </div>
        <DataTable
          columns={columns}
          pageCount={usersResponse?.meta.totalPages || 0}
          initialData={(usersResponse?.data || []) as User[]}
          searchState={{
            pageIndex: params.page,
            pageSize: params.limit,
          }}
          to="/dashboard/users"
          rowCount={usersResponse?.meta.total || 0}
          initialSorting={[
            {
              id: params.orderBy,
              desc: params.orderDir === 'desc',
            },
          ]}
        />
        <UserDialogs />
      </div>
    </UserActionProvider>
  );
}
