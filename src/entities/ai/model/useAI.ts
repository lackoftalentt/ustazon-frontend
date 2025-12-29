import { useMutation } from '@tanstack/react-query';
import { aiApi, ChatRequest, ChatResponse } from '@/shared/api/ai';

export const useAIChat = () => {
  return useMutation<ChatResponse, Error, ChatRequest>({
    mutationFn: (request: ChatRequest) => aiApi.chat(request),
  });
};

export const useAIChatStream = () => {
  return useMutation<ReadableStream<Uint8Array>, Error, ChatRequest>({
    mutationFn: (request: ChatRequest) => aiApi.chatStream(request),
  });
};
