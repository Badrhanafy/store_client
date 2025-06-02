import { useState } from "react";
import axios from "axios";

function AddProductImages({ productId }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    // Preview
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      await axios.post(
        `http://192.168.187.1:8000/api/admin/products/${productId}/add-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Images uploaded successfully!");
      setSelectedFiles([]);
      setPreviewImages([]);
    } catch (error) {
      console.error(error);
      alert("Failed to upload images.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Add Images to Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-50 file:text-blue-700
                     hover:file:bg-blue-100"
        />

        {/* Preview */}
        {previewImages.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {previewImages.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="preview"
                className="w-24 h-24 object-cover rounded-lg border"
              />
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Upload Images
        </button>
      </form>
    </div>
  );
}

export default AddProductImages;
