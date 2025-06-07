import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, X, Upload } from 'lucide-react';
import PropTypes from 'prop-types';
import newsService from '../../../services/news.service';
const NewsForm = ({ onBack, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      title: '',
      description: '',
      category: 'Weather',
      image: [],
      source: '',
      status: 'Draft',
    },
  );

  const [imagePreviews, setImagePreviews] = useState(
    Array.isArray(initialData?.image)
      ? initialData.image
      : initialData?.image
        ? [initialData.image]
        : [],
  );

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        category: initialData.category,
        image: Array.isArray(initialData.image)
          ? initialData.image
          : initialData.image
            ? [initialData.image]
            : [],
        source: initialData.source,
        status: initialData.status,
      });
      setImagePreviews(
        Array.isArray(initialData.image)
          ? initialData.image
          : initialData.image
            ? [initialData.image]
            : [],
      );
    }
  }, [initialData]);
  console.log('formData', formData);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let imageUrls = [];
    // Lọc ra các file chưa upload
    const filesToUpload = formData.image.filter((file) => file instanceof File);
    const oldUrls = formData.image.filter((file) => typeof file === 'string');
    if (filesToUpload.length > 0) {
      const uploadedUrls = await newsService.uploadFiles(filesToUpload);
      imageUrls = [...oldUrls, ...uploadedUrls];
    } else {
      imageUrls = oldUrls;
    }

    onSubmit({
      ...formData,
      images: imageUrls,
      id: initialData?.id || Date.now(),
      time: initialData?.time || 'Just now',
    });
  };
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews([...imagePreviews, ...newPreviews]);
      setFormData({ ...formData, image: [...formData.image, ...files] });
    }
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newimage = formData.image.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setFormData({ ...formData, image: newimage });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-2xl font-bold">
          {initialData ? 'Edit Article' : 'Add New Article'}
        </h2>
      </div>

      <div className="flex gap-10">
        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Enter article title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Description
            </label>
            <textarea
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="6"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter article description"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Category
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="Weather">Weather</option>
              <option value="Disaster">Disaster</option>
              <option value="Accident">Accident</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Source
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.source}
              onChange={(e) =>
                setFormData({ ...formData, source: e.target.value })
              }
              placeholder="Enter article source"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 text-left">
              Status
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
              <option value="Archived">Archived</option>
            </select>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {initialData ? 'Update Article' : 'Add Article'}
            </button>
          </div>
        </form>
        <div className="w-135 mt-6.5">
          <div className="sticky top-6">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Article image
              </h3>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload files</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative inline-block">
                    <div className="border-2 border-gray-200 rounded-lg p-1">
                      <img
                        src={
                          typeof preview === 'string'
                            ? preview
                            : URL.createObjectURL(preview)
                        }
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

NewsForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    category: PropTypes.string,
    image: PropTypes.array,
    source: PropTypes.string,
    status: PropTypes.string,
    time: PropTypes.string,
  }),
};

export default NewsForm;
