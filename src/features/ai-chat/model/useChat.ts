import { useMutation } from '@tanstack/react-query';
import { chatApi } from '../api/chatApi';
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
            const attachmentIds = attachments
                ?.filter(a => a.id)
                .map(a => a.id);

            return chatApi.sendMessage(message, attachmentIds);
        },
        onMutate: ({ message, attachments }) => {
            addUserMessage(message, attachments);
            setLoading(true);
        },
        onSuccess: data => {
            addAssistantMessage(data.message);
        },
        onSettled: () => {
            setLoading(false);
        }
    });
};

export const useUploadAttachment = () => {
    return useMutation({
        mutationFn: (file: File) => chatApi.uploadAttachment(file)
    });
};

export const useUploadAttachments = () => {
    return useMutation({
        mutationFn: (files: File[]) => chatApi.uploadAttachments(files)
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
