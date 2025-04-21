import React from 'react';
import PropTypes from 'prop-types';
import { Edit2, Trash2, Users, Phone, Calendar } from 'lucide-react';

const RescueTeamCard = ({
  id,
  phone,
  leader_name,
  gender,
  members,
  active_cases,
  description,
  created_at,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {leader_name}
            </h3>
            <div className="flex items-center gap-2 text-gray-600 mt-1">
              <Phone className="w-4 h-4" />
              <span>{phone}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-1 text-blue-600 hover:text-blue-800"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1 text-red-600 hover:text-red-800"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 line-clamp-2">{description}</p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{members} members</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className={`w-2 h-2 rounded-full ${active_cases > 0 ? 'bg-green-500' : 'bg-gray-400'}`}
            />
            <span>{active_cases} active cases</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4">
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              gender.toLowerCase() === 'male'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-pink-100 text-pink-800'
            }`}
          >
            {gender}
          </span>
        </div>
      </div>
    </div>
  );
};

RescueTeamCard.propTypes = {
  id: PropTypes.number.isRequired,
  phone: PropTypes.string.isRequired,
  leader_name: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  members: PropTypes.number.isRequired,
  active_cases: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  created_at: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default RescueTeamCard;
