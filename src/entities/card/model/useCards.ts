import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cardApi } from '../api/cardApi';
import type {
    CardCreate,
    CardUpdate,
    CardFilters,
    CardTopicCreate,
    CardTopicUpdate
} from '../api/cardApi';

export const cardKeys = {
    all: ['cards'] as const,
    lists: () => [...cardKeys.all, 'list'] as const,
    list: (filters?: CardFilters) => [...cardKeys.lists(), filters] as const,
    details: () => [...cardKeys.all, 'detail'] as const,
    detail: (id: number) => [...cardKeys.details(), id] as const,
    favorites: () => [...cardKeys.all, 'favorites'] as const,
    topics: {
        all: ['cardTopics'] as const,
        lists: () => [...cardKeys.topics.all, 'list'] as const,
        list: (params?: { skip?: number; limit?: number }) =>
            [...cardKeys.topics.lists(), params] as const,
        detail: (id: number) => [...cardKeys.topics.all, 'detail', id] as const
    }
};

/**
 * Hook to get cards with filters
 */
export const useCards = (filters?: CardFilters) => {
    return useQuery({
        queryKey: cardKeys.list(filters),
        queryFn: () => cardApi.getCards(filters),
        staleTime: 3 * 60 * 1000
    });
};

/**
 * Hook to get card by ID
 */
export const useCard = (id: number, enabled = true) => {
    return useQuery({
        queryKey: cardKeys.detail(id),
        queryFn: () => cardApi.getCardById(id),
        enabled,
        staleTime: 3 * 60 * 1000
    });
};

/**
 * Hook to create card
 */
export const useCreateCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CardCreate) => cardApi.createCard(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
        }
    });
};

/**
 * Hook to update card
 */
export const useUpdateCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CardUpdate }) =>
            cardApi.updateCard(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: cardKeys.detail(variables.id)
            });
            queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
        }
    });
};

export const useDeleteCard = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => cardApi.deleteCard(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
        }
    });
};

export const useToggleFavorite = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => cardApi.toggleFavorite(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: cardKeys.detail(id) });
            queryClient.invalidateQueries({ queryKey: cardKeys.favorites() });
            queryClient.invalidateQueries({ queryKey: cardKeys.lists() });
        }
    });
};

export const useMyFavorites = (params?: { skip?: number; limit?: number }) => {
    return useQuery({
        queryKey: [...cardKeys.favorites(), params] as const,
        queryFn: () => cardApi.getMyFavorites(params),
        staleTime: 3 * 60 * 1000
    });
};

export const useCardTopics = (params?: { skip?: number; limit?: number }) => {
    return useQuery({
        queryKey: cardKeys.topics.list(params),
        queryFn: () => cardApi.getCardTopics(params),
        staleTime: 5 * 60 * 1000
    });
};

export const useCardTopic = (id: number, enabled = true) => {
    return useQuery({
        queryKey: cardKeys.topics.detail(id),
        queryFn: () => cardApi.getCardTopicById(id),
        enabled,
        staleTime: 5 * 60 * 1000
    });
};

export const useCreateCardTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CardTopicCreate) => cardApi.createCardTopic(data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: cardKeys.topics.lists()
            });
        }
    });
};

export const useUpdateCardTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: CardTopicUpdate }) =>
            cardApi.updateCardTopic(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: cardKeys.topics.detail(variables.id)
            });
            queryClient.invalidateQueries({
                queryKey: cardKeys.topics.lists()
            });
        }
    });
};

export const useDeleteCardTopic = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => cardApi.deleteCardTopic(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: cardKeys.topics.lists()
            });
        }
    });
};
