import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
  //baseURL: 'http://88.222.241.246/api/',      //Vps
  baseURL: 'https://localhost:7157/api/',    //Local
});

// Add a response interceptor
apiClient.interceptors.response.use(
  response => response,
  error => {
    // Handle error globally
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';
    // Trigger a global notification, or use any other error handling logic
    console.error(message);
    return Promise.reject(error);
  }
);

export default apiClient;
