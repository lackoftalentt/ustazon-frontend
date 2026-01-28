import { apiClient } from './apiClient';

// Base types
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

// Conversation types
export interface Message {
    id: number;
    role: string;
    content: string;
    input_tokens?: number;
    output_tokens?: number;
    total_tokens?: number;
    created_at: string;
}

export interface Conversation {
    id: number;
    user_id: number;
    title?: string;
    subject?: string;
    message_count: number;
    total_tokens: number;
    created_at: string;
    updated_at: string;
    messages?: Message[];
}

export interface ConversationListItem {
    id: number;
    title?: string;
    subject?: string;
    message_count: number;
    total_tokens: number;
    created_at: string;
    updated_at: string;
}

export interface ConversationCreate {
    title?: string;
    subject?: string;
}

export interface ConversationUpdate {
    title?: string;
    subject?: string;
}

export interface SendMessageRequest {
    conversation_id?: number;
    message: string;
    subject?: string;
    save_to_history?: boolean;
    model?: string;
    files?: File[];
}

export interface SendMessageResponse {
    conversation_id: number;
    user_message: Message;
    assistant_message: Message;
}

// Prompt types
export interface PromptTemplate {
    key: string;
    name_ru: string;
    name_kk: string;
    prompt: string;
    category: string;
}

export interface PromptCategory {
    key: string;
    name: string;
}

export interface SubjectInfo {
    code: string;
    name_ru: string;
    name_kk: string;
}

