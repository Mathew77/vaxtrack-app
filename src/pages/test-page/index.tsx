// App.tsx
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserList from './UserList';
import CreateUserForm from './CreateUserForm';

const queryClient = new QueryClient();

const TestPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <CreateUserForm />
      <UserList />
    </QueryClientProvider>
  );
};

export default TestPage;

