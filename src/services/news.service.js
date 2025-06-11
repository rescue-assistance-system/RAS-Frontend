import axios from 'axios';

const API_URL = 'https://ras-backend.onrender.com/api/news';

const getAllCategories = async () => {
  try {
    const response = await axios.get(
      `https://ras-backend.onrender.com/api/news-categories`,
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

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(
      'https://ras-backend.onrender.com/api/cloudinary/file',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log('response', response);
    console.log('response.data', response.data.data.url);
    return response.data.data.url;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

const uploadFiles = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file); 
  });

  try {
    const response = await axios.post(
      'https://ras-backend.onrender.com/api/cloudinary/upload-multiple',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.data.map(item => item.url);
  } catch (error) {
    console.error('Error uploading files:', error);
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
    console.log('response', response);
    console.log('response.data', response.data);
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
  uploadFile,
  uploadFiles,
  createNews,
  updateNewsById,
  deleteNewsById,
};
