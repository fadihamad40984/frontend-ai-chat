import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTrainingData = async () => {
  const res = await axios.get(`${API_URL}/training_data`);
  return res.data.data;
};

export const addTrainingPair = (input, output) =>
  axios.post(`${API_URL}/admin/add`, { input, output });

export const retrainModel = async () => {
  return axios.post(
    `${API_URL}/train`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const deleteTrainingPair = (index) =>
  axios.post(`${API_URL}/admin/delete`, { index });
