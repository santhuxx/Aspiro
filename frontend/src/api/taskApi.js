import axios from "axios";

const API_URL = "http://localhost:5001/api/tasks"; // Change if your backend runs elsewhere

export const getTasks = async (uid) => {
  const res = await axios.get(`${API_URL}/${uid}`);
  return res.data;
};

export const createTask = async (uid, task) => {
  const res = await axios.post(API_URL, { uid, ...task });
  return res.data;
};

export const updateTask = async (uid, taskId, task) => {
  const res = await axios.put(`${API_URL}/${uid}/${taskId}`, task);
  return res.data;
};

export const deleteTask = async (uid, taskId) => {
  const res = await axios.delete(`${API_URL}/${uid}/${taskId}`);
  return res.data;
};