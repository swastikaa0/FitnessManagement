import React, { useState } from 'react';
import { Edit, Trash2, Plus, Search } from 'lucide-react';

export default function UserManagementDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      role: 'Member',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Emma Smith',
      email: 'emma.smith@example.com',
      role: 'Coach',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      role: 'Admin',
      status: 'Active'
    },
    {
      id: 4,
      name: 'James Williams',
      email: 'james.williams@example.com',
      role: 'Member',
      status: 'Inactive'
    },
    {
      id: 5,
      name: 'Mary Brown',
      email: 'mary.brown@example.com',
      role: 'Member',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Patricia Taylor',
      email: 'patricia.taylor@example.com',
      role: 'Member',
      status: 'Active'
    },
    {
      id: 7,
      name: 'Michael Davis',
      email: 'michael.davis@example.com',
      role: 'Coach',
      status: 'Inactive'
    },
    {
      id: 8,
      name: 'Linda Wilson',
      email: 'linda.wilson@example.com',
      role: 'Member',
      status: 'Active'
    }
  ]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (userId) => {
    console.log('Edit user:', userId);
  };

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleAddUser = () => {
    console.log('Add new user');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-slate-800 text-white px-8 py-6">
        <h1 className="text-2xl font-bold">FITNESS MANAGEMENT SYSTEM</h1>
      </div>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">User Management</h2>
          
          {/* Top Controls */}
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleAddUser}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              <Plus size={20} />
              Add User
            </button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-lg">Name</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-lg">Email</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-lg">Role</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-lg">Status</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-700 text-lg">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-gray-800 font-medium">{user.name}</td>
                      <td className="py-4 px-6 text-gray-600">{user.email}</td>
                      <td className="py-4 px-6 text-gray-800">{user.role}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          user.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Edit user"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete user"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Results Info */}
          <div className="mt-6 text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>
    </div>
  );
}