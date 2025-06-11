import axios from 'axios';

const API_URL = 'https://ras-backend.onrender.com/api/admin';

const getAllCoordinators = async () => {
  try {
    const response = await axios.get(API_URL + '/coordinators');
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
const getCoordinatorById = async (id) => {
  try {
    const response = await axios.get(API_URL + `/coordinators/${id}/profile`);
    return response.data;
  } catch (error) {
    console.error('Error fetching coordinator by ID:', error);
    throw error;
  }
};
const createCoordinator = async (data) => {
  try {
    const response = await axios.post(API_URL + '/coordinators', data);
    return response.data;
  } catch (error) {
    console.error('Error creating coordinator:', error);
    throw error;
  }
};
const updateCoordinator = async (id, data) => {
  try {
    const response = await axios.put(API_URL + `/coordinators/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating coordinator:', error);
    throw error;
  }
};
const deleteCoordinator = async (id) => {
  try {
    const response = await axios.delete(API_URL + `/coordinators/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting coordinator:', error);
    throw error;
  }
};

export default {
  getAllCoordinators,
  getCoordinatorById,
  createCoordinator,
  updateCoordinator,
  deleteCoordinator,
};
