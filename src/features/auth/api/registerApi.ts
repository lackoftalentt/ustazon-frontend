import { apiClient } from '@/shared/api/apiClient';

interface RegisterData {
    iin: string;
    name: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string;
}

interface RegisterResponse {
    message: string;
    code: string;
}

export const registerUser = async (
    data: RegisterData
): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', {
        iin: data.iin,
        name: data.name,
        phone: data.phoneNumber,
        password: data.password,
        confirm_password: data.confirmPassword
    });

    return response.data;
};
