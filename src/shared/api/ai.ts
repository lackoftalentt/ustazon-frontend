import { apiClient } from './apiClient';

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}

export interface ChatRequest {
    message: string;
    history?: ChatMessage[];
    system_instruction?: string;
}

export interface UsageInfo {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
}

export interface ChatResponse {
    message: string;
    usage: UsageInfo;
}

export const aiApi = {
    chat: async (request: ChatRequest): Promise<ChatResponse> => {
        const response = await apiClient.post<ChatResponse>(
            '/ai/chat',
            request
        );
        return response.data;
    },

    chatStream: async (
        request: ChatRequest
    ): Promise<ReadableStream<Uint8Array>> => {
        const response = await fetch(
            `${
                import.meta.env.VITE_API_URL || 'http://localhost:8000'
            }/api/v1/ai/chat/stream`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(request)
            }
        );

        if (!response.ok) {
            throw new Error('Failed to get stream response');
        }

        if (!response.body) {
            throw new Error('Response body is null');
        }

        return response.body;
    }
};
