import axios from 'axios';

const API_URL = 'http://localhost:8081/api/admin';

const getAllRescueTeams = async () => {
    try {
        const response = await axios.get(API_URL + '/rescue-teams');
        console.log("response", response);
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

export default { getAllRescueTeams, getRescueTeamById };

