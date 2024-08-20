import axios from "axios";
import showErrorPopup from "../Common/ShowErrorPopup"; // Assume this function shows the error popup
import {jwtDecode} from 'jwt-decode'

// Create an Axios instance
const instance = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    try {
      // Retrieve the access token from localStorage
      const accessTokens = localStorage.getItem("accessTokens");
      // const refreshToken = localStorage.getItem("refreshToken")

      if (accessTokens && accessTokens.length) {
        // Attach the token to the request headers
        config.headers["Access-Tokens"] = accessTokens
        // config.headers["Refresh-Tokens"] = refreshTokens
      } 
      // else {
      //   // Handle the case where there's no token
      //   showErrorPopup("No access token found. Please log in.");
      //   window.location.href = "/UserLogin";
      // }

      return config;
    } catch (error) {
      
      // Handle errors that occur during token retrieval or config modification
      showErrorPopup("An error occurred while setting up the request.");
      return Promise.reject(error);
    }
  },
  (error) => {
    // Handle errors that occur before the request is sent
    showErrorPopup("Request setup failed. Please try again.");
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => {
    console.log('Response from instance = ', response);
    return response;
  },
  async(error) => {
    console.error('Error = ', error);
    const originalRequest = error.config;

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data
      let pos = 0
      let accessTokens = JSON.parse(localStorage.getItem("accessTokens"))
      for(let i=0;i<accessTokens.length;i++){
        const decoded = jwtDecode(accessTokens[i])
        if(decoded.role == data.role){
          break;
        }
        pos++
      }
      if(pos<accessTokens.length){
        accessTokens.splice(pos,1)
        localStorage.setItem('accessTokens',JSON.stringify(accessTokens))
      }

      if (status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem("refreshToken");

        if (refreshToken) {
          try {
            const response = await axios.post("http://localhost:8000/refresh/access-token", {
              refreshTokens: refreshToken,
            });

            if (response.data.success) {
              let accessTokens  = JSON.parse(localStorage.getItem("accessTokens"))
              accessTokens.push(response.data.accessToken)
              localStorage.setItem("accessToken", JSON.stringify(accessTokens));
              originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`;
              return axios(originalRequest);
            } else {
              throw new Error('Refresh token expired');
            }
          } catch (refreshError) {
            console.error("Failed to refresh token", refreshError);
            localStorage.removeItem("accessTokens");
            localStorage.removeItem("refreshToken");
            window.location.href = "/UserLogin"; 
          }
        } else {
          localStorage.removeItem("accessTokens");
          localStorage.removeItem("refreshToken");
          window.location.href = "/UserLogin"; // Redirect to login page
        }
      } else {
        const backendMessage = error.response.data.error || 'An error occurred';
        showErrorPopup(backendMessage);
      }
    } else if (error.request) {
      // The request was made but no response was received (network error, server down)
      showErrorPopup('Network error or server is down. Please try again later.');
    } else {
      // Something happened in setting up the request that triggered an Error
      showErrorPopup('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

export default instance;
