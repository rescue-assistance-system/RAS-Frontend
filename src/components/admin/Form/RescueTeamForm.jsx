import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ArrowLeft } from 'lucide-react';

const RescueTeamForm = ({ onBack, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    phone: '',
    leader_name: '',
    gender: 'Male',
    members: 0,
    active_cases: 0,
    description: '',
    account_id: 0,
    leader_id: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h2 className="text-2xl font-bold text-left">
          {initialData ? 'Edit Rescue Team' : 'Add New Rescue Team'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leader Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.leader_name}
              onChange={(e) =>
                setFormData({ ...formData, leader_name: e.target.value })
              }
              placeholder="Enter leader name"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="tel"
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Enter phone number"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Members
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.members}
              onChange={(e) =>
                setFormData({ ...formData, members: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Active Cases
            </label>
            <input
              type="number"
              required
              min="0"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.active_cases}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  active_cases: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account ID
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.account_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  account_id: parseInt(e.target.value),
                })
              }
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Leader ID
            </label>
            <input
              type="number"
              required
              min="1"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.leader_id}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  leader_id: parseInt(e.target.value),
                })
              }
            />
          </div>
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter team description"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-600"
          >
            {initialData ? 'Update Team' : 'Add Team'}
          </button>
        </div>
      </form>
    </div>
  );
};

RescueTeamForm.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  initialData: PropTypes.shape({
    id: PropTypes.number,
    phone: PropTypes.string,
    leader_name: PropTypes.string,
    gender: PropTypes.string,
    members: PropTypes.number,
    active_cases: PropTypes.number,
    description: PropTypes.string,
    account_id: PropTypes.number,
    leader_id: PropTypes.number,
  }),
};

export default RescueTeamForm;
