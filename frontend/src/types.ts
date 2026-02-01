export type Project = {
    name: string,
    description: string,
    id: string
}

export type Hardware = {
    set: string,
    capacity: number,
    available: number,
}

export type User = {
    id: string;
    email: string;
};

export type AuthState = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
};

export type LoginCredentials = {
    email: string;
    password: string;
    rememberMe?: boolean;
};

export type RegisterCredentials = {
    email: string;
    password: string;
    confirmPassword: string;
};

export type LoginResponse = {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_in: number;
    user: User;
};