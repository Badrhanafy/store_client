import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit2, FiSave, FiX, FiCamera, FiLock } from 'react-icons/fi';
import { FaRegUserCircle, FaRegEnvelope, FaRegAddressCard, FaPhoneAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Account = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Generate elegant avatar with gradient
  const generateAvatar = (name) => {
    const gradients = [
      'bg-gradient-to-r from-rose-400 via-fuchsia-500 to-indigo-500',
      'bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500',
      'bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500',
      'bg-gradient-to-r from-violet-400 via-purple-500 to-blue-500'
    ];
    const firstLetter = name?.charAt(0).toUpperCase() || 'U';
    const gradient = gradients[Math.floor(Math.random() * gradients.length)];
    
    return (
      <div 
        className={`w-32 h-32 rounded-full flex items-center justify-center text-5xl font-light text-white ${gradient} shadow-lg`}
      >
        {firstLetter}
      </div>
    );
  };

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://192.168.1.13:8000/api/users/${id}`);
        setUser(response.data);
     /*    reset({
          name: response.data.name,
          email: response.data.email,
          phone: response.data.phone,
          address: response.data.address,
          role: response.data.role
        }); */
      } catch (error) {
        toast.error('Failed to fetch profile data', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          className: 'bg-gray-900 text-white'
        });
        alert("do not know why !")//navigate
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, reset]);

  // Handle image preview
  useEffect(() => {
    if (profileImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(profileImage);
    }
  }, [profileImage]);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      if (profileImage) {
        formData.append('profileImage', profileImage);
      }

      const response = await axios.put(`http://localhost:8000/api/users/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data);
      setIsEditing(false);
      setProfileImage(null);
      toast.success('Profile updated successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-gray-900 text-white'
      });
    } catch (error) {
      toast.error('Failed to update profile', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: 'bg-gray-900 text-white'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 mb-4"></div>
          <div className="h-6 w-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-500 font-light text-xl">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Luxurious Card Container */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Premium Header with Gradient */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-8 py-10 text-center relative">
            <div className="absolute top-4 right-4">
              {isEditing ? (
                <button 
                  onClick={() => {
                    setIsEditing(false);
                    setProfileImage(null);
                    setImagePreview('');
                  }}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FiX size={24} />
                </button>
              ) : (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  <FiEdit2 size={24} />
                </button>
              )}
            </div>
            
            {/* Profile Picture with Glow Effect */}
            <div className="flex justify-center mb-6">
              <div className="relative group">
                {imagePreview ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white border-opacity-30 shadow-xl group-hover:border-opacity-50 transition-all duration-300">
                    <img 
                      src={imagePreview} 
                      alt="Profile preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : user.profileImage ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white border-opacity-30 shadow-xl group-hover:border-opacity-50 transition-all duration-300">
                    <img 
                      src={user.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  generateAvatar(user.name)
                )}
                
                {isEditing && (
                  <label className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="px-4 py-2 bg-white text-gray-800 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors flex items-center text-sm font-medium">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => setProfileImage(e.target.files[0])}
                        className="hidden"
                      />
                      <FiCamera className="mr-2" />
                      {profileImage ? 'Change' : 'Upload'}
                    </div>
                  </label>
                )}
              </div>
            </div>
            
            <h1 className="text-3xl font-light text-white tracking-wide mb-1">{user.name}</h1>
            <p className="text-gray-300 font-light uppercase text-sm tracking-wider">{user.role}</p>
          </div>

          {/* Profile Content with Elegant Typography */}
          <div className="px-8 py-10">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-light text-gray-500 uppercase tracking-wider flex items-center">
                    <FaRegUserCircle className="mr-2 text-gray-400" />
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className="w-full px-4 py-3 border-b border-gray-200 focus:border-gray-900 focus:outline-none bg-transparent font-light text-gray-700"
                    />
                  ) : (
                    <p className="px-4 py-3 font-light text-gray-700 border-b border-gray-100">{user.name}</p>
                  )}
                  {errors.name && <p className="mt-1 text-xs text-rose-500 font-light">{errors.name.message}</p>}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-light text-gray-500 uppercase tracking-wider flex items-center">
                    <FaRegEnvelope className="mr-2 text-gray-400" />
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className="w-full px-4 py-3 border-b border-gray-200 focus:border-gray-900 focus:outline-none bg-transparent font-light text-gray-700"
                    />
                  ) : (
                    <p className="px-4 py-3 font-light text-gray-700 border-b border-gray-100">{user.email}</p>
                  )}
                  {errors.email && <p className="mt-1 text-xs text-rose-500 font-light">{errors.email.message}</p>}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-light text-gray-500 uppercase tracking-wider flex items-center">
                    <FaPhoneAlt className="mr-2 text-gray-400" />
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      {...register('phone')}
                      className="w-full px-4 py-3 border-b border-gray-200 focus:border-gray-900 focus:outline-none bg-transparent font-light text-gray-700"
                    />
                  ) : (
                    <p className="px-4 py-3 font-light text-gray-700 border-b border-gray-100">{user.phone || 'Not provided'}</p>
                  )}
                </div>

                {/* Role Field */}
                <div className="space-y-2">
                  <label className="block text-sm font-light text-gray-500 uppercase tracking-wider flex items-center">
                    <FiLock className="mr-2 text-gray-400" />
                    Account Role
                  </label>
                  <p className="px-4 py-3 font-light text-gray-700 border-b border-gray-100 capitalize">{user.role}</p>
                </div>

                {/* Address Field - Full Width */}
                <div className="md:col-span-2 space-y-2">
                  <label className="block text-sm font-light text-gray-500 uppercase tracking-wider flex items-center">
                    <FaRegAddressCard className="mr-2 text-gray-400" />
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      {...register('address')}
                      rows={2}
                      className="w-full px-4 py-3 border-b border-gray-200 focus:border-gray-900 focus:outline-none bg-transparent font-light text-gray-700 resize-none"
                    />
                  ) : (
                    <p className="px-4 py-3 font-light text-gray-700 border-b border-gray-100">{user.address || 'Not provided'}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons with Luxurious Styling */}
              {isEditing && (
                <div className="mt-12 flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setProfileImage(null);
                      setImagePreview('');
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-light uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg shadow-sm text-sm font-light uppercase tracking-wider text-white hover:from-gray-800 hover:to-gray-700 transition-all duration-300 flex items-center"
                  >
                    <FiSave className="mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;