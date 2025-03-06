import React, { useState } from 'react';
import { useCreateUser } from './../../hooks/apis/user/user-hooks';

const CreateUserForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { mutate: createUser, isPending, error, isSuccess } = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(
      { name, email },
      {
        onSuccess: () => {
          setName('');
          setEmail('');
        },
        onError: (err) => {
          console.error('Create user failed:', err);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create User</h2>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      {isSuccess && <div style={{ color: 'green' }}>User creation Succesful!</div>}
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
    </form>
  );
};

export default CreateUserForm;