import React, { useEffect, useState } from 'react';
import MapComponent from '../components/admin/MapView';
import sosCoordinatorService from '../services/sos.coordinator.service';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { jwtDecode } from 'jwt-decode';
import rescueTeamService from '../services/rescueTeam.service';
import {
  FaRegBell,
  FaHourglassHalf,
  FaCheckCircle,
  FaUsers,
} from 'react-icons/fa';

const AssignModal = ({ isOpen, onClose, caseData, rescueTeams, onAssign }) => {
  const [selectedTeam, setSelectedTeam] = useState('');

  useEffect(() => {
    setSelectedTeam('');
  }, [caseData, isOpen]);

  if (!isOpen || !caseData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/60">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col items-center max-h-[80vh]">
        <div className="w-full overflow-y-auto p-8">
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
              <label className="block font-semibold mb-0 w-18">
                Created At:
              </label>
              <input
                type="text"
                value={
                  caseData.createdAt ? formatDate(caseData.createdAt) : '-'
                }
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
                .map((team) => {
                  console.log('Rescue team user_id:', team.user_id);
                  console.log('Rescue team phone_number:', team);
                  return (
                    <option key={team.user_id} value={team.user_id}>
                      {team.team_name} ({team.phone_number || 'No phone'})
                    </option>
                  );
                })}
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

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center space-x-2 mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded ${
          currentPage === 1
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Previous
      </button>
      <span className="text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded ${
          currentPage === totalPages
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        }`}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

const StatCard = ({ title, mainStat, subStat, color, icon }) => (
  <div
    className={`bg-white rounded-xl shadow-lg p-6 flex items-center gap-4 border-l-4 ${
      color === 'red'
        ? 'border-red-400'
        : color === 'orange'
          ? 'border-orange-400'
          : color === 'green'
            ? 'border-green-400'
            : color === 'blue'
              ? 'border-blue-400'
              : 'border-gray-300'
    }`}
  >
    <div className="flex-1 flex flex-col items-center justify-center">
      <div
        className={`text-base font-semibold mb-1 ${
          color === 'red'
            ? 'text-red-500'
            : color === 'orange'
              ? 'text-orange-500'
              : color === 'green'
                ? 'text-green-500'
                : color === 'blue'
                  ? 'text-blue-500'
                  : 'text-gray-700'
        }`}
      >
        {title}
      </div>
      <div
        className={`text-3xl font-bold mb-1 ${
          color === 'red'
            ? 'text-red-600'
            : color === 'orange'
              ? 'text-orange-600'
              : color === 'green'
                ? 'text-green-600'
                : color === 'blue'
                  ? 'text-blue-600'
                  : 'text-gray-800'
        }`}
      >
        {mainStat}
      </div>
      {subStat && <div className="text-sm text-gray-400">{subStat}</div>}
    </div>
    <div className="text-4xl">{icon}</div>
  </div>
);

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  mainStat: PropTypes.string.isRequired,
  subStat: PropTypes.string,
  color: PropTypes.string.isRequired,
  icon: PropTypes.node,
};

const SmallCard = ({ icon, title, value, description, color }) => (
  <div
    className={`bg-white rounded-lg shadow p-4 flex items-center gap-4 border-l-4 border-${color}-500`}
  >
    <div className={`text-3xl text-${color}-500`}>{icon}</div>
    <div>
      <div className="font-semibold text-gray-700">{title}</div>
      <div className={`text-xl font-bold text-${color}-600`}>{value}</div>
      {description && (
        <div className="text-xs text-gray-400">{description}</div>
      )}
    </div>
  </div>
);

SmallCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  description: PropTypes.string,
  color: PropTypes.string.isRequired,
};

const RescueTeamsTable = ({ rescueTeams }) => {
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
            {/* <th className="px-2 py-2 text-wrap">Address</th> */}
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
              {/* <td className="px-2 py-2 text-gray-700 align-top">
                {t.address || '-'}
              </td> */}
              <td className="px-2 py-2 text-gray-700 align-top">
                {t.phone || '-'}
              </td>
              <td className="px-2 py-2 text-left align-top ">
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

// const RecentlyInstalledApp = () => (
//   <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
//     <div className="font-semibold text-gray-700 mb-2">
//       Recently Installed App
//     </div>
//     <div className="flex items-center gap-3">
//       <img
//         src="https://cdn.worldvectorlogo.com/logos/prestashop.svg"
//         alt="PrestaShop"
//         className="w-10 h-10"
//       />
//       <div>
//         <div className="font-bold text-gray-800">PrestaShop</div>
//         <div className="text-xs text-gray-400">eCommerce</div>
//       </div>
//     </div>
//   </div>
// );

const SOSCard = ({ sosData }) => {
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!sosData?.createdAt) return;

    const calculateTimeLeft = () => {
      const createdAt = new Date(sosData.createdAt);
      const now = new Date();
      const diff = now - createdAt;
      const totalSeconds = Math.floor(diff / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ minutes, seconds });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [sosData]);

  const formatCoordinates = (lat, lng) => {
    return `${lat.toFixed(3)}°N, ${lng.toFixed(3)}°E`;
  };

  return (
    <div className="absolute bottom-4 right-5 w-80 max-w-xs bg-white/95 rounded-xl shadow-2xl p-5 flex flex-col gap-3 border border-red-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl text-red-500">●</span>
          <span className="font-bold text-lg text-red-600">SOS</span>
          <span className="font-bold text-lg text-red-500">
            #{sosData?.id || '---'}
          </span>
        </div>
        <span className="text-gray-500 font-medium">
          {sosData?.location || '---'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>⏰ Waiting time:</span>
        <span className="font-semibold text-black">
          {timeLeft.minutes} min {timeLeft.seconds} sec (countdown to 10&apos;)
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>📍 Location:</span>
        <span className="font-semibold text-black">
          {sosData?.latitude && sosData?.longitude
            ? formatCoordinates(sosData.latitude, sosData.longitude)
            : '---'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>🔥 Severity:</span>
        <span className="font-semibold text-red-500">
          {sosData?.severity || '---'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>👤 Sender:</span>
        <span className="font-semibold text-black">
          {sosData?.sender || '---'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-600 text-sm">
        <span>📝 Description:</span>
        <span className="font-semibold text-black">
          {sosData?.description || '---'}
        </span>
      </div>
      <div className="flex gap-2 mt-2">
        <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition">
          ✅ Assign now
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition">
          🗺 View map
        </button>
      </div>
    </div>
  );
};

SOSCard.propTypes = {
  sosData: PropTypes.shape({
    id: PropTypes.string,
    location: PropTypes.string,
    createdAt: PropTypes.string,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    severity: PropTypes.string,
    sender: PropTypes.string,
    description: PropTypes.string,
  }),
};

const DetailModal = ({ isOpen, onClose, caseData, sosRequests }) => {
  const [message, setMessage] = useState('');

  const handleNotify = async () => {
    try {
      if (!message.trim()) {
        toast.error('Please enter a message');
        return;
      }
      await sosCoordinatorService.notifyRescueTeam({
        caseId: caseData.id,
        message: message,
      });
      toast.success('Notification sent successfully');
      alert('Notification has been sent successfully to the rescue team!');
      setMessage('');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
      alert('Failed to send notification. Please try again.');
    }
  };

  if (!isOpen || !caseData) return null;

  const relatedSos = sosRequests
    ? sosRequests.filter((sos) => sos.case_id === caseData.id)
    : [];
  console.log(sosRequests);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/60">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative flex flex-col items-center max-h-[80vh]">
        <div className="w-full overflow-y-auto p-8">
          <button
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-6 text-center">Case Details</h2>
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
              <label className="block font-semibold mb-0 w-18">
                Created At:
              </label>
              <input
                type="text"
                value={
                  caseData.createdAt ? formatDate(caseData.createdAt) : '-'
                }
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
              Send Notification:
            </label>
            <textarea
              className="w-full border rounded px-3 py-2 mb-2"
              rows="3"
              placeholder="Enter notification message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              className="w-full px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              onClick={handleNotify}
            >
              Send Notification
            </button>
          </div>
          <div className="mb-6 w-full">
            <label className="block font-semibold mb-2 text-left">
              SOS History for this Case:
            </label>
            {relatedSos.length === 0 ? (
              <div className="text-gray-500">No SOS history for this case.</div>
            ) : (
              <div className="overflow-x-auto max-h-60">
                <table className="min-w-full text-sm border">
                  <thead className="bg-gray-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-2 py-2 border">ID</th>
                      <th className="px-2 py-2 border">Sender</th>
                      <th className="px-2 py-2 border">Time</th>
                      <th className="px-2 py-2 border">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedSos.map((sos) => (
                      <tr key={sos.id} className="hover:bg-blue-50">
                        <td className="px-2 py-2 border text-center">
                          {sos.id}
                        </td>
                        <td className="px-2 py-2 border">
                          {sos.sender || '-'}
                        </td>
                        <td className="px-2 py-2 border">
                          {formatDate(sos.createdAt)}
                        </td>
                        <td className="px-2 py-2 border">
                          {sos.location || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

DetailModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  caseData: PropTypes.object,
  sosRequests: PropTypes.array,
};

const CaseIdTable = ({ caseIds, onAssignClick, sosRequests }) => {
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
        sosRequests={sosRequests}
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
  sosRequests: PropTypes.array.isRequired,
};

const SosRequestTable = ({ sosRequests }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  console.log(sosRequests);
  const totalPages = Math.ceil(sosRequests.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRequests = sosRequests.slice(startIndex, endIndex);
  console.log(currentRequests);

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
            <th className="px-2 py-2 text-left">Nearest Teams</th>
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

const MapLegend = () => (
  <div className="absolute top-6 left-6 bg-white bg-opacity-90 rounded-lg shadow-lg p-4 z-30 mt-50 w-60">
    <div className="font-bold mb-2">Notes</div>
    <div className="mb-2">
      <div className="flex items-center mb-1">
        <i className="bx bx-group text-green-600 text-xl mr-2"></i>
        <span>Rescue Team Available</span>
      </div>
      {/* <div className="flex items-center mb-1">
        <i className="bx bx-group text-yellow-400 text-xl mr-2"></i>
        <span>Rescue Team Busy</span>
      </div> */}
      <div className="flex items-center mb-1">
        <i className="bx bx-group text-orange-500 text-xl mr-2"></i>
        <span>Rescue Team Rescuing</span>
      </div>
      <div className="flex items-center mb-1">
        <i className="bx bx-error text-red-500 text-xl mr-2"></i>
        <span>SOS Request</span>
      </div>
    </div>
  </div>
);

const mapCaseIds = (data) => {
  return data.map((item) => ({
    id: item.case.id,
    status: item.case.status,
    createdAt: item.case.created_at,
    creator: item.user?.username || '-',
    assignedTeam: item.case.accepted_team_id,
    nearestTeams: item.sosRequests?.[0]?.nearest_team_ids?.join(', ') || '-',
  }));
};

const mapSosRequests = (data) => {
  let sosList = [];
  data.forEach((item) => {
    item.sosRequests?.forEach((sos) => {
      sosList.push({
        id: sos.id,
        sender: item.user?.username || '-',
        location: `${sos.latitude}, ${sos.longitude}`,
        // severity: '-',
        nearest_team_ids: sos.nearest_team_ids?.join(', ') || '-',
        createdAt: sos.created_at,
        case_id: item.case.id,
      });
    });
  });
  return sosList;
};

const formatDate = (isoString) => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  date.setHours(date.getHours() + 7);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const StatusBadge = ({ status }) => {
  let colorClass = '';
  let text = status;

  switch (status) {
    case 'completed':
      colorClass = 'bg-blue-100 text-blue-700 border-blue-300';
      text = 'Completed';
      break;
    case 'cancelled':
      colorClass = 'bg-gray-200 text-gray-700 border-gray-400';
      text = 'Cancelled';
      break;
    case 'pending':
      colorClass = 'bg-yellow-100 text-yellow-700 border-yellow-300';
      text = 'Pending';
      break;
    case 'ready':
      colorClass = 'bg-indigo-100 text-indigo-700 border-indigo-300';
      text = 'Ready';
      break;
    case 'accepted':
      colorClass = 'bg-purple-100 text-purple-700 border-purple-300';
      text = 'Accepted';
      break;
    case 'expired':
      colorClass = 'bg-red-100 text-red-700 border-red-300';
      text = 'Expired';
      break;
    case 'safe':
      colorClass = 'bg-green-100 text-green-700 border-green-300';
      text = 'Safe';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-600 border-gray-300';
      text = status;
      break;
  }

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-bold border ${colorClass}`}
      style={{ display: 'inline-block', minWidth: 80, textAlign: 'center' }}
    >
      {text}
    </span>
  );
};

