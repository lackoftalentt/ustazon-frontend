import { apiClient } from '@/shared/api/apiClient';
import type { SendMessageResponse, UploadAttachmentResponse } from './types';

export const chatApi = {
    sendMessage: async (
        message: string,
        attachmentIds?: string[]
    ): Promise<SendMessageResponse> => {
        const { data } = await apiClient.post<SendMessageResponse>('/chat/send', {
            message,
            attachmentIds
        });
        return data;
    },

    uploadAttachment: async (file: File): Promise<UploadAttachmentResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const { data } = await apiClient.post<UploadAttachmentResponse>(
            '/chat/attachments',
            formData,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 60000
            }
        );
        return data;
    },

    uploadAttachments: async (files: File[]): Promise<UploadAttachmentResponse[]> => {
        const uploads = files.map(file => chatApi.uploadAttachment(file));
        return Promise.all(uploads);
    }
};
