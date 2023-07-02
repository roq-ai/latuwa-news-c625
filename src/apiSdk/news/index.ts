import axios from 'axios';
import queryString from 'query-string';
import { NewsInterface, NewsGetQueryInterface } from 'interfaces/news';
import { GetQueryInterface } from '../../interfaces';

export const getNews = async (query?: NewsGetQueryInterface) => {
  const response = await axios.get(`/api/news${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createNews = async (news: NewsInterface) => {
  const response = await axios.post('/api/news', news);
  return response.data;
};

export const updateNewsById = async (id: string, news: NewsInterface) => {
  const response = await axios.put(`/api/news/${id}`, news);
  return response.data;
};

export const getNewsById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/news/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteNewsById = async (id: string) => {
  const response = await axios.delete(`/api/news/${id}`);
  return response.data;
};
