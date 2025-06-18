import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Pagination from '../../common/Pagination';

const RescueTeamsTable = ({ rescueTeams, isPublic = false }) => {
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelected(rescueTeams.map((t) => t.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectRow = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id],
    );
  };

  const totalPages = Math.ceil(rescueTeams.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentTeams = rescueTeams.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <div className="font-semibold text-gray-700 mb-2 text-xl text-center">
        Rescue Teams List
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b bg-gray-50">
            <th className="px-2 py-2 text-left">
              <input
                type="checkbox"
                checked={
                  selected.length === rescueTeams.length &&
                  rescueTeams.length > 0
                }
                onChange={handleSelectAll}
              />
            </th>
            <th className="px-2 py-2 text-left">Team Name</th>
            <th className="px-2 py-2 text-left">Description</th>
            <th className="px-2 py-2 text-wrap">Email</th>
            <th className="px-2 py-2 text-wrap">Phone Number</th>
            <th className="px-2 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentTeams.map((t) => (
            <tr
              key={t.id}
              className={`border-b last:border-0 hover:bg-gray-50 ${selected.includes(t.id) ? 'bg-blue-50' : ''}`}
            >
              <td className="px-2 py-2">
                <input
                  type="checkbox"
                  checked={selected.includes(t.id)}
                  onChange={() => handleSelectRow(t.id)}
                />
              </td>
              <td className="px-2 py-2 font-medium text-left text-gray-800 whitespace-pre-line">
                {t.team_name}
              </td>
              <td className="px-2 py-2 text-gray-700 text-left whitespace-pre-line align-top">
                {t.description || '-'}
              </td>
              <td className="px-2 py-2 text-gray-700 align-top">
                {t.email || '-'}
              </td>
              <td className="px-2 py-2 text-gray-700 align-top">
                {t.phone || '-'}
              </td>
              <td className="px-2 py-2 text-left align-top">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border
                    ${
                      t.status === 'available'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : t.status === 'busy'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-300'
                          : t.status === 'rescuing'
                            ? 'bg-red-100 text-red-700 border-red-300'
                            : 'bg-gray-100 text-gray-600 border-gray-300'
                    }
                  `}
                >
                  {t.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

RescueTeamsTable.propTypes = {
  rescueTeams: PropTypes.array.isRequired,
};

export default RescueTeamsTable;
