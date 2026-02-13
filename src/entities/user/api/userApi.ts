import { apiClient } from '@/shared/api/apiClient';

export interface UserResponse {
    id: number;
    iin: string;
    name: string;
    phone: string;
    is_active: boolean;
    is_verified: boolean;
    is_admin: boolean;
    is_superuser: boolean;
    created_at: string;
}

interface UpdateUserData {
    name?: string;
    phone?: string;
}

interface UsersListResponse {
    items: UserResponse[];
    total: number;
}

export const getCurrentUser = async (): Promise<UserResponse> => {
    const response = await apiClient.get<UserResponse>('/users/me');
    return response.data;
};

export const updateUserProfile = async (
    data: UpdateUserData
): Promise<UserResponse> => {
    const response = await apiClient.put<UserResponse>('/users/me', data);
    return response.data;
};

export const searchUsers = async (params: {
    search?: string;
    skip?: number;
    limit?: number;
}): Promise<UsersListResponse> => {
    const response = await apiClient.get<UsersListResponse>('/users/list', {
        params,
    });
    return response.data;
};
