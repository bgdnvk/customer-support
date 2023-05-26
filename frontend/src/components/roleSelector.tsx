'use client'

import { SetStateAction, useState } from "react";

export default function RoleSelector({setRole}: {setRole: any}) {
    const [selectedRole, setSelectedRole] = useState('');

    const handleRoleChange = (event: { target: { value: SetStateAction<string>; }; }) => {
      setSelectedRole(event.target.value);
      setRole(event.target.value);
    };
  
    return (
      <div>
        <label>
          <input
            type="radio"
            value="agent"
            checked={selectedRole === 'agent'}
            onChange={handleRoleChange}
          />
          Agent
        </label>
        <label>
          <input
            type="radio"
            value="customer"
            checked={selectedRole === 'customer'}
            onChange={handleRoleChange}
          />
          Customer
        </label>
        <label>
          <input
            type="radio"
            value="admin"
            checked={selectedRole === 'admin'}
            onChange={handleRoleChange}
          />
          Admin
        </label>
      </div>
    );
}