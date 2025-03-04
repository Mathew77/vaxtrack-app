// UserList.tsx
import React from 'react';
import { useFetchUsers, useDeleteUser } from './../../hooks/apis/user/user-hook';
import { User } from './../../hooks/apis/user/user-types';

const UserList: React.FC = () => {
  const { data: users, error, isLoading } = useFetchUsers();
  const {
    mutate: deleteUser,
    isPending, // Updated property name
    isError: isDeleteError,
    error: deleteError,
  } = useDeleteUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map((user: User) => (
        <li key={user.id}>
          {user.name} ({user.email})
          <button
            onClick={() => deleteUser(user.id)}
            disabled={isPending} // Updated property name
          >
            {isPending ? 'Deleting...' : 'Delete'} // Updated property name
          </button>
          {isDeleteError && <div>Error: {deleteError?.message}</div>}
        </li>
      ))}
    </ul>
  );
};

export default UserList;
