import axios from "axios";
import { BASE_URL } from "./constants";

const config = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

export const callAPI = async (resource) => {
  const { data } = await axios.get(`${BASE_URL}/${resource}`, config);
  return data;
};

export const getSearchResults = (filters, callback) => {
  const axios_config = axios.create({
    baseURL: 'http://localhost:5000',
  });
  let params = "";
  if(filters.query) {
    params += `query=${filters.query}&`
  }
  if(filters.category) {
    params += `category=${filters.category}&`
  }
  if(filters.sortBy) {
    params += `sortBy=${filters.sortBy}&`
  }
  if(filters.page) {
    params += `page=${filters.page}&`
  }
  params = params.slice(0, -1);
  const url = `/search?${params}`;
  axios_config
    .get(url)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.log(err);
    }); 
};
