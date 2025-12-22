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

export const loginUser = async (data: LoginData): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
        iin: data.iin,
        password: data.password
    });

    return response.data;
};
