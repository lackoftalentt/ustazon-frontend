import { apiClient } from '@/shared/api/apiClient';

interface UserResponse {
    id: number;
    iin: string;
    name: string;
    phone: string;
    is_verified: boolean;
    created_at: string;
}

export const getCurrentUser = async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/users/me');
    return response.data;
};
