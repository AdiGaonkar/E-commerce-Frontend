import axios from "axios";
import SummaryApi, { baseURL } from "../common/SummaryApi";

// main axios instance
const Axios = axios.create({
  baseURL: baseURL,
  withCredentials: true
});

// REQUEST INTERCEPTOR
Axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accesstoken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    config.headers["Content-Type"] = "application/json";

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// RESPONSE INTERCEPTOR (Refresh Token Logic)

Axios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {

        const newAccessToken = await refreshAccessToken(refreshToken);

        if (newAccessToken) {

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          return Axios(originalRequest);
        }
      }
    }

    return Promise.reject(error);
  }
);


// REFRESH ACCESS TOKEN FUNCTION

const refreshAccessToken = async (refreshToken) => {
  try {

    const response = await axios({
      baseURL: baseURL,
      url: SummaryApi.refreshToken.url,
      method: SummaryApi.refreshToken.method,
      headers: {
        Authorization: `Bearer ${refreshToken}`
      },
      withCredentials: true
    });

    const accessToken = response.data.data.accessToken;

    localStorage.setItem("accesstoken", accessToken);

    return accessToken;

  } catch (error) {

    console.log("Refresh token expired");

    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshToken");

    window.location.href = "/login";

  }
};

export default Axios;
