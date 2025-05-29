import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = sessionStorage.getItem('adminToken');
        
        /* if (!token) {
          navigate('/login');
          return;
        } */

        const response = await axios.get('http://localhost:8000/api/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setAdminData(response.data.admin);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch admin profile');
        /* if (err.response?.status === 401 || err.response?.status === 403) {
          navigate('/admin/login');
        } */
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error!</strong>
      <span className="block sm:inline"> {error}</span>
    </div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 text-white">
          <h1 className="text-2xl font-bold">Admin Profile</h1>
        </div>
        
        <div className="p-6">
          {adminData && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold">
                    {adminData.name.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold">{adminData.name}</h2>
                  <p className="text-gray-600">{adminData.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Account Information</h3>
                  <div className="mt-2 space-y-2">
                    <p><span className="font-medium">Role:</span> <span className="capitalize">{adminData.role}</span></p>
                    <p><span className="font-medium">Member Since:</span> {new Date(adminData.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700">Security</h3>
                  <div className="mt-2 space-y-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      Change Password
                    </button>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium block">
                      Update Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;