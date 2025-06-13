import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import sosCoordinatorService from '../services/sos.coordinator.service';
import {
  mapCaseIds,
  mapSosRequests,
  createMapMarkers,
  createTeamMarkers,
  createCaseMarkers,
} from '../utils/dashboardUtils';

export const useDashboard = () => {
  const [stats, setStats] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [caseMarkers, setCaseMarkers] = useState([]);
  const [rescueTeams, setRescueTeams] = useState([]);
  const [caseIds, setCaseIds] = useState([]);
  const [sosRequests, setSosRequests] = useState([]);
  // const [loading, setLoading] = useState(true);

  // Initialize socket
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      const decoded = jwtDecode(accessToken);
      const userId = decoded.id || decoded.user_id || decoded.sub;
      sosCoordinatorService.registerSocket(userId);
    }
  }, []);

  // Socket listeners
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

    socket.on('sos_request', (data) => {
      console.log('Received SOS socket data:', data);

      const sosMessage = data.sosMesage || data;

      const alertMessage = `
🚨 NEW SOS REQUEST 🚨

👤 User: ${sosMessage.userName || 'Unknown'}
📍 Location: ${sosMessage.address || 'Unknown address'}
📋 Case ID: ${sosMessage.caseId || 'N/A'}
🆔 User ID: ${sosMessage.userId || 'N/A'}
🌐 Coordinates: ${sosMessage.latitude}, ${sosMessage.longitude}
🚑 Nearest Teams: ${
        sosMessage.nearest_team_ids
          ? sosMessage.nearest_team_ids.join(', ')
          : 'None'
      }

Please take immediate action!
      `.trim();
      alert(alertMessage);

      toast.error(
        `🚨 New SOS from ${sosMessage.userName} at ${sosMessage.address}`,
      );

      const notiList = JSON.parse(
        localStorage.getItem('notifications') || '[]',
      );
      notiList.unshift({
        message: sosMessage.message || `New SOS from ${sosMessage.userName}`,
        details: {
          userName: sosMessage.userName,
          address: sosMessage.address,
          caseId: sosMessage.caseId,
          userId: sosMessage.userId,
          latitude: sosMessage.latitude,
          longitude: sosMessage.longitude,
          nearest_team_ids: sosMessage.nearest_team_ids,
          avatar: sosMessage.avatar,
        },
        time: new Date().toISOString(),
        read: false,
        type: 'sos_request',
      });
      localStorage.setItem('notifications', JSON.stringify(notiList));

      fetchSosData();
      fetchRescueTeams();
    });

    return () => {
      socket.off('case_cancelled');
      socket.off('sos_request');
    };
  }, []);
  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      const [response, rescueTeamsResponse, rescueTeamLocations] =
        await Promise.all([
          sosCoordinatorService.getSosStatistics(),
          sosCoordinatorService.getAvailableRescueTeams(),
          sosCoordinatorService.getRescueTeamLocations(),
        ]);

      setMarkers(createMapMarkers(rescueTeamLocations));

      const numberOfRescueTeams = rescueTeamsResponse.status.length;
      const { total, pending, completed } = response.status;

      setStats([
        {
          title: 'SOS signals',
          mainStat: `${total} request`,
          color: 'red',
          icon: 'FaRegBell',
        },
        {
          title: 'Pending SOS',
          mainStat: `${pending} pending`,
          subStat: 'Awaiting response',
          color: 'orange',
          icon: 'FaHourglassHalf',
        },
        {
          title: 'Completed SOS',
          mainStat: `${completed} completed`,
          subStat: 'Successfully resolved',
          color: 'green',
          icon: 'FaCheckCircle',
        },
        {
          title: 'Rescue Teams Available',
          mainStat: `${numberOfRescueTeams} Teams`,
          subStat: '',
          color: 'blue',
          icon: 'FaUsers',
        },
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch rescue teams
  const fetchRescueTeams = async () => {
    try {
      const response = await sosCoordinatorService.getAllRescueTeams();
      const teams = Array.isArray(response) ? response : response.data || [];

      setRescueTeams(teams);

      const teamMarkers = createTeamMarkers(
        teams.filter((team) => team.latitude && team.longitude),
      );
      setMarkers(teamMarkers);
    } catch (error) {
      console.error('Error fetching rescue teams:', error);
    }
  };

  const fetchSosData = async () => {
    try {
      const response = await sosCoordinatorService.getAllSosForCoordinator();
      console.log('Raw SOS data:', response);

      const mappedCaseIds = mapCaseIds(response);
      const mappedSosRequests = mapSosRequests(response);
      const mappedCaseMarkers = createCaseMarkers(response);

      setCaseIds(mappedCaseIds);
      setSosRequests(mappedSosRequests);
      setCaseMarkers(mappedCaseMarkers);
    } catch (error) {
      console.error('Error fetching SOS data:', error);
      toast.error('Failed to fetch SOS data');
    }
  };

  // Assign team
  const assignTeam = async (caseData, userId) => {
    try {
      const data = { caseId: caseData.id, teamId: userId };
      await sosCoordinatorService.assignTeam(data);
      toast.success(`Assigned team ${userId} to case ${caseData.id}`);

      // Refresh data
      await fetchSosData();
      return true;
    } catch (error) {
      console.error('Error assigning team:', error);
      toast.error('Failed to assign team. Please try again.');
      return false;
    }
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRescueTeams();
    fetchSosData();
  }, []);

  return {
    stats,
    markers,
    rescueTeams,
    caseIds,
    sosRequests,
    // loading,
    assignTeam,
    caseMarkers,
  };
};