export const aiApi = {
    // Basic chat (no history saving)
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
            `${import.meta.env.VITE_API_URL || 'http://localhost:8000'
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
    },

    // Conversations management
    createConversation: async (
        data: ConversationCreate
    ): Promise<Conversation> => {
        const response = await apiClient.post<Conversation>(
            '/ai/conversations',
            data
        );
        return response.data;
    },

    getConversations: async (
        skip = 0,
        limit = 50
    ): Promise<ConversationListItem[]> => {
        const response = await apiClient.get<ConversationListItem[]>(
            '/ai/conversations',
            { params: { skip, limit } }
        );
        return response.data;
    },

    getConversation: async (conversationId: number): Promise<Conversation> => {
        const response = await apiClient.get<Conversation>(
            `/ai/conversations/${conversationId}`
        );
        return response.data;
    },

    updateConversation: async (
        conversationId: number,
        data: ConversationUpdate
    ): Promise<Conversation> => {
        const response = await apiClient.put<Conversation>(
            `/ai/conversations/${conversationId}`,
            data
        );
        return response.data;
    },

    deleteConversation: async (conversationId: number): Promise<void> => {
        await apiClient.delete(`/ai/conversations/${conversationId}`);
    },

    // Send message with history saving (supports files)
    sendMessage: async (
        request: SendMessageRequest
    ): Promise<SendMessageResponse> => {
        // Always use FormData (backend expects Form parameters)
        const formData = new FormData();
        formData.append('message', request.message);

        if (request.conversation_id) {
            formData.append(
                'conversation_id',
                request.conversation_id.toString()
            );
        }
        if (request.subject) {
            formData.append('subject', request.subject);
        }
        if (request.save_to_history !== undefined) {
            formData.append(
                'save_to_history',
                request.save_to_history.toString()
            );
        }
        if (request.model) {
            formData.append('model', request.model);
        }

        // Append files if provided
        if (request.files && request.files.length > 0) {
            request.files.forEach(file => {
                formData.append('files', file);
            });
        }

        const response = await apiClient.post<SendMessageResponse>(
            '/ai/messages',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Generate PDF from AI response
    generatePDF: async (
        content: string,
        title: string = 'Документ',
        documentType: string = 'lesson_plan'
    ): Promise<Blob> => {
        const formData = new FormData();
        formData.append('content', content);
        formData.append('title', title);
        formData.append('document_type', documentType);

        const response = await apiClient.post('/ai/generate-pdf', formData, {
            responseType: 'blob',
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    // Get available AI models
    getAvailableModels: async (): Promise<{
        models: Record<string, {
            name: string;
            description: string;
            cost: string;
            quality: string;
        }>;
    }> => {
        const response = await apiClient.get('/ai/models');
        return response.data;
    },

    // Generate PowerPoint presentation
    generatePresentation: async (
        subject: string,
        grade: string,
        topic: string,
        slidesCount: number = 12,
        model: string = 'gemini-2.5-flash'
    ): Promise<Blob> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('topic', topic);
        formData.append('slides_count', slidesCount.toString());
        formData.append('model', model);

        const response = await apiClient.post(
            '/ai/generate-presentation',
            formData,
            {
                responseType: 'blob',
                timeout: 120000, // 2 minutes for presentation generation
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Generate Lesson Plan (DOCX)
    generateLessonPlan: async (
        subject: string,
        grade: string,
        topic: string,
        duration: number = 45,
        model: string = 'gemini-2.5-flash'
    ): Promise<Blob> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('topic', topic);
        formData.append('duration', duration.toString());
        formData.append('model', model);

        const response = await apiClient.post(
            '/ai/generate-lesson-plan',
            formData,
            {
                responseType: 'blob',
                timeout: 60000, // 1 minute
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Generate Test (DOCX)
    generateTest: async (
        subject: string,
        grade: string,
        topic: string,
        questionCount: number = 15,
        difficulty: string = 'medium',
        model: string = 'gemini-2.5-flash'
    ): Promise<Blob> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('topic', topic);
        formData.append('question_count', questionCount.toString());
        formData.append('difficulty', difficulty);
        formData.append('model', model);

        const response = await apiClient.post(
            '/ai/generate-test',
            formData,
            {
                responseType: 'blob',
                timeout: 120000, // 2 minutes for test generation
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Generate Homework (DOCX)
    generateHomework: async (
        subject: string,
        grade: string,
        topic: string,
        duration: number = 30,
        difficulty: string = 'medium',
        model: string = 'gemini-2.5-flash'
    ): Promise<Blob> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('topic', topic);
        formData.append('duration', duration.toString());
        formData.append('difficulty', difficulty);
        formData.append('model', model);

        const response = await apiClient.post(
            '/ai/generate-homework',
            formData,
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Generate Rubric (DOCX)
    generateRubric: async (
        subject: string,
        grade: string,
        workType: string,
        description: string,
        model: string = 'gemini-2.5-flash'
    ): Promise<Blob> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('work_type', workType);
        formData.append('description', description);
        formData.append('model', model);

        const response = await apiClient.post(
            '/ai/generate-rubric',
            formData,
            {
                responseType: 'blob',
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Prompts
    getPrompts: async (): Promise<Record<string, any>> => {
        const response = await apiClient.get('/ai/prompts');
        return response.data;
    },

    getPrompt: async (promptKey: string): Promise<PromptTemplate> => {
        const response = await apiClient.get<PromptTemplate>(
            `/ai/prompts/${promptKey}`
        );
        return response.data;
    },

    getSystemPrompt: async (subject?: string): Promise<any> => {
        const response = await apiClient.get('/ai/system-prompt', {
            params: subject ? { subject } : {}
        });
        return response.data;
    },

    getSubjects: async (): Promise<{ subjects: SubjectInfo[] }> => {
        const response = await apiClient.get('/ai/subjects');
        return response.data;
    },

    getCategories: async (): Promise<{ categories: PromptCategory[] }> => {
        const response = await apiClient.get('/ai/categories');
        return response.data;
    },

    // Manim Video Generation
    generateManimVideo: async (
        topic: string,
        detailLevel: string = 'medium',
        model: string = 'gemini-2.5-flash'
    ): Promise<Blob> => {
        const formData = new FormData();
        formData.append('topic', topic);
        formData.append('detail_level', detailLevel);
        formData.append('model', model);

        const response = await apiClient.post(
            '/ai/generate-manim',
            formData,
            {
                responseType: 'blob',
                timeout: 300000, // 5 minutes for video rendering
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    }
};
