import axios from "axios"
import type { Project } from "./types"
import { authService } from "./services/authService"

// Create axios instance with interceptors
const apiClient = axios.create();

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = authService.getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const newToken = await authService.refreshToken();
            if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            }

            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export { apiClient };

export const getUserProjects = async (userName: string): Promise<Project[]> => {
    // const response = await apiClient.get(`/api/projects/${userName}`);
    // return response.data;
    return [
        { name: "Project A", description: "Description A", id: "1" },
        { name: "Project B", description: "Description B", id: "2" }
    ];
}

export const createProject = async (project: Project): Promise<Project> => {
    // const response = await apiClient.post('/api/projects', project);
    // return response.data;
    return project
}