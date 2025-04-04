import React, { useState } from 'react';
import { PlusCircle, Search } from 'lucide-react';
import FirstAidCard from '../components/admin/Card/FirstAidCard';
import FirstAidForm from '../components/admin/Form/FirstAidForm';

const FirstAidManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('time');
  const [showForm, setShowForm] = useState(false);
  const [editingFirstAid, setEditingFirstAid] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [firstAidGuides, setFirstAidGuides] = useState([
    {
      id: 1,
      title: 'Basic CPR Steps',
      description:
        'Learn the essential steps of CPR for adults, including chest compressions and rescue breaths.',
      category: 'CPR',
      image: '/images/cpr.jpg',
      status: 'Published',
      time: '2 days ago',
      symptoms: ['Unconsciousness', 'No breathing', 'No pulse'],
    },
    {
      id: 2,
      title: 'Treating Minor Burns',
      description:
        'How to properly treat first and second-degree burns using proper first aid techniques.',
      category: 'Wounds & Injuries',
      image: '/images/burns.jpg',
      status: 'Published',
      time: '1 week ago',
      symptoms: ['Redness', 'Pain', 'Blistering'],
    },
    {
      id: 3,
      title: 'Choking Response',
      description:
        'Quick guide on how to respond to choking emergencies in adults and children.',
      category: 'Breathing',
      image: '/images/choking.jpg',
      status: 'Draft',
      time: '3 hours ago',
      symptoms: ['Difficulty breathing', 'Coughing', 'Inability to speak'],
    },
  ]);

  const handleEdit = (firstAid) => {
    setEditingFirstAid(firstAid);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this guide?')) {
      setFirstAidGuides(firstAidGuides.filter((guide) => guide.id !== id));

      const remainingItems = firstAidGuides.length - 1;
      const maxPage = Math.ceil(remainingItems / itemsPerPage);
      if (currentPage > maxPage) {
        setCurrentPage(Math.max(1, maxPage));
      }
    }
  };

  const handleSubmit = (formData) => {
    if (editingFirstAid) {
      setFirstAidGuides(
        firstAidGuides.map((guide) =>
          guide.id === editingFirstAid.id
            ? {
                ...formData,
                image: formData.images?.[0]
                  ? URL.createObjectURL(formData.images[0])
                  : editingFirstAid.image,
              }
            : guide,
        ),
      );
    } else {
      // Add new guide
      setFirstAidGuides([
        ...firstAidGuides,
        {
          ...formData,
          image: formData.images?.[0]
            ? URL.createObjectURL(formData.images[0])
            : '/images/placeholder.jpg',
        },
      ]);
    }
    setShowForm(false);
    setEditingFirstAid(null);
  };

  const filteredGuides = firstAidGuides
    .filter((guide) => {
      const matchesSearch =
        guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === '' || guide.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'time') {
        return new Date(b.time) - new Date(a.time);
      }
      return a.title.localeCompare(b.title);
    });

  const totalPages = Math.ceil(filteredGuides.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGuides = filteredGuides.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  if (showForm) {
    return (
      <FirstAidForm
        onBack={() => {
          setShowForm(false);
          setEditingFirstAid(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingFirstAid}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">First Aid Guides</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600"
        >
          <PlusCircle className="w-5 h-5" />
          Add New Guide
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="CPR">CPR</option>
          <option value="Wounds & Injuries">Wounds & Injuries</option>
          <option value="Breathing">Breathing</option>
          <option value="Child Emergency">Child Emergency</option>
          <option value="Burns">Burns</option>
          <option value="Fractures">Fractures</option>
          <option value="Poisoning">Poisoning</option>
          <option value="Allergic Reactions">Allergic Reactions</option>
          <option value="Heat Stroke">Heat Stroke</option>
          <option value="Hypothermia">Hypothermia</option>
          <option value="Seizures">Seizures</option>
          <option value="Stroke">Stroke</option>
          <option value="Heart Attack">Heart Attack</option>
          <option value="Choking">Choking</option>
          <option value="Bleeding">Bleeding</option>
          <option value="Diabetes">Diabetes</option>
          <option value="Asthma">Asthma</option>
          <option value="Drowning">Drowning</option>
          <option value="Electric Shock">Electric Shock</option>
          <option value="Eye Injury">Eye Injury</option>
          <option value="Head Injury">Head Injury</option>
          <option value="Spinal Injury">Spinal Injury</option>
        </select>

        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="time">Sort by Time</option>
          <option value="title">Sort by Title</option>
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {paginatedGuides.map((guide) => (
          <FirstAidCard
            key={guide.id}
            {...guide}
            onEdit={() => handleEdit(guide)}
            onDelete={() => handleDelete(guide.id)}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg ${
                currentPage === page
                  ? 'bg-blue-800 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default FirstAidManagement;
