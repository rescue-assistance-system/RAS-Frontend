import axios from 'axios';
import { io } from 'socket.io-client';

const API_URL = 'http://localhost:8081/api/sos-coordinator';
const SOCKET_URL = 'ws://localhost:8081';

const getAllSosForCoordinator = async () => {
  try {
    const response = await axios.get(API_URL + '/sos');
    console.log('responseSOS', response.data.status);
    if (response.status === 200) {
      return response.data.status;
    } else {
      throw new Error('Failed to fetch rescue teams');
    }
  } catch (error) {
    console.error('Error fetching rescue teams:', error);
    throw error;
  }
};
const getSosById = async (id) => {
  try {
    const response = await axios.get(API_URL + `/sos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coordinator by ID:', error);
    throw error;
  }
};
const getAvailableRescueTeams = async () => {
  try {
    const response = await axios.get(API_URL + `/rescue-teams/available`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coordinator by ID:', error);
    throw error;
  }
};
const getSosStatistics = async () => {
  try {
    const response = await axios.get(API_URL + `/statistics`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coordinator by ID:', error);
    throw error;
  }
};
const assignTeam = async (data) => {
  try {
    const response = await axios.post(API_URL + '/assign-team', data);
    return response.data;
  } catch (error) {
    console.error('Error creating coordinator:', error);
    throw error;
  }
};
const getRescueTeamLocations = async () => {
  try {
    const response = await axios.get(API_URL + `/rescue-teams/locations`);
    return response.data;
  } catch (error) {
    console.error('Error updating coordinator:', error);
    throw error;
  }
};
const notifyRescueTeam = async (data) => {
  try {
    const response = await axios.post(API_URL + '/notify-rescue-team', data);
    return response.data;
  } catch (error) {
    console.error('Error updating coordinator:', error);
    throw error;
  }
};
const socket = io(SOCKET_URL);
const registerSocket = (userId) => {
  console.log('Register');
  if (socket && userId) {
    console.log('Register Socket');
    socket.emit('register', { userId });
    console.log('Register Socket1');
  }
};

export default {
  getAllSosForCoordinator,
  getSosById,
  getAvailableRescueTeams,
  getSosStatistics,
  assignTeam,
  getRescueTeamLocations,
  socket,
  registerSocket,
  notifyRescueTeam,
};
