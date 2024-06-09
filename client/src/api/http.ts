import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3005/",
  timeout: 3000,
});

http.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    return error.response;
  }
);

export default http;
