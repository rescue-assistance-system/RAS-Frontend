import React, { useEffect, useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';

import NewsForm from '../components/admin/Form/NewsForm';
import NewsCard from '../components/admin/Card/NewsCard';
import newsService from '../services/news.service';
// import { useForm } from 'react-hook-form';

const NewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsItems, setNewsItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await newsService.getAllCategories();
        setCategories(categoryResponse.data);

        const newsResponse = await newsService.getAllNews();
        const formattedNews = newsResponse.map((news) => ({
          id: news.id,
          title: news.title,
          description: news.content,
          category:
            categoryResponse.data.find((cat) => cat.id === news.category_id)
              ?.name || 'Unknown',
          image: news.image_url,
          status: 'Published',
          source: news.source,
          time: new Date(news.created_at).toLocaleString(),
        }));
        setNewsItems(formattedNews);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredNews = newsItems.filter((news) => {
    const matchesCategory =
      selectedCategory === 'All' || news.category === selectedCategory;
    const matchesSearch =
      news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      news.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedNews = [...filteredNews].sort((a, b) => {
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
  const currentItems = sortedNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);

  // Handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };
  const handleEdit = async (id) => {
    try {
      const response = await newsService.getNewsById(id);
      const newsDetails = response.data;
      setEditingNews({
        id: newsDetails.id,
        title: newsDetails.title,
        description: newsDetails.content,
        category: newsDetails.category_id,
        image: newsDetails.image_url,
        source: newsDetails.source,
        status: newsDetails.status,
        time: new Date(newsDetails.created_at).toLocaleString(),
      });
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching news by ID:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this article?'))
      return;
    try {
      await newsService.deleteNewsById(id);
      setNewsItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      alert('Delete failed!');
      console.error('Error deleting news:', error);
    }
  };
  const handleFormSubmit = async (formData) => {
    try {
      if (editingNews) {
        await newsService.updateNewsById(editingNews.id, {
          title: formData.title,
          content: formData.description,
          category_id: categories.find((cat) => cat.name === formData.category)
            ?.id,
          image_url: formData.images,
          source: formData.source,
          status: formData.status,
        });
        setNewsItems((prevItems) =>
          prevItems.map((item) =>
            item.id === editingNews.id
              ? {
                  ...item,
                  title: formData.title,
                  description: formData.description,
                  category: formData.category,
                  image: formData.images,
                  source: formData.source,
                  status: formData.status,
                }
              : item,
          ),
        );
      } else {
        const createdNews = await newsService.createNews({
          title: formData.title,
          content: formData.description,
          category_id: categories.find((cat) => cat.name === formData.category)
            ?.id,
          image_url: formData.images,
          source: formData.source,
          status: formData.status,
        });

        setNewsItems((prevItems) => [
          {
            id: createdNews.data.id,
            title: createdNews.data.title,
            description: createdNews.data.content,
            category: formData.category,
            image: createdNews.data.image_url,
            source: formData.source,
            status: createdNews.data.status,
            time: new Date(createdNews.data.created_at).toLocaleString(),
          },
          ...prevItems,
        ]);
      }

      setShowForm(false);
      setEditingNews(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="p-6">
      {showForm ? (
        <NewsForm
          onBack={() => {
            setShowForm(false);
            setEditingNews(null);
          }}
          onSubmit={handleFormSubmit}
          initialData={editingNews}
        />
      ) : (
        <>
          <div className="sticky top-0 z-10 bg-white pb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">News Management</h2>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-400 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
              >
                <PlusCircle className="w-5 h-5" />
                New Article
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {currentItems.map((news) => (
              <NewsCard
                key={news.id}
                news={{
                  ...news,
                  image: Array.isArray(news.image) ? news.image[0] : news.image,
                }}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
          {sortedNews.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm
                ? 'No news articles found matching your search.'
                : 'No news articles found in this category.'}
            </div>
          )}

          {sortedNews.length > 0 && (
            <div className="mt-6 flex justify-center">
              <nav className="flex gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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
                    onClick={() => handlePageChange(index + 1)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
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
        </>
      )}
    </div>
  );
};

export default NewsManagement;
