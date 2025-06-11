import axios from 'axios';

// const API_URL = 'http://localhost:8081/api/admin';

// const API_URL = 'http://localhost:8081/api/sos-coordinator';
const API_URL = 'https://ras-backend.onrender.com/api/admin';

// const SOCKET_URL = 'ws://localhost:8081';
// const SOCKET_URL = 'wss://ras-backend.onrender.com';
const getAllRescueTeams = async () => {
  try {
    const response = await axios.get(
      'https://ras-backend.onrender.com/api/rescue-team/allRescueTeams',
    );
    console.log('response', response);
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch rescue teams');
    }
  } catch (error) {
    console.error('Error fetching rescue teams:', error);
    throw error;
  }
};
const getRescueTeamById = async (id) => {
  try {
    const response = await axios.get(API_URL + `/rescue-teams/${id}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching rescue team by ID:', error);
    throw error;
  }
};
const createRescueTeam = async (data) => {
  try {
    const response = await axios.post(API_URL + '/rescue-teams', data);
    return response.data;
  } catch (error) {
    console.error('Error creating rescue team:', error);
    throw error;
  }
};
const updateRescueTeam = async (id, data) => {
  try {
    const response = await axios.put(API_URL + `/rescue-teams/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating rescue team:', error);
    throw error;
  }
};
const deleteRescueTeam = async (id) => {
  try {
    const response = await axios.delete(API_URL + `/rescue-teams/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting rescue team:', error);
    throw error;
  }
};
export default {
  getAllRescueTeams,
  getRescueTeamById,
  createRescueTeam,
  updateRescueTeam,
  deleteRescueTeam,
};
