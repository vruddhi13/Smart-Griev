import axios from "axios";

const API_URL = "https://localhost:5001/api/account";

export const registerUser = async (data) => {

    const response = await axios.post(`${API_URL}/register`, data);

    return response.data;

};