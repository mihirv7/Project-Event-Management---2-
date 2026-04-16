import React from 'react'
import SimpleTable from '../components/SimpleTable'
import { useEffect, useState } from "react";
import axios from "axios";

export default function Users() {
  const [users, setUsers] = useState([]);

 useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  fetchUsers();
}, []);
  return (
    <SimpleTable
      title="Registered Users"
      subtitle="Admin can view all registered users from the user side"
      columns={[
        { key: 'fullName', label: 'Name' },
        { key: 'email', label: 'Email' },
        { key: 'password', label: 'Password' },
        { key: 'phone', label: 'Phone' },
      ]}
      data={users}
    />
  )
}
