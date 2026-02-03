import axios from "axios"
import type { Hardware, Project } from "./types"
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

export const getUserProjects = async (): Promise<Project[]> => {
    const response = await apiClient.get('/api/projects');
    return response.data;
}

export const createProject = async (project: Project): Promise<Project> => {
    const response = await apiClient.post('/api/projects', project);
    return response.data;
}

export const joinProject = async (projectId: string): Promise<Project> => {
    const response = await apiClient.post('/api/projects/join', { projectId });
    return response.data;
}

export const getHardwareResources = async (): Promise<Hardware[]> => {
    // const response = await axios.get(`/api/hardware/${userName}`);
    // return response.data;
    return [
        { set: "HW Set 1", capacity: 10, available: 6, checkedOut: 4 },
        { set: "HW Set 2", capacity: 8, available: 3, checkedOut: 5 }
    ];
}

export const requestHardware = async (requests: { set: string, quantity: number }[]): Promise<void> => {
    // const response = await axios.post(`/api/hardware/request`, { requests });
    // return response.data;
}

export const returnHardware = async (returns: { set: string, quantity: number }[]): Promise<void> => {
    // const response = await axios.post(`/api/hardware/return`, { returns });
    // return response.data;
}
