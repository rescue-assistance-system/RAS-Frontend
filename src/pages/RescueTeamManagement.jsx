import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RescueTeamForm from '../components/admin/Form/CreateAccount';
import { Dialog } from '@headlessui/react';
import RescueTeamDetail from '../components/admin/Form/RescueTeamDetailForm';
import rescueTeamService from '../services/rescueTeam.service';

const RescueTeamManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCreateTeam = (newTeam) => {
    console.log('New team created:', newTeam);
    setRescueTeams((prevTeams) => [...prevTeams, newTeam]);
    setIsModalOpen(false);
    toast.success('Team created successfully!');
  };
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);
  const handleViewDetails = (teamId) => {
    setSelectedTeamId(teamId);
    setIsViewingDetails(true);
  };

  const handleDelete = async (teamId) => {
    try {
      await rescueTeamService.deleteRescueTeam(teamId);
      setRescueTeams((prevTeams) => prevTeams.filter((team) => team.id !== teamId));
      console.log(`Team with ID ${teamId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting team with ID ${teamId}:`, error);
    }
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      AVAILABLE: 'bg-green-100 text-green-800',
      ON_MISSION: 'bg-blue-100 text-blue-800',
      STANDBY: 'bg-yellow-100 text-yellow-800',
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100'}`;
  };

  const [rescueTeams, setRescueTeams] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await rescueTeamService.getAllRescueTeams();
        const filtered = data.map((user) => ({
          id: user.id,
          username: user.username,
          email: user.email,
          status: user.status,
          phone: user.phone,
          role: user.role,
          date: user.date,
        }));
        console.log('filtered', filtered);
        setRescueTeams(filtered);
      } catch (error) {
        console.error('Error fetching rescue teams:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      {isViewingDetails ? (
        <RescueTeamDetail
          teamId={selectedTeamId}
          onBack={() => setIsViewingDetails(false)}
        />
      ) : (
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Rescue Teams
            </h2>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add New
            </button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search Team"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_MISSION">On Mission</option>
              <option value="STANDBY">Standby</option>
            </select>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="w-12 px-6 py-3">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </th>
                  <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rescueTeams.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(user.status)}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetails(user.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                      >
                        View Details
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-900">
                          <i className="bx bx-edit-alt text-xl"></i>
                        </button>
                        <button className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(user.id)}
                        >
                          <i className="bx bx-trash text-xl"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Previous
                </button>
                <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to{' '}
                    <span className="font-medium">10</span> of{' '}
                    <span className="font-medium">20</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>

          <Dialog
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-lg shadow-xl">
                <RescueTeamForm
                  accountType="RESCUE_TEAM"
                  onClose={() => setIsModalOpen(false)}
                  onSuccess={handleCreateTeam}
                />
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default RescueTeamManagement;
