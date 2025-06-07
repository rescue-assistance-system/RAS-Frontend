import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';

const AssignModal = ({ isOpen, onClose, caseData, rescueTeams, onAssign }) => {
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    setSelectedTeam('');
  }, [caseData, isOpen]);

  if (!isOpen || !caseData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/60">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative flex flex-col items-center">
        <button
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-6 text-center">
          Assign Rescue Team
        </h2>
        <div className="mb-6 w-full space-y-2">
          <div className="flex items-center gap-2">
            <label className="block font-semibold mb-0 w-18">Case ID:</label>
            <input
              type="text"
              value={caseData.id}
              disabled
              className="flex-1 border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block font-semibold mb-0 w-18">Status:</label>
            <input
              type="text"
              value={caseData.status}
              disabled
              className="flex-1 border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block font-semibold mb-0 w-18">Creator:</label>
            <input
              type="text"
              value={caseData.creator || '-'}
              disabled
              className="flex-1 border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block font-semibold mb-0 w-18">Created At:</label>
            <input
              type="text"
              value={caseData.createdAt ? formatDate(caseData.createdAt) : '-'}
              disabled
              className="flex-1 border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block font-semibold mb-0 w-18">
              Accepted Team:
            </label>
            <input
              type="text"
              value={caseData.assignedTeam || 'null'}
              disabled
              className="flex-1 border rounded px-3 py-2 bg-gray-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="block font-semibold mb-0 w-18">
              Nearest Teams:
            </label>
            <input
              type="text"
              value={caseData.nearestTeams || '-'}
              disabled
              className="flex-1 border rounded px-3 py-2 bg-gray-100"
            />
          </div>
        </div>
        <div className="mb-6 w-full">
          <label className="block font-semibold mb-2 text-left">
            Select Rescue Team:
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="">-- Select team --</option>
            {rescueTeams
              .filter((team) => team.status === 'available')
              .map((team) => (
                <option key={team.id} value={team.id}>
                  {team.team_name} ({team.phone_number || 'No phone'})
                </option>
              ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 w-full">
          <button
            className="px-5 py-2 rounded bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            disabled={!selectedTeam}
            onClick={() => onAssign(caseData, selectedTeam)}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

AssignModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  caseData: PropTypes.object,
  rescueTeams: PropTypes.array.isRequired,
  onAssign: PropTypes.func.isRequired,
};

export default AssignModal;
