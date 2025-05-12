import React, { useState, useEffect } from 'react';
import { FiEdit, FiTrash2, FiPlus, FiUpload, FiImage, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProductsTab = ({ API_URL }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    qte: '',
    category: '',
    sizes: '',
    image: null
  });

  // Fetch all products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8000/api/products`);
      setProducts(response.data);
      toast.success('Products loaded successfully');
    } catch (err) {
      toast.error('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch product images
  const fetchProductImages = async (productId) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${productId}/images`);
      setImages(response.data.images);
      setShowImagesModal(true);
    } catch (err) {
      toast.error('Failed to fetch product images');
      console.error('Error fetching product images:', err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, image: e.target.files[0] }));
  };

  // Handle multiple images upload
  const handleImagesUpload = (e) => {
    setNewImages([...e.target.files]);
  };

  // Create new product
  const createProduct = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading('Creating product...');
    
    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post(`http://localhost:8000/api/products`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setProducts([...products, response.data]);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        price: '',
        qte: '',
        category: '',
        sizes: '',
        image: null
      });
      toast.success('Product created successfully', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to create product', { id: loadingToast });
      console.error('Error creating product:', err);
    }
  };

  // Upload additional images
  const uploadProductImages = async () => {
    if (!newImages.length || !currentProduct) return;
    
    const loadingToast = toast.loading('Uploading images...');
    try {
      const formData = new FormData();
      newImages.forEach(image => {
        formData.append('images[]', image);
      });

      await axios.post(`http://localhost:8000/api/admin/products/${currentProduct.id}/add-images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      fetchProductImages(currentProduct.id);
      setNewImages([]);
      toast.success('Images uploaded successfully', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to upload images', { id: loadingToast });
      console.error('Error uploading images:', err);
    }
  };

  // Update product
  const updateProduct = async (product) => {
    const loadingToast = toast.loading('Updating product...');
    try {
      const response = await axios.put(`http://localhost:8000/products/${product.id}`, product);
      setProducts(products.map(p => p.id === product.id ? response.data : p));
      toast.success('Product updated successfully', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to update product', { id: loadingToast });
      console.error('Error updating product:', err);
    }
  };

  // Delete product
  const deleteProduct = async (productId) => {
    toast((t) => (
      <div className="flex flex-col space-y-2">
        <p>Are you sure you want to delete this product?</p>
        <div className="flex justify-end space-x-2">
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button 
            onClick={async () => {
              toast.dismiss(t.id);
              const loadingToast = toast.loading('Deleting product...');
              try {
                await axios.delete(`${API_URL}/products/${productId}`);
                setProducts(products.filter(p => p.id !== productId));
                toast.success('Product deleted successfully', { id: loadingToast });
              } catch (err) {
                toast.error('Failed to delete product', { id: loadingToast });
                console.error('Error deleting product:', err);
              }
            }}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ), {
      duration: 10000,
    });
  };

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.id.toString().includes(searchQuery) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-2">
        <h2 className="text-xl sm:text-2xl font-semibold">Product Management</h2>
        <div className="flex space-x-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:w-64">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
          >
            <FiPlus className="mr-1" /> Add
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{product.id}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.image && (
                          <img 
                            src={`http://localhost:8000/${product.image}`} 
                            alt={product.title}
                            className="w-10 h-10 rounded-md object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.title}</div>
                          <div className="text-xs text-gray-500 sm:hidden">Stock: {product.qte}</div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="line-clamp-2">{product.description}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(product.price).toFixed(2)}</td>
                    <td className="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.qte}</td>
                    <td className="hidden md:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setCurrentProduct(product);
                            fetchProductImages(product.id);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View images"
                        >
                          <FiImage size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setCurrentProduct(product);
                            setFormData({
                              title: product.title,
                              description: product.description,
                              price: product.price,
                              qte: product.qte,
                              category: product.category,
                              sizes: product.sizes,
                              image: null
                            });
                            setShowAddModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredProducts.length === 0 && !loading && (
            <div className="p-8 text-center text-gray-500">
              No products found matching your search criteria.
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {currentProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <form onSubmit={currentProduct ? (e) => { e.preventDefault(); updateProduct(formData); } : createProduct}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                      <input
                        type="number"
                        name="qte"
                        value={formData.qte}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sizes (comma separated)</label>
                    <input
                      type="text"
                      name="sizes"
                      value={formData.sizes}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {currentProduct ? 'Update Main Image (optional)' : 'Main Image'}
                    </label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      accept="image/*"
                      required={!currentProduct}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setCurrentProduct(null);
                      setFormData({
                        title: '',
                        description: '',
                        price: '',
                        qte: '',
                        category: '',
                        sizes: '',
                        image: null
                      });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {currentProduct ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Product Images Modal */}
      {showImagesModal && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Images for {currentProduct.title}
                </h3>
                <button
                  onClick={() => {
                    setShowImagesModal(false);
                    setCurrentProduct(null);
                    setImages([]);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add More Images
                </label>
                <div className="flex items-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleImagesUpload}
                    className="block w-full text-sm text-gray-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-indigo-50 file:text-indigo-700
                      hover:file:bg-indigo-100"
                    accept="image/*"
                  />
                  <button
                    onClick={uploadProductImages}
                    disabled={!newImages.length}
                    className={`ml-2 px-4 py-2 rounded-md ${newImages.length ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                  >
                    <FiUpload size={16} />
                  </button>
                </div>
              </div>
              
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`http://localhost:8000/${image.image_path}`}
                        alt={`Product ${index + 1}`}
                        className="w-full h-32 object-cover rounded-md"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            // Implement delete image functionality if needed
                            toast('Would you like to delete this image?', {
                              icon: '❓',
                              duration: 5000,
                            });
                          }}
                          className="text-white hover:text-red-400"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No images available for this product
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductsTab;