import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:9002";
export const API_ORIGIN = API_URL.replace(/\/$/, "");

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as Record<string, string>)["X-Admin-Token"] = token;
  }
  return config;
});

export const assetUrl = (url?: string | null) => {
  if (!url) return "";
  if (/^https?:\/\//.test(url)) return url;
  if (url.startsWith("/projects/")) return url;
  return `${API_ORIGIN}${url}`;
};

export const authApi = {
  login: (username: string, password: string) => api.post("/auth/login", { username, password }),
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
  stats: () => api.get("/admin/stats"),

  projects: () => api.get("/admin/projects"),
  createProject: (data: any) => api.post("/admin/projects", data),
  updateProject: (id: number, data: any) => api.patch(`/admin/projects/${id}`, data),
  deleteProject: (id: number) => api.delete(`/admin/projects/${id}`),
  uploadImage: (projectId: number, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return api.post(`/admin/projects/${projectId}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteImage: (imageId: number) => api.delete(`/admin/project-images/${imageId}`),

  skills: () => api.get("/admin/skills"),
  createSkill: (data: any) => api.post("/admin/skills", data),
  deleteSkill: (id: number) => api.delete(`/admin/skills/${id}`),

  education: () => api.get("/admin/education"),
  createEducation: (data: any) => api.post("/admin/education", data),
  updateEducation: (id: number, data: any) => api.put(`/admin/education/${id}`, data),
  deleteEducation: (id: number) => api.delete(`/admin/education/${id}`),

  achievements: () => api.get("/admin/achievements"),
  createAchievement: (data: any) => api.post("/admin/achievements", data),
  deleteAchievement: (id: number) => api.delete(`/admin/achievements/${id}`),

  settings: () => api.get("/admin/settings"),
  updateSetting: (key: string, value: string) => api.patch(`/admin/settings/${key}`, { value }),

  categories: () => api.get("/admin/categories"),
};
