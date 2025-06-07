import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../utils/dateUtils';
import Pagination from '../common/Pagination';

const SosRequestTable = ({ sosRequests }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const totalPages = Math.ceil(sosRequests.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRequests = sosRequests.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <div className="font-semibold text-gray-700 mb-2 text-xl text-center">
        SOS Request List
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b bg-gray-50">
            <th className="px-2 py-2 text-left">SOS ID</th>
            <th className="px-2 py-2 text-left">Sender</th>
            <th className="px-2 py-2 text-left">Location</th>
            <th className="px-2 py-2 text-left">Nearest Team</th>
            <th className="px-2 py-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {currentRequests.map((s) => (
            <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-2 py-2 text-left">{s.id}</td>
              <td className="px-2 py-2 text-left">{s.sender}</td>
              <td className="px-2 py-2 text-left">{s.location}</td>
              <td className="px-2 py-2 text-left">{s.nearest_team_ids}</td>
              <td className="px-2 py-2 text-left">{formatDate(s.createdAt)}</td>
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

SosRequestTable.propTypes = {
  sosRequests: PropTypes.array.isRequired,
};

export default SosRequestTable;
