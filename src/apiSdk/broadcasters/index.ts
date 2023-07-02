import axios from 'axios';
import queryString from 'query-string';
import { BroadcasterInterface, BroadcasterGetQueryInterface } from 'interfaces/broadcaster';
import { GetQueryInterface } from '../../interfaces';

export const getBroadcasters = async (query?: BroadcasterGetQueryInterface) => {
  const response = await axios.get(`/api/broadcasters${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBroadcaster = async (broadcaster: BroadcasterInterface) => {
  const response = await axios.post('/api/broadcasters', broadcaster);
  return response.data;
};

export const updateBroadcasterById = async (id: string, broadcaster: BroadcasterInterface) => {
  const response = await axios.put(`/api/broadcasters/${id}`, broadcaster);
  return response.data;
};

export const getBroadcasterById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/broadcasters/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBroadcasterById = async (id: string) => {
  const response = await axios.delete(`/api/broadcasters/${id}`);
  return response.data;
};
