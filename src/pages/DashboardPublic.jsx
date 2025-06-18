import React, { useState, useEffect, useRef } from 'react';
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

const DashboardPublic = () => {
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
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [mapCenter, setMapCenter] = useState(MAP_CONFIG.center);
  const [mapZoom, setMapZoom] = useState(MAP_CONFIG.zoom);
  const [highlightedMarker, setHighlightedMarker] = useState(null);
  const mapRef = useRef();

  const iconMap = {
    FaRegBell: <FaRegBell className="text-red-400" />,
    FaHourglassHalf: <FaHourglassHalf className="text-orange-400" />,
    FaCheckCircle: <FaCheckCircle className="text-green-400" />,
    FaUsers: <FaUsers className="text-blue-400" />,
  };

  const allMarkers = [
    ...markers.map((marker) => ({
      ...marker,
      type: 'team',
      id: marker.teamId || marker.id,
      teamId: marker.teamId || marker.id,
      // Đảm bảo có team name
      team_name: marker.team_name || marker.teamName || marker.name,
    })),
    ...(caseMarkers || []).map((marker) => ({
      ...marker,
      type: 'case',
      id: marker.caseId || marker.id,
      caseId: marker.caseId || marker.id,
      // Đảm bảo có user name
      username: marker.username || marker.user_name || marker.name,
    })),
  ];

  // Handle URL params và navigate to marker
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('caseId');
    const teamId = urlParams.get('teamId');

    if ((caseId || teamId) && allMarkers.length > 0) {
      // Tìm marker tương ứng
      const targetMarker = allMarkers.find((marker) => {
        if (caseId && marker.type === 'case') {
          return marker.caseId === caseId || marker.id === caseId;
        }
        if (teamId && marker.type === 'team') {
          return marker.teamId === teamId || marker.id === teamId;
        }
        return false;
      });

      if (targetMarker) {
        // Set map center to marker position
        setMapCenter(targetMarker.position);
        setMapZoom(15); // Zoom in closer
        setHighlightedMarker(targetMarker);
        setSelectedMarkerId(
          targetMarker.caseId || targetMarker.teamId || targetMarker.id,
        );

        // Nếu là case, mở assign modal sau một delay nhỏ
        if (caseId && targetMarker.type === 'case') {
          setTimeout(() => {
            const caseData = caseIds.find(
              (c) => c.id === caseId || c.caseId === caseId,
            );
            if (caseData) {
              handleOpenAssignModal(caseData);
            }
          }, 1000); // Delay 1 giây để map load xong
        }
      }
    }
  }, [caseIds, allMarkers]);

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

  // Generate shareable URL
  const generateShareLink = (marker) => {
    const baseUrl = window.location.origin + window.location.pathname;
    let params = new URLSearchParams();

    if (marker.type === 'case') {
      params.append('caseId', marker.caseId || marker.id);
    } else if (marker.type === 'team') {
      params.append('teamId', marker.teamId || marker.id);
    }

    return `${baseUrl}?${params.toString()}`;
  };

  // Handle share functionality
  const handleShareMarker = async (marker) => {
    const shareUrl = generateShareLink(marker);

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Emergency Info - ${marker.type === 'case' ? 'Case' : 'Team'} ${marker.username || marker.team_name || marker.id}`,
          text: `Emergency information for ${marker.type === 'case' ? 'case' : 'rescue team'}`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      try {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      } catch (clipboardError) {
        prompt('Copy this link:', shareUrl);
      }
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
            isPublic={true}
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
            ref={mapRef}
            center={mapCenter}
            zoom={mapZoom}
            markers={allMarkers}
            highlightedMarker={highlightedMarker}
            onMarkerClick={(marker) => {
              setSelectedMarkerId(marker.caseId || marker.teamId || marker.id);
              // Nếu click vào case marker, mở assign modal
              if (marker.type === 'case') {
                const caseData = caseIds.find(
                  (c) => c.id === marker.caseId || c.caseId === marker.caseId,
                );
                if (caseData) {
                  handleOpenAssignModal(caseData);
                }
              }
            }}
            onShareMarker={handleShareMarker}
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

export default DashboardPublic;
