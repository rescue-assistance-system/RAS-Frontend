import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { formatDate } from '../../../utils/dateUtils';
import sosCoordinatorService from '../../../services/sos.coordinator.service';

const DetailModal = ({
  isOpen,
  onClose,
  caseData,
  sosRequests,
  rescueTeams,
  isPublic = false,
}) => {
  const [message, setMessage] = useState('');

  const getTeamNameById = (teamId) => {
    if (!teamId || !rescueTeams) return 'null';

    const team = rescueTeams.find(
      (team) =>
        team.user_id === teamId ||
        team.id === teamId ||
        String(team.user_id) === String(teamId) ||
        String(team.id) === String(teamId),
    );

    return team
      ? team.team_name || team.name || `Team ${teamId}`
      : `Team ID: ${teamId}`;
  };
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

  console.log('caseData:', caseData);
  console.log('sosRequests:', sosRequests);
  const relatedSos = sosRequests
    ? sosRequests.filter((sos) => sos.case_id === caseData.id)
    : [];
  console.log('relatedSos:', relatedSos);

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
                value={getTeamNameById(caseData.assignedTeam)}
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

          {!isPublic && (
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
          )}
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
  rescueTeams: PropTypes.array,
  isPublic: PropTypes.bool,
};

export default DetailModal;
