import React from "react";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-3xl mt-2 text-blue-600">120</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold">Total Users</h2>
            <p className="text-3xl mt-2 text-green-600">75</p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-3xl mt-2 text-purple-600">$5,230</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Order ID</th>
                <th className="p-2">User</th>
                <th className="p-2">Amount</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-center border-b">
                <td className="p-2">#1234</td>
                <td className="p-2">John Doe</td>
                <td className="p-2">$120</td>
                <td className="p-2 text-green-600">Paid</td>
              </tr>
              <tr className="text-center border-b">
                <td className="p-2">#1235</td>
                <td className="p-2">Jane Smith</td>
                <td className="p-2">$75</td>
                <td className="p-2 text-yellow-600">Pending</td>
              </tr>
              {/* zed rows hna */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
/// just changment
/// just changment
