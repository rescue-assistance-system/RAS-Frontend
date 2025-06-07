import React, { useState } from 'react';
import {
  FaRegBell,
  FaHourglassHalf,
  FaCheckCircle,
  FaUsers,
} from 'react-icons/fa';

import MapComponent from '../components/admin/MapView';
import { StatCard } from '../components/common';
import {
  AssignModal,
  CaseIdTable,
  SosRequestTable,
  RescueTeamsTable,
  MapLegend,
} from '../components/dashboard';

import { useDashboard, useSocket } from '../hooks';

import { MAP_CONFIG, TAB_CONFIG } from '../constants/dashboardConstants';

import 'react-toastify/dist/ReactToastify.css';

const Dashboard = () => {
  const {
    stats,
    markers,
    caseMarkers, 
    rescueTeams,
    caseIds,
    sosRequests,
    loading,
    assignTeam,
  } = useDashboard();

  useSocket();
  const [activeTab, setActiveTab] = useState('caseId');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);

  const iconMap = {
    FaRegBell: <FaRegBell className="text-red-400" />,
    FaHourglassHalf: <FaHourglassHalf className="text-orange-400" />,
    FaCheckCircle: <FaCheckCircle className="text-green-400" />,
    FaUsers: <FaUsers className="text-blue-400" />,
  };

  const allMarkers = [
    ...markers.map((marker) => ({ ...marker, type: 'team' })),
    ...(caseMarkers || []).map((marker) => ({ ...marker, type: 'case' })),
  ];

  const handleOpenAssignModal = (caseData) => {
    setSelectedCase(caseData);
    setIsAssignModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setIsAssignModalOpen(false);
    setSelectedCase(null);
  };

  const handleAssign = async (caseData, userId) => {
    const success = await assignTeam(caseData, userId);
    if (success) {
      handleCloseAssignModal();
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'caseId':
        return (
          <CaseIdTable
            caseIds={caseIds}
            onAssignClick={handleOpenAssignModal}
            sosRequests={sosRequests}
            rescueTeams={rescueTeams}
          />
        );
      case 'sosRequest':
        return <SosRequestTable sosRequests={sosRequests} />;
      case 'rescueTeams':
        return <RescueTeamsTable rescueTeams={rescueTeams} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        Loading...
      </div>
    );
  }

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
          <MapComponent
            center={MAP_CONFIG.center}
            zoom={MAP_CONFIG.zoom}
            markers={allMarkers} 
            
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-14 mb-6 mt-5">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} icon={iconMap[stat.icon]} />
        ))}
      </div>

      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 border-b-2 font-medium text-sm focus:outline-none ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="w-full">{renderTabContent()}</div>
    </div>
  );
};

export default Dashboard;
