'use client';

import dynamic from 'next/dynamic';

import { useUserAction } from '@/modules/users/context/user-action.context';
import { Action } from '@/shared/provider/action.provider';

const DeleteUserDialog = dynamic(
  () =>
    import('@/modules/users/components/delete-user-dialog').then(
      mod => mod.DeleteUserDialog
    ),
  { ssr: false }
);
const EditUserDialog = dynamic(
  () =>
    import('@/modules/users/components/edit-user-dialog').then(
      mod => mod.EditUserDialog
    ),
  { ssr: false }
);
const CreateUserModal = dynamic(
  () =>
    import('@/modules/users/components/create-user-modal').then(
      mod => mod.CreateUserModal
    ),
  { ssr: false }
);
const UserFilterModal = dynamic(
  () =>
    import('@/modules/users/components/user-filter-modal').then(
      mod => mod.UserFilterModal
    ),
  { ssr: false }
);

export function UserDialogs() {
  const { action, handleSetSelectedData } = useUserAction();

  const handleClose = () => handleSetSelectedData(null, null);

  return (
    <>
      {action === Action.FILTERS && (
        <UserFilterModal
          open={action === Action.FILTERS}
          onClose={handleClose}
        />
      )}
      {action === Action.CREATE && (
        <CreateUserModal
          open={action === Action.CREATE}
          onClose={handleClose}
        />
      )}
      {action === Action.EDIT && (
        <EditUserDialog isOpen={action === Action.EDIT} onClose={handleClose} />
      )}
      {action === Action.DELETE && (
        <DeleteUserDialog
          isOpen={action === Action.DELETE}
          onClose={handleClose}
        />
      )}
    </>
  );
}
