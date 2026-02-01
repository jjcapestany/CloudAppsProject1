import axios from 'axios';
import type { LoginCredentials, RegisterCredentials, LoginResponse, User } from '../types';

const API_URL = '/api/auth';

const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const authService = {
    async register(credentials: RegisterCredentials): Promise<{ user: User }> {
        const response = await axios.post(`${API_URL}/register`, {
            email: credentials.email,
            password: credentials.password,
            confirm_password: credentials.confirmPassword,
        });
        return response.data;
    },

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await axios.post<LoginResponse>(`${API_URL}/login`, {
            email: credentials.email,
            password: credentials.password,
            remember_me: credentials.rememberMe || false,
        });

        this.setTokens(response.data.access_token, response.data.refresh_token);

        return response.data;
    },

    async logout(): Promise<void> {
        this.clearTokens();
    },

    async refreshToken(): Promise<string | null> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return null;

        try {
            const response = await axios.post(`${API_URL}/refresh`, {
                refresh_token: refreshToken,
            });
            const newAccessToken = response.data.access_token;
            localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
            return newAccessToken;
        } catch {
            this.clearTokens();
            return null;
        }
    },

    async getCurrentUser(): Promise<User | null> {
        const token = this.getAccessToken();
        if (!token) return null;

        try {
            const response = await axios.get(`${API_URL}/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data.user;
        } catch {
            return null;
        }
    },

    async forgotPassword(email: string): Promise<void> {
        await axios.post(`${API_URL}/forgot-password`, { email });
    },

    async resetPassword(token: string, password: string, confirmPassword: string): Promise<void> {
        await axios.post(`${API_URL}/reset-password`, {
            token,
            password,
            confirm_password: confirmPassword,
        });
    },

    setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
        localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    getAccessToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },

    getRefreshToken(): string | null {
        return localStorage.getItem(REFRESH_TOKEN_KEY);
    },

    clearTokens(): void {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
    },

    isAuthenticated(): boolean {
        return !!this.getAccessToken();
    },
};
