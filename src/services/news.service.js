import axios from 'axios';

const API_URL = 'http://localhost:8081/api/news';

const getAllCategories = async () => {
  try {
    const response = await axios.get(
      `http://localhost:8081/api/news-categories`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

const getAllNews = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('response', response);
    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error('Failed to fetch news');
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};

const getNewsById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching news by ID:', error);
    throw error;
  }
};

const createNews = async (data) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error creating news:', error);
    throw error;
  }
};

const updateNewsById = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating news:', error);
    throw error;
  }
};

const deleteNewsById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting news:', error);
    throw error;
  }
};

export default {
  getAllCategories,
  getAllNews,
  getNewsById,
  createNews,
  updateNewsById,
  deleteNewsById,
};
