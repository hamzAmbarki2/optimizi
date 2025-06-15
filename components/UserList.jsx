import React from 'react';

function UserList({ users }) {
  if (!users || users.length === 0) {
    return <img src="assets/public/null.png" alt="No users" />;
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

export default UserList;