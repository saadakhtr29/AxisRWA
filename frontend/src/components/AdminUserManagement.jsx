import { useEffect, useState } from "react";
import { getAllUsers, updateUserRole } from "../services/api";

const roleOptions = ["investor", "partner", "admin"];

export default function AdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [updatingUserId, setUpdatingUserId] = useState(null);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingUserId(userId);
    try {
      await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("Role update failed:", err.message);
      alert("Failed to update user role.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  return (
    <section className="admin-users">
      <h2>User Role Management</h2>

      {users.length === 0 ? (
        <p>No registered users found.</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Wallet</th>
              <th>Current Role</th>
              <th>Update Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.email}</td>
                <td>{u.wallet}</td>
                <td>{u.role}</td>
                <td>
                  <select
                    value={u.role}
                    onChange={(e) =>
                      handleRoleChange(u.id, e.target.value)
                    }
                    disabled={updatingUserId === u.id}
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}