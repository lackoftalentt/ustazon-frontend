export interface Message {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
}

export interface ChatMessageProps {
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
}

export interface ChatInputProps {
    onSend: (message: string) => void;
    placeholder?: string;
}
