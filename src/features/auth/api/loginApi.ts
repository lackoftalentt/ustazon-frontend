import { apiClient } from '@/shared/api/apiClient';

interface LoginData {
    iin: string;
    password: string;
}

interface LoginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export const checkIinExists = async (iin: string): Promise<boolean> => {
    const response = await apiClient.post<{ exists: boolean }>('/auth/check-iin', { iin });
    return response.data.exists;
};

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
        iin: data.iin,
        password: data.password
    });

    return response.data;
};
