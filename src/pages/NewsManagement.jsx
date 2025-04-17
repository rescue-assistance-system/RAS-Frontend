import React, { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';

import NewsForm from '../components/admin/Form/NewsForm';
import NewsCard from '../components/admin/Card/NewsCard';

const NewsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsItems, setNewsItems] = useState([
    {
      id: 1,
      title:
        "Asia's biggest typhoon of 2024 hit multiple countries in Southeast Asia",
      description:
        'Almost 600 people were killed across Vietnam (300 deaths), Myanmar (226 deaths), Laos (4 deaths), Thailand (42 deaths) and the Philippines (21 deaths). Most of the deaths are due to landslides and flash floods.',
      category: 'Weather',
      image:
        'https://eoimages.gsfc.nasa.gov/images/imagerecords/150000/150290/ISS067-E-302073_lrg.jpg',
      status: 'Published',
      time: '1 hour ago',
    },
    {
      id: 2,
      title: 'Northeast to see dangerous rip currents, huge waves',
      description: 'Northeast to see dangerous rip currents, huge waves...',
      category: 'Disaster',
      image:
        'https://img.freepik.com/free-photo/image-auto-accident-involving-two-cars_613910-7924.jpg',
      status: 'Draft',
      time: '2 hours ago',
    },
    {
      id: 3,
      title: 'Major earthquake strikes coastal region',
      description:
        'A powerful earthquake measuring 7.2 on the Richter scale has struck the coastal region...',
      category: 'Disaster',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '3 hours ago',
    },
    {
      id: 4,
      title: 'Heavy rainfall causes flooding in multiple areas',
      description:
        'Continuous heavy rainfall has led to severe flooding in several low-lying areas...',
      category: 'Weather',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '4 hours ago',
    },
    {
      id: 5,
      title: 'Major traffic accident on highway',
      description:
        'A multi-vehicle collision has occurred on the main highway during rush hour...',
      category: 'Accident',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Draft',
      time: '5 hours ago',
    },
    {
      id: 6,
      title: 'Tropical storm warning issued',
      description:
        'Meteorologists have issued a warning for an approaching tropical storm...',
      category: 'Weather',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '6 hours ago',
    },
    {
      id: 7,
      title: 'Landslide blocks major road',
      description:
        'A massive landslide has blocked the main road connecting two cities...',
      category: 'Disaster',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '7 hours ago',
    },
    {
      id: 8,
      title: 'Industrial accident at factory',
      description:
        'An explosion has occurred at a chemical factory in the industrial zone...',
      category: 'Accident',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Draft',
      time: '8 hours ago',
    },
    {
      id: 9,
      title: 'Record-breaking heatwave',
      description:
        'The region is experiencing its hottest temperatures in recorded history...',
      category: 'Weather',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '9 hours ago',
    },
    {
      id: 10,
      title: 'Bridge collapse investigation',
      description:
        'Authorities are investigating the cause of a major bridge collapse...',
      category: 'Accident',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Draft',
      time: '10 hours ago',
    },
    {
      id: 11,
      title: 'Forest fire spreads rapidly',
      description:
        'A large forest fire is spreading rapidly due to strong winds...',
      category: 'Disaster',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '11 hours ago',
    },
    {
      id: 12,
      title: 'Flash flood warning',
      description:
        'Emergency services have issued a flash flood warning for several areas...',
      category: 'Weather',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '12 hours ago',
    },
    {
      id: 13,
      title: 'Record-breaking heatwave',
      description:
        'The region is experiencing its hottest temperatures in recorded history...',
      category: 'Weather',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '9 hours ago',
    },
    {
      id: 14,
      title: 'Bridge collapse investigation',
      description:
        'Authorities are investigating the cause of a major bridge collapse...',
      category: 'Accident',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Draft',
      time: '10 hours ago',
    },
    {
      id: 15,
      title: 'Forest fire spreads rapidly',
      description:
        'A large forest fire is spreading rapidly due to strong winds...',
      category: 'Disaster',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '11 hours ago',
    },
    {
      id: 16,
      title: 'Flash flood warning',
      description:
        'Emergency services have issued a flash flood warning for several areas...',
      category: 'Weather',
      image:
        'https://cdn.britannica.com/34/127134-050-49EC55CD/Building-foundation-earthquake-Japan-Kobe-January-1995.jpg',
      status: 'Published',
      time: '12 hours ago',
    },
  ]);

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

  const handleSubmit = (newsData) => {
    if (editingNews) {
      const updatedNews = {
        ...newsData,
        id: editingNews.id,
        time: editingNews.time,
        image: newsData.images?.[0] || editingNews.image,
      };
      setNewsItems(
        newsItems.map((item) =>
          item.id === editingNews.id ? updatedNews : item,
        ),
      );
    } else {
      const newNews = {
        ...newsData,
        id: Date.now(),
        time: '1 minute ago',
        image: newsData.images?.[0] || 'https://via.placeholder.com/400x300',
      };
      setNewsItems([newNews, ...newsItems]);
    }
    setShowForm(false);
    setEditingNews(null);
  };

  const handleEdit = (news) => {
    const newsForEdit = {
      ...news,
      images: [news.image],
    };
    setEditingNews(newsForEdit);
    setShowForm(true);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedNews.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      {showForm ? (
        <NewsForm
          onBack={() => {
            setShowForm(false);
            setEditingNews(null);
          }}
          onSubmit={handleSubmit}
          initialData={editingNews}
        />
      ) : (
        <>
          {/* Sticky Container for Header and Filters */}
          <div className="sticky top-0 z-10 bg-white pb-6">
            {/* Header */}
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
                <option value="Weather">Weather</option>
                <option value="Disaster">Disaster</option>
                <option value="Accident">Accident</option>
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
              <NewsCard key={news.id} news={news} onEdit={handleEdit} />
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
