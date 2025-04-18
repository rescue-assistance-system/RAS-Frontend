import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import PropTypes from 'prop-types';
import rescueTeamService from '../../../services/rescueTeam.service';

const RescueTeamDetail = ({ onBack, teamId }) => {
  const [rescueTeamProfile, setRescueTeamProfile] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      );
      const data = await response.json();
      return data.display_name; // địa chỉ đầy đủ
    } catch (error) {
      console.error('Error in reverse geocoding:', error);
      return 'Unknown location';
    }
  };

  const [realAddress, setRealAddress] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await rescueTeamService.getRescueTeamById(teamId);
      const { account_info, rescue_team_info } = data.data;
      const mappedData = {
        profile: {
          id: rescue_team_info.id,
          teamName: rescue_team_info.team_name,
          role: rescue_team_info.role,
          location: rescue_team_info.default_location,
          status: rescue_team_info.is_active ? 'AVAILABLE' : 'UNAVAILABLE',
        },
        details: {
          email: account_info.email,
          phone: rescue_team_info.phone,
          mobile: rescue_team_info.mobile,
          address: rescue_team_info.address,
          description: rescue_team_info.description,
        },
        members: rescue_team_info.team_members.map((member) => ({
          name: member.name,
          role: member.role,
          phone: member.phone,
        })),
        account: {
          id: account_info.id,
          username: account_info.username,
          email: account_info.email,
          password: account_info.password,
          deviceId: account_info.deviceId,
          phone: account_info.phone,
          created_at: formatDate(account_info.createdAt),
        },
      };
      setRescueTeamProfile(mappedData);
      if (rescue_team_info.default_location) {
        const { latitude, longitude } = rescue_team_info.default_location;
        const address = await reverseGeocode(latitude, longitude);
        console.log(address);
        setRealAddress(address);
      }
    };
    fetchData();
  }, [teamId]);

  const handlePasswordChange = async () => {
    try {
      if (newPassword === confirmPassword) {
        const response = await rescueTeamService.updateRescueTeam(
          rescueTeamProfile.account.id,
          {
            username: rescueTeamProfile.account.username,
            email: rescueTeamProfile.account.email,
            password: newPassword,
          },
        );
        if (response.status === 'success') {
          alert('Password updated successfully!');
        } else {
          alert('Failed to update password');
        }
      } else {
        alert("Passwords don't match!");
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-6 flex items-center">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://bhd.1cdn.vn/2025/04/09/image.nhandan.vn-w2000-uploaded-2025-fdmzftmztpmf-2025_04_08-_ndo_br_dat-9084-5777-7970.jpg"
                alt="Team Avatar"
                className="w-32 h-32 rounded-full mb-4"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {rescueTeamProfile?.profile?.teamName}
              </h2>
              <p className="text-gray-600 mb-2">
                {rescueTeamProfile?.profile?.role}
              </p>
              <p className="text-gray-500 text-sm mb-4">{realAddress}</p>

              <div className="w-full space-y-4 mt-4">
                <div className="flex items-center text-gray-700">
                  <div className="w-32 flex items-center gap-2">
                    <i className="bx bx-envelope text-lg text-gray-500"></i>
                    <span className="text-sm text-gray-500">Email</span>
                  </div>
                  <span className="text-sm font-medium">
                    {rescueTeamProfile?.details?.email}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="w-32 flex items-center gap-2">
                    <i className="bx bx-user text-lg text-gray-500"></i>
                    <span className="text-sm text-gray-500">Username</span>
                  </div>
                  <span className="text-sm font-medium">
                    {rescueTeamProfile?.account?.username}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-32 flex items-center gap-2">
                    <i className="bx bx-lock text-lg text-gray-500"></i>
                    <span className="text-sm text-gray-500">Password</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium tracking-wider">
                      {showPassword
                        ? rescueTeamProfile?.account?.password
                        : '•••••••'}
                    </span>
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <i className="bx bx-hide text-lg"></i>
                      ) : (
                        <i className="bx bx-show text-lg"></i>
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-gray-700">
                  <div className="w-32 flex items-center gap-2">
                    <i className="bx bx-calendar text-lg text-gray-500"></i>
                    <span className="text-sm text-gray-500">Created Date</span>
                  </div>
                  <span className="text-sm font-medium">
                    {rescueTeamProfile?.account?.created_at}
                  </span>
                </div>

                <div className="pt-4 mt-2 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditingPassword(!isEditingPassword)}
                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600 text-sm font-medium"
                  >
                    <i className="bx bx-edit text-lg"></i>
                    Update Account Information
                  </button>
                </div>

                {isEditingPassword && (
                  <div className="space-y-4 pt-4 mt-2 border-t border-gray-200">
                    <div className="flex items-center">
                      <div className="w-32 flex items-center gap-2">
                        <i className="bx bx-lock-alt text-lg text-gray-500"></i>
                        <span className="text-sm text-gray-500">
                          New Password
                        </span>
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter new password"
                        />
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-32 flex items-center gap-2">
                        <i className="bx bx-lock-alt text-lg text-gray-500"></i>
                        <span className="text-sm text-gray-500">Confirm</span>
                      </div>
                      <div className="flex-1 relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Confirm new password"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-32">
                      <button
                        onClick={handlePasswordChange}
                        className="px-4 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 flex items-center gap-1 ml-4"
                      >
                        <i className="bx bx-check"></i>
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingPassword(false);
                          setNewPassword('');
                          setConfirmPassword('');
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 flex items-center gap-2"
                      >
                        <i className="bx bx-x"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 gap-5">
              <div className="flex items-center space-x-4">
                <label className=" text-sm font-medium text-gray-700 w-32 ">
                  Team Name
                </label>
                <input
                  type="text"
                  value={rescueTeamProfile?.profile?.teamName || ''}
                  onChange={(e) =>
                    setRescueTeamProfile({
                      ...rescueTeamProfile,
                      profile: {
                        ...rescueTeamProfile.profile,
                        teamName: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700 w-32 ">
                  Email
                </label>
                <input
                  type="email"
                  value={rescueTeamProfile?.details?.email || ''}
                  onChange={(e) =>
                    setRescueTeamProfile({
                      ...rescueTeamProfile,
                      details: {
                        ...rescueTeamProfile.details,
                        email: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-6 ml-3">
                  <label className="block text-sm font-medium text-gray-700 w-32 ">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={rescueTeamProfile?.account?.phone || ''}
                    onChange={(e) =>
                      setRescueTeamProfile({
                        ...rescueTeamProfile,
                        details: {
                          ...rescueTeamProfile.details,
                          phone: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <label className="block text-sm font-medium text-gray-700 w-32 ">
                    Device ID
                  </label>
                  <input
                    type="text"
                    value={rescueTeamProfile?.account?.deviceId || ''}
                    onChange={(e) =>
                      setRescueTeamProfile({
                        ...rescueTeamProfile,
                        details: {
                          ...rescueTeamProfile.details,
                          deviceId: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700 w-32 ">
                  Address
                </label>
                <input
                  type="text"
                  value={realAddress}
                  // onChange={(e) =>
                  //   setRescueTeamProfile({
                  //     ...rescueTeamProfile,
                  //     details: {
                  //       ...rescueTeamProfile.details,
                  //       address: e.target.value,
                  //     },
                  //   })
                  // }
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="block text-sm font-medium text-gray-700 w-32 ">
                  Description
                </label>
                <textarea
                  value={rescueTeamProfile?.details?.description || ''}
                  onChange={(e) =>
                    setRescueTeamProfile({
                      ...rescueTeamProfile,
                      details: {
                        ...rescueTeamProfile.details,
                        description: e.target.value,
                      },
                    })
                  }
                  rows="4"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Team Members
              </h3>
              {/* <button
                onClick={() => setIsAddingMember(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                <i className="bx bx-plus"></i>
                Add Member
              </button> */}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      NAME
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      ROLE
                    </th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">
                      PHONE
                    </th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {rescueTeamProfile?.members?.map((member, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="text-sm font-medium text-gray-900">
                          {member.name}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            member.role === 'leader'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {member.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-gray-500">
                          {member.phone}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setEditingMember(member);
                              setIsEditingMember(true);
                            }}
                            className="p-1 text-gray-400 hover:text-blue-500"
                          >
                            <i className="bx bx-edit-alt text-xl"></i>
                          </button>
                          {/* <button
                            onClick={() => handleDeleteMember(index)}
                            className="p-1 text-gray-400 hover:text-red-500"
                          >
                            <i className="bx bx-trash text-xl"></i>
                          </button> */}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {(isAddingMember || isEditingMember) && (
              <div className="fixed inset-0 bg-gray-500/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {isEditingMember ? 'Edit Member' : 'Add New Member'}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingMember(false);
                        setIsEditingMember(false);
                        setEditingMember(null);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <i className="bx bx-x text-2xl"></i>
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={editingMember?.name || ''}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter member name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        value={editingMember?.role || 'member'}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            role: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="member">Member</option>
                        <option value="leader">Leader</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={editingMember?.phone || ''}
                        onChange={(e) =>
                          setEditingMember({
                            ...editingMember,
                            phone: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="flex justify-end gap-2 mt-6">
                      <button
                        onClick={() => {
                          setIsAddingMember(false);
                          setIsEditingMember(false);
                          setEditingMember(null);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      {/* <button
                        onClick={handleSaveMember}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        {isEditingMember ? 'Save Changes' : 'Add Member'}
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* <div className="flex justify-end">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600">
              Save Changes
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

RescueTeamDetail.propTypes = {
  onBack: PropTypes.func.isRequired,
  teamId: PropTypes.string.isRequired,
};

export default RescueTeamDetail;
