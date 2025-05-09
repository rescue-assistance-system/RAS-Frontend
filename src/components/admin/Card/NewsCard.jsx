import React from 'react';
import PropTypes from 'prop-types';
import { Clock, Edit, Trash2 } from 'lucide-react';

const NewsCard = ({ news, onEdit, onDelete }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
    <img
      src={news.image}
      alt={news.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            news.category === 'Weather'
              ? 'bg-blue-100 text-blue-600'
              : news.category === 'Disaster'
                ? 'bg-red-100 text-red-600'
                : 'bg-yellow-100 text-yellow-600'
          }`}
        >
          {news.category}
        </span>
        <div className="flex items-center text-gray-500 text-sm">
          <Clock className="w-4 h-4 mr-1" />
          {news.time}
        </div>
      </div>
      <h3 className="font-semibold text-lg mb-2 line-clamp-2">{news.title}</h3>
      <p className="text-gray-600 text-sm line-clamp-3">{news.description}</p>
      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              news.status === 'Published'
                ? 'bg-green-500'
                : news.status === 'Draft'
                  ? 'bg-gray-500'
                  : 'bg-  yellow-500'
            }`}
          ></span>
          <span className="text-sm text-gray-600">{news.status}</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => onEdit(news.id)}
            className="p-1.5 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(news.id)}
            className="p-1.5 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

NewsCard.propTypes = {
  news: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default NewsCard;
