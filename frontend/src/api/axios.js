import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// ============ AUTH API ============
export const authAPI = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  verify: async () => {
    const response = await api.get('/auth/verify');
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }
};

// ============ IMAGE UPLOAD API ============
export const imageAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/admin/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  delete: async (publicId) => {
    const response = await api.delete(`/admin/delete-image/${publicId}`);
    return response.data;
  }
};

// ============ CONTACT API ============
export const contactAPI = {
  submitContact: async (data) => {
    const response = await api.post('/contacts/', data);
    return response.data;
  },
};

// ============ ADMIN API ============
export const adminAPI = {
  // Contacts
  getContacts: async () => {
    const response = await api.get('/admin/contacts/');
    return response.data;
  },
  getContact: async (id) => {
    const response = await api.get(`/admin/contacts/${id}`);
    return response.data;
  },
  markAsRead: async (id) => {
    const response = await api.patch(`/admin/contacts/${id}/read`);
    return response.data;
  },
  deleteContact: async (id) => {
    const response = await api.delete(`/admin/contacts/${id}`);
    return response.data;
  },
  replyToContact: async (data) => {
    const response = await api.post('/admin/contacts/reply', data);
    return response.data;
  },
  
  // Projects
  createProject: async (data) => {
    const response = await api.post('/admin/projects', data);
    return response.data;
  },
  getAllProjects: async () => {
    const response = await api.get('/admin/projects');
    return response.data;
  },
  getProject: async (id) => {
    const response = await api.get(`/admin/projects/${id}`);
    return response.data;
  },
  updateProject: async (id, data) => {
    const response = await api.put(`/admin/projects/${id}`, data);
    return response.data;
  },
  deleteProject: async (id) => {
    const response = await api.delete(`/admin/projects/${id}`);
    return response.data;
  }
};

// ============ PUBLIC PROJECTS API ============
export const projectsAPI = {
  getAllProjects: async () => {
    const response = await api.get('/projects/');
    return response.data;
  },
  getFeaturedProjects: async () => {
    const response = await api.get('/projects/featured');
    return response.data;
  },
  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  }
};

export default api;