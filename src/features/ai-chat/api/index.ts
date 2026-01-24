// Re-export from shared AI API (using correct backend endpoints)
export { aiApi as chatApi } from '@/shared/api/ai';
export { uploadApi } from '@/shared/api/uploadApi';

export type {
    ChatMessage,
    ChatAttachment,
    SendMessageRequest,
    SendMessageResponse,
    UploadAttachmentResponse
} from './types';
