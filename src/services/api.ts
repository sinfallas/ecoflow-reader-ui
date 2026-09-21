import axios from 'axios';
import type { DevicesResponse } from '../types/ecoflow';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async getDevices(): Promise<DevicesResponse> {
    const response = await apiClient.get<DevicesResponse>('/devices');
    return response.data;
  }
};
