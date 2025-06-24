import { useState, useEffect } from "react";
import axios from "axios";
import AddProductImages from "./ProductImages";

function AllProducts() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    // Fetch all products
    axios.get("http://localhost:8000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm bg-white">
            {/* Product Image */}
            <img 
              src={`http://localhost:8000/${product.image}`} 
              alt={product.name}
              className="w-full h-40 object-cover rounded mb-4"
            />

            {/* Product Name */}
            <h2 className="text-lg font-semibold mb-2">{product.name}</h2>

            {/* Add Images Button */}
            <button 
              onClick={() => setSelectedProductId(product.id)} 
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Add Images
            </button>

            {/* Show Upload Form if selected */}
            {selectedProductId === product.id && (
              <div className="mt-4">
                <AddProductImages productId={product.id} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllProducts;
