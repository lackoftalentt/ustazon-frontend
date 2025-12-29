export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    attachments?: ChatAttachment[];
}

export interface ChatAttachment {
    id: string;
    type: 'image' | 'document';
    name: string;
    url?: string;
    file?: File;
}

export interface SendMessageRequest {
    message: string;
    attachments?: File[];
}

export interface SendMessageResponse {
    message: string;
}

export interface UploadAttachmentResponse {
    id: string;
    url: string;
    name: string;
    mimeType: string;
    size: number;
}
