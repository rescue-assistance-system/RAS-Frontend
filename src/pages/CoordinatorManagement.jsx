import React, { useState, useEffect } from 'react';
import CreateAccountForm from '../components/admin/Form/CreateAccount';
import { Dialog } from '@headlessui/react';
import RescueTeamDetail from '../components/admin/Form/RescueTeamDetailForm';
import coordinatorService from '../services/coordinator.service';

const CoordinatorManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCoordinator, setSelectedCoordinator] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleCreateTeam = (newTeam) => {
    console.log('Team created/updated:', newTeam);
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedCoordinator(null);
  };

  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [isViewingDetails, setIsViewingDetails] = useState(false);

  const [visiblePasswords, setVisiblePasswords] = useState({});
  const togglePassword = (teamId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [teamId]: !prev[teamId],
    }));
  };

  const getStatusBadge = (status) => {
    const statusStyles = {
      AVAILABLE: 'bg-green-100 text-green-800',
      ON_MISSION: 'bg-blue-100 text-blue-800',
      STANDBY: 'bg-yellow-100 text-yellow-800',
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status] || 'bg-gray-100'}`;
  };

  const [coordinators, setCoordinators] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await coordinatorService.getAllCoordinators();
        const filtered = data.map((user) => ({
          id: user.id,
          teamName: user.username,
          email: user.email,
          status: user.status,
          phone: user.phone,
          role: user.role,
          password: user.password,
          deviceId: user.device_id,
        }));
        console.log('filtered', filtered);
        setCoordinators(filtered);
      } catch (error) {
        console.error('Error fetching rescue teams:', error);
      }
    };
    fetchData();
  }, []);

  const handleEditClick = (coordinator) => {
    setSelectedCoordinator({
      id: coordinator.id,
      username: coordinator.teamName,
      email: coordinator.email,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };
  const handleDeleteClick = (coordinatorId) => {
    try {
      coordinatorService.deleteCoordinator(coordinatorId);
      setCoordinators((prev) =>
        prev.filter((coordinator) => coordinator.id !== coordinatorId),
      );
    } catch (error) {
      console.error('Error deleting coordinator:', error);
    }
    console.log('Delete coordinator with ID:', coordinatorId);
  };

  return (
    <>
      {isViewingDetails ? (
        <RescueTeamDetail
          teamId={selectedTeamId}
          onBack={() => setIsViewingDetails(false)}
        />
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Coordinators
            </h2>
            <button
              onClick={() => {
                setSelectedCoordinator(selectedCoordinator);
                setIsModalOpen(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add New
            </button>
          </div>

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
                    Coordinator ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Coordinator Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Password
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device ID
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View Details
                  </th> */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {coordinators.map((team) => (
                  <tr key={team.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {team.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {team.teamName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(team.status)}>
                        {team.email}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                      {visiblePasswords[team.id]
                        ? '************'
                        : '************'}

                      {/* <button
                        onClick={() => togglePassword(team.id)}
                        className="focus:outline-none"
                      >
                        {visiblePasswords[team.id] ? (
                          <EyeOff className="w-5 h-5 text-gray-500" />
                        ) : (
                          <Eye className="w-5 h-5 text-gray-500" />
                        )}
                      </button> */}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {team.deviceId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900"
                          onClick={() => handleEditClick(team)}
                        >
                          <i className="bx bx-edit-alt text-xl"></i>
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDeleteClick(team.id)}
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
            onClose={() => {
              setIsModalOpen(false);
              setIsEditMode(false);
              setSelectedCoordinator(null);
            }}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-lg shadow-xl">
                <CreateAccountForm
                  onClose={() => {
                    setIsModalOpen(false);
                    setIsEditMode(false);
                    setSelectedCoordinator(null);
                  }}
                  onSuccess={handleCreateTeam}
                  accountType="COORDINATOR"
                  isEditMode={isEditMode}
                  defaultValues={selectedCoordinator}
                />
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      )}
    </>
  );
};

export default CoordinatorManagement;