StatusBadge.propTypes = {
  status: PropTypes.string.isRequired,
};

const Dashboard = () => {
  const center = [16.0544, 108.2022];
  const zoom = 13;
  const [stats, setStats] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [rescueTeams, setRescueTeams] = useState([]);
  const [activeTab, setActiveTab] = useState('caseId');
  const [caseIds, setCaseIds] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);

  // Modal assign state
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const handleOpenAssignModal = (caseData) => {
    setSelectedCase(caseData);
    setIsAssignModalOpen(true);
  };
  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedCase(null);
  };
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    const decoded = jwtDecode(accessToken);
    const userId = decoded.id || decoded.user_id || decoded.sub;
    console.log('UserID from token:', userId);
    sosCoordinatorService.registerSocket(userId);
  }
  const handleAssign = async (caseData, userId) => {
    try {
      const data = {
        caseId: caseData.id,
        teamId: userId,
      };
      console.log('Assigning team:', data);
      console.log('Selected case:', userId);
      await sosCoordinatorService.assignTeam(data);
      toast.success(`Assigned team ${userId} to case ${caseData.id}`);
      setIsAssignModalOpen(false);
      setSelectedCase(null);
      // Refresh data after successful assignment
      const response = await sosCoordinatorService.getAllSosForCoordinator();
      setCaseIds(mapCaseIds(response));
      setSosRequests(mapSosRequests(response));
    } catch (error) {
      console.error('Error assigning team:', error);
      toast.error('Failed to assign team. Please try again.');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sosCoordinatorService.getSosStatistics();
        const rescueTeams =
          await sosCoordinatorService.getAvailableRescueTeams();
        const rescueTeamLocations =
          await sosCoordinatorService.getRescueTeamLocations();

        const mapMarkers = rescueTeamLocations.data.map((team) => ({
          position: [parseFloat(team.latitude), parseFloat(team.longitude)],
          popup: team.name,
          status: team.status,
          color:
            team.status === 'available'
              ? 'green'
              : team.status === 'busy'
                ? 'red'
                : team.status === 'rescuing'
                  ? 'orange'
                  : 'gray',
        }));

        setMarkers(mapMarkers);
        const numberOfRescueTeams = rescueTeams.status.length;
        const { total, pending, completed } = response.status;

        setStats([
          {
            title: 'SOS signals',
            mainStat: `${total} request`,
            // subStat: '+8% month ',
            color: 'red',
            icon: <FaRegBell className="text-red-400" />, // changed here
          },
          {
            title: 'Pending SOS',
            mainStat: `${pending} pending`,
            subStat: 'Awaiting response',
            color: 'orange',
            icon: <FaHourglassHalf className="text-orange-400" />,
          },
          {
            title: 'Completed SOS',
            mainStat: `${completed} completed`,
            subStat: 'Successfully resolved',
            color: 'green',
            icon: <FaCheckCircle className="text-green-400" />,
          },
          {
            title: 'Rescue Teams Available',
            mainStat: `${numberOfRescueTeams} Teams`,
            subStat: '',
            color: 'blue',
            icon: <FaUsers className="text-blue-400" />,
          },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const { socket } = sosCoordinatorService;

    socket.on('case_cancelled', (notification) => {
      const notiList = JSON.parse(
        localStorage.getItem('notifications') || '[]',
      );
      notiList.unshift({
        message: notification.message,
        time: new Date().toISOString(),
        read: false,
      });
      localStorage.setItem('notifications', JSON.stringify(notiList));
      alert(notification.message);
      toast.error(notification.message);
    });

    return () => {
      socket.off('case_cancelled');
    };
  }, []);

  useEffect(() => {
    const fetchRescueTeams = async () => {
      try {
        const data = await rescueTeamService.getAllRescueTeams();
        setRescueTeams(data);
      } catch (error) {
        console.error('Error fetching rescue teams:', error);
      }
    };
    fetchRescueTeams();
  }, []);

  useEffect(() => {
    const fetchSosData = async () => {
      try {
        const response = await sosCoordinatorService.getAllSosForCoordinator();
        setCaseIds(mapCaseIds(response));
        setSosRequests(mapSosRequests(response));
      } catch (error) {
        console.error('Error fetching SOS data:', error);
      }
    };
    fetchSosData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={handleCloseAssignModal}
        caseData={selectedCase}
        rescueTeams={rescueTeams}
        onAssign={handleAssign}
      />
      <div className="bg-white z-20 relative">
        <MapLegend />
        <div className="h-96 w-full relative z-10">
          <MapComponent center={center} zoom={zoom} markers={markers} />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-14 mb-6 mt-5">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> */}
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm focus:outline-none ${activeTab === 'caseId' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('caseId')}
          >
            Case ID
          </button>
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'sosRequest' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('sosRequest')}
          >
            SOS Request
          </button>
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'rescueTeams' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500'}`}
            onClick={() => setActiveTab('rescueTeams')}
          >
            Rescue Teams
          </button>
        </nav>
      </div>
      <div className="w-full">
        <div className="col-span-2">
          {activeTab === 'caseId' && (
            <CaseIdTable
              caseIds={caseIds}
              onAssignClick={handleOpenAssignModal}
              sosRequests={sosRequests}
            />
          )}
          {activeTab === 'sosRequest' && (
            <SosRequestTable sosRequests={sosRequests} />
          )}
          {activeTab === 'rescueTeams' && (
            <RescueTeamsTable rescueTeams={rescueTeams} />
          )}
        </div>
        {/* <div>
          <RecentlyInstalledApp />
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
