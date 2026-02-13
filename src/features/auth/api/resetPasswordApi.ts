import { apiClient } from '@/shared/api/apiClient';

interface ForgotPasswordData {
    phone: string;
}

interface ForgotPasswordResponse {
    message: string;
    code: string;
}

export const sendResetCode = async (
    data: ForgotPasswordData
): Promise<ForgotPasswordResponse> => {
    const response = await apiClient.post<ForgotPasswordResponse>(
        '/auth/forgot-password',
        data
    );
    return response.data;
};

interface VerifyCodeData {
    phone: string;
    code: string;
}

interface VerifyCodeResponse {
    message: string;
    code: string;
}

export const verifyResetCode = async (
    data: VerifyCodeData
): Promise<VerifyCodeResponse> => {
    const response = await apiClient.post<VerifyCodeResponse>(
        '/auth/verify-reset-code',
        {
            phone: data.phone,
            code: data.code
        }
    );
    return response.data;
};

interface ResetPasswordData {
    phone: string;
    code: string;
    new_password: string;
    confirm_password: string;
}

interface ResetPasswordResponse {
    message: string;
    code: string;
}

export const resetPassword = async (
    data: ResetPasswordData
): Promise<ResetPasswordResponse> => {
    const response = await apiClient.post<ResetPasswordResponse>(
        '/auth/reset-password',
        data
    );
    return response.data;
};
