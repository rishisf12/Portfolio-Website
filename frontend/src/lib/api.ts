import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Attach JWT from cookie-based auth is handled by backend HttpOnly cookie.
// Axios sends cookies automatically with withCredentials: true.

export const authApi = {
  login: (username: string, password: string) =>
    api.post("/auth/login", { username, password }),
  me: () => api.get("/auth/me"),
};

export const publicApi = {
  settings: () => api.get("/public/settings"),
  categories: () => api.get("/public/categories"),
  projects: (category?: string) =>
    api.get("/public/projects", { params: category ? { category } : {} }),
  projectDetail: (slug: string) => api.get(`/public/projects/${slug}`),
  skills: (category?: string) =>
    api.get("/public/skills", { params: category ? { category } : {} }),
  education: () => api.get("/public/education"),
  achievements: () => api.get("/public/achievements"),
};

export const adminApi = {
  projects: () => api.get("/admin/projects"),
  createProject: (data: any) => api.post("/admin/projects", data),
  updateProject: (id: number, data: any) => api.patch(`/admin/projects/${id}`, data),
  deleteProject: (id: number) => api.delete(`/admin/projects/${id}`),
  uploadImage: (projectId: number, formData: FormData) =>
    api.post(`/admin/projects/${project_id || projectId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteImage: (imageId: number) => api.delete(`/admin/project-images/${imageId}`),

  skills: () => api.get("/admin/skills"),
  createSkill: (data: any) => api.post("/admin/skills", data),
  deleteSkill: (id: number) => api.delete(`/admin/skills/${id}`),

  education: () => api.get("/admin/education"),
  createEducation: (data: any) => api.post("/admin/education", data),
  deleteEducation: (id: number) => api.delete(`/admin/education/${id}`),

  achievements: () => api.get("/admin/achievements"),
  createAchievement: (data: any) => api.post("/admin/achievements", data),
  deleteAchievement: (id: number) => api.delete(`/admin/achievements/${id}`),

  settings: () => api.get("/admin/settings"),
  updateSetting: (key: string, value: string) =>
    api.patch(`/admin/settings/${key}`, { key, value }),
};