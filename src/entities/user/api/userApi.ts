import { apiClient } from '@/shared/api/apiClient';

interface UserResponse {
    id: number;
    iin: string;
    name: string;
    phone: string;
    is_verified: boolean;
    is_superuser: boolean;
    created_at: string;
}

export const getCurrentUser = async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/users/me');
    return response.data;
};

interface UpdateUserData {
    name?: string;
    phone?: string;
}

export const updateUserProfile = async (
    data: UpdateUserData
): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>('/users/me', data);
    return response.data;
};
