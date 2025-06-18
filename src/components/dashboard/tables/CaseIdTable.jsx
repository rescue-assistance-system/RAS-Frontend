import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/dateUtils';
import DetailModal from '../modals/DetailModal';
import Pagination from '../../common/Pagination';
import StatusBadge from '../../common/StatusBadge';

const CaseIdTable = ({
  caseIds,
  onAssignClick,
  sosRequests,
  rescueTeams,
  isPublic = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const rowsPerPage = 10;

  const handleOpenDetailModal = (caseData) => {
    setSelectedCase(caseData);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedCase(null);
  };

  const totalPages = Math.ceil(caseIds.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentCases = caseIds.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        caseData={selectedCase}
        sosRequests={sosRequests || []}
        rescueTeams={rescueTeams || []}
        isPublic={isPublic}
      />
      <div className="font-semibold text-gray-700 mb-2 text-xl text-center">
        Case ID List
      </div>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-gray-500 border-b bg-gray-50">
            <th className="px-2 py-2 text-left">Case ID</th>
            <th className="px-2 py-2 text-left">Status</th>
            <th className="px-2 py-2 text-left">Created At</th>
            <th className="px-2 py-2 text-left">Creator</th>
            <th className="px-2 py-2 text-left">Accepted Team</th>
            <th className="px-2 py-2 text-left">Nearest Teams</th>
            <th className="px-2 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentCases.map((c) => (
            <tr key={c.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-2 py-2 text-left">{c.id}</td>
              <td className="px-2 py-2 text-left">
                <StatusBadge status={c.status} />
              </td>
              <td className="px-2 py-2 text-left">{formatDate(c.createdAt)}</td>
              <td className="px-2 py-2 text-left">{c.creator || '-'}</td>
              <td className="px-2 py-2 text-left">
                {c.assignedTeam ? c.assignedTeam : '-'}
              </td>
              <td className="px-2 py-2 text-left">
                {c.nearestTeams && c.nearestTeams !== '' ? c.nearestTeams : '-'}
              </td>
              <td className="px-2 py-2 text-left">
                <div className="flex gap-2">
                  <button
                    className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-semibold"
                    onClick={() => handleOpenDetailModal(c)}
                  >
                    Detail
                  </button>
                  {c.status === 'pending' && (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold"
                      onClick={() => onAssignClick(c)}
                    >
                      Assign
                    </button>
                  )}
                </div>
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

CaseIdTable.propTypes = {
  caseIds: PropTypes.array.isRequired,
  onAssignClick: PropTypes.func.isRequired,
  sosRequests: PropTypes.array,
  rescueTeams: PropTypes.array,
};
CaseIdTable.defaultProps = {
  sosRequests: [],
  rescueTeams: [],
};

export default CaseIdTable;
