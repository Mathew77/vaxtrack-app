import React, { useState } from 'react';
import { useCreateUser } from './../../hooks/apis/user/user-hooks';

const CreateUserForm: React.FC = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const { mutate: createUser, isPending, error, isSuccess } = useCreateUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(
      {
          username, email,
          password: '',
          last_login: null,
          is_superuser: false,
          is_staff: false,
          is_active: false,
          date_joined: '',
          first_name: '',
          last_name: '',
          phone_number: '',
          role: '',
          org_unit: '',
          active: false,
          created_by: '',
          created_date: '',
          modify_by: null,
          modify_date: null,
          fk_org_unit_level: null,
          groups: [],
          user_permissions: []
      },
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
        value={username}
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