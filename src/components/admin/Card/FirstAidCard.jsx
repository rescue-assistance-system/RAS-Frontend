import React from 'react';
import PropTypes from 'prop-types';
import { Clock, Edit, Trash2 } from 'lucide-react';

const FirstAidCard = ({
  id,
  title,
  description,
  category,
  image,
  status,
  time,
  symptoms,
  onEdit,
  onDelete,
}) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'CPR':
        return 'bg-red-100 text-red-800';
      case 'Wounds & Injuries':
        return 'bg-blue-100 text-blue-800';
      case 'Breathing':
        return 'bg-green-100 text-green-800';
      case 'Child Emergency':
        return 'bg-yellow-100 text-yellow-800';
      case 'Burns':
        return 'bg-orange-100 text-orange-800';
      case 'Fractures':
        return 'bg-purple-100 text-purple-800';
      case 'Poisoning':
        return 'bg-pink-100 text-pink-800';
      case 'Allergic Reactions':
        return 'bg-indigo-100 text-indigo-800';
      case 'Heat Stroke':
        return 'bg-amber-100 text-amber-800';
      case 'Hypothermia':
        return 'bg-cyan-100 text-cyan-800';
      case 'Seizures':
        return 'bg-fuchsia-100 text-fuchsia-800';
      case 'Stroke':
        return 'bg-rose-100 text-rose-800';
      case 'Heart Attack':
        return 'bg-pink-100 text-pink-800';
      case 'Choking':
        return 'bg-red-200 text-red-900';
      case 'Bleeding':
        return 'bg-red-300 text-red-900';
      case 'Diabetes':
        return 'bg-blue-200 text-blue-900';
      case 'Asthma':
        return 'bg-green-200 text-green-900';
      case 'Drowning':
        return 'bg-blue-300 text-blue-900';
      case 'Electric Shock':
        return 'bg-yellow-200 text-yellow-900';
      case 'Eye Injury':
        return 'bg-purple-200 text-purple-900';
      case 'Head Injury':
        return 'bg-orange-200 text-orange-900';
      case 'Spinal Injury':
        return 'bg-indigo-200 text-indigo-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(category)}`}
          >
            {category}
          </span>
          <div className="flex items-center text-gray-500 text-sm">
            <Clock className="w-4 h-4 mr-1" />
            {time}
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{description}</p>

        {/* Symptoms Preview */}
        {symptoms && symptoms.length > 0 && (
          <div className="mt-3">
            <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
            <div className="flex flex-wrap gap-1">
              {symptoms.slice(0, 3).map((symptom, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                >
                  {symptom}
                </span>
              ))}
              {symptoms.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{symptoms.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span
              className={`w-2 h-2 rounded-full ${
                status === 'Published'
                  ? 'bg-green-500'
                  : status === 'Draft'
                    ? 'bg-gray-500'
                    : 'bg-yellow-500'
              }`}
            ></span>
            <span className="text-sm text-gray-600">{status}</span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => onEdit()}
              className="p-1.5 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(id)}
              className="p-1.5 text-gray-600 hover:text-red-600 rounded-full hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

FirstAidCard.propTypes = {
  id: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  time: PropTypes.string.isRequired,
  symptoms: PropTypes.arrayOf(PropTypes.string),
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default FirstAidCard;
