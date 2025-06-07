import React, { useState, useEffect } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import FirstAidCard from '../components/admin/Card/FirstAidCard';
import FirstAidForm from '../components/admin/Form/FirstAidForm';
import firstAidService from '../services/first_aid.service';

const FirstAidManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [editingFirstAid, setEditingFirstAid] = useState(null);
  const [firstAidGuides, setFirstAidGuides] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await firstAidService.getAllCategories();
        setCategories(categoryResponse.data);

        const firstAidResponse = await firstAidService.getAllFirstAid();
        const formattedFirstAid = firstAidResponse.map((firstAid) => ({
          id: firstAid.id,
          title: firstAid.title,
          description: firstAid.content,
          category_id: firstAid.category_id,
          category:
            categoryResponse.data.find((cat) => cat.id === firstAid.category_id)
              ?.name || 'Unknown',
          image: firstAid.image_url,
          status: firstAid.status || 'Published',
          time: new Date(firstAid.created_at).toLocaleString(),
        }));
        setFirstAidGuides(formattedFirstAid);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredGuides = firstAidGuides.filter((guide) => {
    const matchesCategory =
      selectedCategory === 'All' || guide.category === selectedCategory;
    const matchesSearch =
      guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedGuides = [...filteredGuides].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.time) - new Date(a.time);
      case 'oldest':
        return new Date(a.time) - new Date(b.time);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedGuides.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedGuides.length / itemsPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = async (id) => {
    try {
      const response = await firstAidService.getFirstAidById(id);
      const firstAidDetails = response.data;
      setEditingFirstAid({
        id: firstAidDetails.id,
        title: firstAidDetails.title,
        description: firstAidDetails.content,
        category_id: firstAidDetails.category_id,
        category:
          categories.find((cat) => cat.id === firstAidDetails.category_id)
            ?.name || 'Unknown',
        image: firstAidDetails.image_url,
        status: firstAidDetails.status,
        time: new Date(firstAidDetails.created_at).toLocaleString(),
      });
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching first aid by ID:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this guide?')) {
      try {
        await firstAidService.deleteFirstAidById(id);
        setFirstAidGuides((prevGuides) =>
          prevGuides.filter((guide) => guide.id !== id),
        );

        const remainingItems = firstAidGuides.length - 1;
        const maxPage = Math.ceil(remainingItems / itemsPerPage);
        if (currentPage > maxPage) {
          setCurrentPage(Math.max(1, maxPage));
        }
      } catch (error) {
        console.error('Error deleting first aid guide:', error);
      }
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingFirstAid) {
        await firstAidService.updateFirstAidById(editingFirstAid.id, {
          title: formData.title,
          content: formData.description,
          category_id: categories.find((cat) => cat.name === formData.category)
            ?.id,
          image_url: formData.images,
          status: formData.status,
        });
        console.log('Form FA  data submitted:', formData);
        setFirstAidGuides((prevItems) =>
          prevItems.map((item) =>
            item.id === editingFirstAid.id
              ? {
                  ...item,
                  title: formData.title,
                  description: formData.description,
                  category: formData.category,
                  image: formData.images,
                  status: formData.status,
                }
              : item,
          ),
        );
      } else {
        const createdFirstAid = await firstAidService.createFirstAid({
          title: formData.title,
          content: formData.description,
          category_id: categories.find((cat) => cat.name === formData.category)
            ?.id,
          image_url: formData.images,
          status: formData.status,
        });

        setFirstAidGuides((prevItems) => [
          {
            id: createdFirstAid.data.id,
            title: createdFirstAid.data.title,
            description: createdFirstAid.data.content,
            category: formData.category,
            image: createdFirstAid.data.image_url,
            status: createdFirstAid.data.status,
            time: new Date(createdFirstAid.data.created_at).toLocaleString(),
          },
          ...prevItems,
        ]);
      }

      setShowForm(false);
      setEditingFirstAid(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (showForm) {
    return (
      <FirstAidForm
        onBack={() => {
          setShowForm(false);
          setEditingFirstAid(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingFirstAid}
        categories={categories}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">First Aid Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <PlusCircle className="w-5 h-5" />
          New Guide
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search guides..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>

        <select
          className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="title">Title A-Z</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {currentItems.map((guide) => (
          <FirstAidCard
            key={guide.id}
            {...guide}
            categoryName={
              categories.find((cat) => cat.id === guide.category_id)?.name ||
              'Unknown'
            }
            guide={{
              ...guide,
              image: Array.isArray(guide.image) ? guide.image[0] : guide.image,
            }}
            onEdit={() => handleEdit(guide.id)}
            onDelete={() => handleDelete(guide.id)}
          />
        ))}
      </div>

      {sortedGuides.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm
            ? 'No first aid guides found matching your search.'
            : 'No first aid guides found in this category.'}
        </div>
      )}

      {sortedGuides.length > 0 && (
        <div className="mt-6 flex justify-center">
          <nav className="flex gap-2">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === 1
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'hover:bg-gray-50'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 border rounded-lg ${
                  currentPage === index + 1
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {index + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 border rounded-lg ${
                currentPage === totalPages
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'hover:bg-gray-50'
              }`}
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default FirstAidManagement;
