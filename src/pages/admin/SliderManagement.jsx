import React, { useState, useEffect } from 'react';
import { FiImage, FiEdit2, FiTrash2, FiPlus, FiUpload, FiX, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const SliderManagement = ({ API_URL }) => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSlideId, setExpandedSlideId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const token = sessionStorage.getItem('adminToken')
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    cta: 'Shop Now',
    image: null,
    link: '/',
    bg_color: 'bg-gradient-to-r from-amber-100 to-pink-200',
    order: 0,
    is_active: true
  });

  // Fetch slides from API
  const fetchSlides = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/slides`);
      setSlides(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch slides');
      console.error('Error fetching slides:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${API_URL}/upload-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
        
      });
      
      setFormData(prev => ({
        ...prev,
        image: response.data.url
      }));
      
      setImagePreview(response.data.url);
      toast.success('Image uploaded successfully!');
    } catch (err) {
      toast.error('Failed to upload image');
      console.error('Error uploading image:', err);
    } finally {
      setImageUploading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingSlide) {
        const token = sessionStorage.getItem('adminToken')
        // Update existing slide
        await axios.put(`${API_URL}/slides/${editingSlide.id}`, formData,{
          headers:{
            Authorization: `Bearer ${token}`
          }
        });
        toast.success('Slide updated successfully!');
      } else {
        // Create new slide
        await axios.post(`${API_URL}/slides`, formData,
          {
            headers:{
               Authorization: `Bearer ${token}`
            }
          }
        );
        toast.success('Slide created successfully!');
      }

      // Reset form and fetch updated slides
      setShowAddForm(false);
      setEditingSlide(null);
      setFormData({
        title: '',
        subtitle: '',
        cta: 'Shop Now',
        image: null,
        link: '/',
        bg_color: 'bg-gradient-to-r from-amber-100 to-pink-200',
        order: 0,
        is_active: true
      });
      setImagePreview(null);
      fetchSlides();
    } catch (err) {
      toast.error(`Failed to ${editingSlide ? 'update' : 'create'} slide`);
      console.error(`Error ${editingSlide ? 'updating' : 'creating'} slide:`, err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a slide
  const deleteSlide = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;

    try {
      await axios.delete(`http://localhost:8000/api/slides/${id}`,
        {
          headers:{
            Authorization: `Bearer ${token}`
          }
        }
      );
      toast.success('Slide deleted successfully!');
      fetchSlides();
    } catch (err) {
      toast.error('Failed to delete slide');
      console.error('Error deleting slide:', err);
    }
  };

  // Toggle slide details expansion
  const toggleSlideDetails = (id) => {
    setExpandedSlideId(expandedSlideId === id ? null : id);
  };

  // Initialize form for editing
  const initEditForm = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      cta: slide.cta,
      image: slide.image,
      link: slide.link,
      bg_color: slide.bg_color,
      order: slide.order,
      is_active: slide.is_active
    });
    setImagePreview(slide.image);
    setShowAddForm(true);
  };

  // Cancel form
  const cancelForm = () => {
    setShowAddForm(false);
    setEditingSlide(null);
    setFormData({
      title: '',
      subtitle: '',
      cta: 'Shop Now',
      image: null,
      link: '/',
      bg_color: 'bg-gradient-to-r from-amber-100 to-pink-200',
      order: 0,
      is_active: true
    });
    setImagePreview(null);
  };

  // Fetch slides on component mount
  useEffect(() => {
    fetchSlides();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Carousel Slides Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <FiPlus className="mr-2" />
          Add New Slide
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{error}</p>
        </div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {editingSlide ? 'Edit Slide' : 'Add New Slide'}
                </h3>
                <button onClick={cancelForm} className="text-gray-500 hover:text-gray-700">
                  <FiX size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Title</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Subtitle</label>
                      <textarea
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        rows="3"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Call to Action</label>
                      <input
                        type="text"
                        name="cta"
                        value={formData.cta}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Link URL</label>
                      <input
                        type="text"
                        name="link"
                        value={formData.link}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Background Color</label>
                      <select
                        name="bg_color"
                        value={formData.bg_color}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="bg-gradient-to-r from-amber-100 to-pink-200">Amber to Pink</option>
                        <option value="bg-gradient-to-r from-blue-50 to-indigo-100">Blue to Indigo</option>
                        <option value="bg-gradient-to-r from-rose-50 to-purple-100">Rose to Purple</option>
                        <option value="bg-gradient-to-r from-green-100 to-teal-200">Green to Teal</option>
                      </select>
                    </div>

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-2">Order</label>
                      <input
                        type="number"
                        name="order"
                        value={formData.order}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        min="0"
                      />
                    </div>

                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="is_active"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          is_active: e.target.checked
                        }))}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                        Active
                      </label>
                    </div>
                  </div>
                </div>

                {/* Image Upload */}
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2">Slide Image</label>
                  <div className="flex flex-col items-center justify-center w-full">
                    {imagePreview ? (
                      <div className="relative w-full h-64 mb-4">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData(prev => ({ ...prev, image: null }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <FiUpload className="w-8 h-8 text-gray-400 mb-3" />
                          <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleImageUpload}
                          accept="image/*"
                          required={!editingSlide}
                        />
                      </label>
                    )}
                    {imageUploading && (
                      <div className="mt-2 text-sm text-gray-500">Uploading image...</div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={cancelForm}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Slide'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slides List */}
      {loading && !showAddForm ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : slides.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No slides found. Add your first slide to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {slides.map((slide) => (
            <div key={slide.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between p-4 bg-gray-50">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-4">
                    <img
                      src={`${slide.image}`}
                      alt={slide.title}
                      className="w-full h-full object-cover rounded"
                    />
                    {!slide.is_active && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-xs text-white font-medium">INACTIVE</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{slide.title}</h3>
                    <p className="text-sm text-gray-500 truncate max-w-md">{slide.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleSlideDetails(slide.id)}
                    className="p-2 text-gray-500 hover:text-indigo-600"
                  >
                    {expandedSlideId === slide.id ? <FiChevronUp /> : <FiChevronDown />}
                  </button>
                  <button
                    onClick={() => initEditForm(slide)}
                    className="p-2 text-gray-500 hover:text-indigo-600"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => deleteSlide(slide.id)}
                    className="p-2 text-gray-500 hover:text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedSlideId === slide.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 border-t border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Details</h4>
                          <div className="space-y-2">
                            <p><span className="text-gray-500">Title:</span> {slide.title}</p>
                            <p><span className="text-gray-500">Subtitle:</span> {slide.subtitle}</p>
                            <p><span className="text-gray-500">CTA:</span> {slide.cta}</p>
                            <p><span className="text-gray-500">Link:</span> {slide.link}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Settings</h4>
                          <div className="space-y-2">
                            <p><span className="text-gray-500">Background:</span> {slide.bg_color}</p>
                            <p><span className="text-gray-500">Order:</span> {slide.order}</p>
                            <p><span className="text-gray-500">Status:</span> 
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                slide.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {slide.is_active ? 'Active' : 'Inactive'}
                              </span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4">
                        <h4 className="font-medium mb-2">Preview</h4>
                        <div className={`relative h-48 rounded-lg overflow-hidden ${slide.bg_color}`}>
                          <img
                            src={slide.image}
                            alt={slide.title}
                            className="absolute inset-0 w-full h-full object-cover object-center"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center p-6">
                            <div className="max-w-lg">
                              <h3 className="text-white text-2xl font-bold mb-2">{slide.title}</h3>
                              <p className="text-white mb-4">{slide.subtitle}</p>
                              <button className="bg-white text-gray-800 px-4 py-2 rounded-full">
                                {slide.cta}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderManagement;