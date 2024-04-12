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
  const url = `/search_by_title?query=${filters.query}&category=${filters.category}&sortBy=${filters.sortBy}`;
  axios_config
    .get(url)
    .then((res) => {
      callback(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
};
