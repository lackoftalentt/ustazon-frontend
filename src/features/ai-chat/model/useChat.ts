import { useMutation } from '@tanstack/react-query';
import { aiApi } from '@/shared/api/ai';
import { uploadApi } from '@/shared/api/uploadApi';
import type { ChatAttachment } from '../api/types';
import { useChatStore } from './useChatStore';

export const useSendMessage = () => {
    const { addUserMessage, addAssistantMessage, setLoading } = useChatStore();

    return useMutation({
        mutationFn: async ({
            message,
            attachments
        }: {
            message: string;
            attachments?: ChatAttachment[];
        }) => {
            // Extract files from attachments
            const files = attachments
                ?.filter(a => a.file)
                .map(a => a.file!);

            return aiApi.sendMessage({
                message,
                files,
                save_to_history: true
            });
        },
        onMutate: ({ message, attachments }) => {
            addUserMessage(message, attachments);
            setLoading(true);
        },
        onSuccess: data => {
            addAssistantMessage(data.assistant_message.content);
        },
        onSettled: () => {
            setLoading(false);
        }
    });
};

export const useUploadAttachment = () => {
    return useMutation({
        mutationFn: async (file: File) => {
            const result = await uploadApi.uploadImage(file);
            return {
                id: result.file_path,
                url: result.file_path,
                name: file.name,
                mimeType: file.type,
                size: file.size
            };
        }
    });
};

export const useUploadAttachments = () => {
    return useMutation({
        mutationFn: async (files: File[]) => {
            const results = await uploadApi.uploadImages(files);
            return results.map((result, index) => ({
                id: result.file_path,
                url: result.file_path,
                name: files[index].name,
                mimeType: files[index].type,
                size: files[index].size
            }));
        }
    });
};

export const useChat = () => {
    const store = useChatStore();
    const sendMessageMutation = useSendMessage();

    const sendMessage = (message: string, attachments?: ChatAttachment[]) => {
        return sendMessageMutation.mutateAsync({ message, attachments });
    };

    return {
        messages: store.messages,
        isLoading: store.isLoading,
        isSending: sendMessageMutation.isPending,
        error: sendMessageMutation.error,

        sendMessage,
        clearMessages: store.clearMessages
    };
};
