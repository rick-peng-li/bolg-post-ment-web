import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for consistent error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// Post API methods
export const postService = {
  getAll: (params) => api.get("/posts", { params }),

  getById: (id) => api.get(`/posts/${id}`),

  create: (data) => api.post("/posts", data),

  update: (id, data) => api.put(`/posts/${id}`, data),

  delete: (id) => api.delete(`/posts/${id}`),

  exportCSV: (params) =>
    api.get("/posts/export", {
      params,
      responseType: "blob",
    }),
};

export default api;
