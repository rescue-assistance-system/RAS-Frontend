import axios from 'axios';

const API_URL = 'https://ras-backend.onrender.com/api/analytics';

const getDashboard = async () => {
  try {
    const response = await axios.get(API_URL + '/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    throw error;
  }
};

const getSosStats = async () => {
  try {
    const response = await axios.get(API_URL + '/sos-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching sos stats:', error);
    throw error;
  }
};

const getLocationData = async () => {
  try {
    const response = await axios.get(API_URL + '/location-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
};

const getTeamPerformance = async () => {
  try {
    const response = await axios.get(API_URL + '/team-performance');
    return response.data;
  } catch (error) {
    console.error('Error fetching team performance:', error);
    throw error;
  }
};

const getCaseReportStats = async () => {
  try {
    const response = await axios.get(API_URL + '/case-report-stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching case report stats:', error);
    throw error;
  }
}

export default {
  getDashboard,
  getSosStats,
  getLocationData,
  getTeamPerformance,
  getCaseReportStats
};
