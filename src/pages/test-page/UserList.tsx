import React from 'react';
import { useFetchUsers, useDeleteUser } from './../../hooks/apis/user/user-hooks';
import { User } from './../../hooks/apis/user/user-types';

const UserList: React.FC = () => {
  const { data: users, error, isLoading, refetch } = useFetchUsers();
  const { 
    mutate: deleteUser, 
    isPending, 
    isError: isDeleteError, 
    error: deleteError 
  } = useDeleteUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return (
    <div>
      Error: {error.message}
      <button onClick={() => refetch()}>Retry</button>
    </div>
  );

  return (
    <div>
      <h2>User List</h2>
      {!users || users.length === 0 ? (
        <p>No users available. Add some users using the form above.</p>
      ) : (
        <ul>
          {users?.map((user: User) => (
            <li key={user.id}>
              {user.name} ({user.email})
              <button
                onClick={() => deleteUser(user.id)}
                disabled={isPending}
              >
                {isPending ? 'Deleting...' : 'Delete'}
              </button>
              {isDeleteError && <div style={{ color: 'red' }}>Error: {deleteError?.message}</div>}
            </li>
          ))}
        </ul>
      )}
      {/* Button to manually trigger fetch */}
      <button onClick={() => refetch()} disabled={isLoading}>
        {isLoading ? 'Fetching...' : 'Refresh Users'}
      </button>
    </div>
  );
};

export default UserList;