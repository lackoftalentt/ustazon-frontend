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

// Teaching Materials types
export interface UserPresentation {
    id: number;
    title: string;
    grade: string;
    topic: string;
    status: string;
    gamma_url: string | null;
    created_at: string;
}

export interface PresentationSlide {
    slide_number: number;
    title: string;
    content: string[];
    image_query?: string;
    notes?: string;
}

export interface PresentationDetail {
    id: number;
    title: string | null;
    subject: string | null;
    grade: string | null;
    topic: string | null;
    status: string;
    gamma_url: string | null;
    slides: PresentationSlide[] | null;
    created_at: string | null;
}

export interface PresentationStatusResponse {
    id: number;
    status: string;
    gamma_url: string | null;
}

export interface UserTest {
    id: number;
    title: string;
    subject: string;
    duration: number;
    difficulty: string;
    user_id: number | null;
    questions_count: number;
    created_at: string;
    updated_at: string;
}

// Multi-model response type
export interface MultiModelResponse {
    model: string;
    provider: string;
    text: string | null;
    usage: UsageInfo | null;
    error: string | null;
}

export interface ChatMultiResponse {
    responses: MultiModelResponse[];
}

export interface AiUsageResponse {
    is_subscriber: boolean;
    remaining: number;
    limit: number;
}

export const aiApi = {
    // Get AI usage info (remaining messages for free users)
    getUsage: async (): Promise<AiUsageResponse> => {
        const response = await apiClient.get<AiUsageResponse>('/ai/usage');
        return response.data;
    },
    // Basic chat (no history saving)
    chat: async (request: ChatRequest): Promise<ChatResponse> => {
        const response = await apiClient.post<ChatResponse>(
            '/ai/chat',
            request
        );
        return response.data;
    },

    // Multi-model chat - get responses from 3 models at once
    chatMulti: async (request: ChatRequest): Promise<ChatMultiResponse> => {
        const response = await apiClient.post<ChatMultiResponse>(
            '/ai/chat/multi',
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

    // Start presentation generation via Gamma API (async — returns immediately)
    generatePresentation: async (
        subject: string,
        grade: string,
        topic: string,
        slidesCount: number = 12
    ): Promise<{ id: number; gamma_document_id: string; status: string }> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('topic', topic);
        formData.append('slides_count', slidesCount.toString());

        const response = await apiClient.post<{ id: number; gamma_document_id: string; status: string }>(
            '/ai/generate-presentation-gamma',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Check presentation generation status
    checkPresentationStatus: async (
        presentationId: number
    ): Promise<PresentationStatusResponse> => {
        const response = await apiClient.get<PresentationStatusResponse>(
            `/ai/presentations/${presentationId}/status`
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

    // Generate Test and save to DB
    generateTestToDb: async (
        subject: string,
        grade: string,
        topic: string,
        questionCount: number = 15,
        difficulty: string = 'medium'
    ): Promise<{ id: number; title: string; subject: string; questions_count: number }> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('grade', grade);
        formData.append('topic', topic);
        formData.append('question_count', questionCount.toString());
        formData.append('difficulty', difficulty);

        const response = await apiClient.post(
            '/ai/generate-test-db',
            formData,
            {
                timeout: 120000,
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

    // Manim Video Generation — returns JSON with video_url
    generateManimVideo: async (
        subject: string,
        topic: string,
        detailLevel: string = 'medium',
        model: string = 'gemini-2.5-flash'
    ): Promise<{ video_url: string }> => {
        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('topic', topic);
        formData.append('detail_level', detailLevel);
        formData.append('model', model);

        const response = await apiClient.post<{ video_url: string }>(
            '/ai/generate-manim',
            formData,
            {
                timeout: 600000, // 10 minutes for video rendering
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );
        return response.data;
    },

    // Get user's generated presentations
    getUserPresentations: async (): Promise<UserPresentation[]> => {
        const response = await apiClient.get<UserPresentation[]>(
            '/teaching-materials/my',
            { params: { material_type: 'presentation' } }
        );
        return response.data;
    },

    // Get single presentation by ID
    getPresentationById: async (id: number): Promise<PresentationDetail> => {
        const response = await apiClient.get<PresentationDetail>(
            `/ai/presentations/${id}`
        );
        return response.data;
    },

    // Get user's tests
    getUserTests: async (): Promise<UserTest[]> => {
        const response = await apiClient.get<UserTest[]>('/tests/my');
        return response.data;
    }
};
