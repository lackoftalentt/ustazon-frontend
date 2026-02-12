import { apiClient } from '@shared/api/apiClient';

export interface CardTopic {
    id: number;
    topic: string;
    parent_topic_id: number | null;
    created_at: string;
    updated_at?: string;
    children?: CardTopic[];
}

export interface CardAuthor {
    id: number;
    name: string;
    iin: string;
}

export interface CardListItem {
    id: number;
    name: string;
    description: string | null;
    grade: number | null;
    quarter: number | null;
    subject_card: string | null;
    url: string | null;
    img1_url: string | null;
    img2_url: string | null;
    img3_url: string | null;
    img4_url: string | null;
    img5_url: string | null;
    created_at: string;
    author: CardAuthor;
    topic: CardTopic | null;
    window_id: number | null;
    template_id: number | null;
}

export interface CardDetailResponse {
    id: number;
    name: string;
    description: string | null;
    grade: number | null;
    quarter: number | null;
    subject_card: string | null;
    file_path: string | null;
    url: string | null;
    iframe: boolean;
    img1_url: string | null;
    img2_url: string | null;
    img3_url: string | null;
    img4_url: string | null;
    img5_url: string | null;
    video1_url: string | null;
    video1_file_path: string | null;
    created_at: string;
    updated_at: string;
    author_id: number;
    topic_id: number | null;
    window_id: number | null;
    author: CardAuthor;
    topic: CardTopic | null;
    subjects: Array<{
        id: number;
        name: string;
        code: string;
    }>;
    institution_types: Array<{
        id: number;
        name: string;
    }>;
}

export interface CardCreate {
    name: string;
    description?: string;
    grade?: number;
    quarter?: number;
    subject_card?: string;
    file_path?: string;
    url?: string;
    iframe?: boolean;
    img1_url?: string;
    img2_url?: string;
    img3_url?: string;
    img4_url?: string;
    img5_url?: string;
    video1_url?: string;
    video1_file_path?: string;
    topic_id?: number;
    window_id?: number;
    subject_ids?: number[];
    institution_type_ids?: number[];
}

export interface CardUpdate {
    name?: string;
    description?: string;
    grade?: number;
    quarter?: number;
    subject_card?: string;
    file_path?: string;
    url?: string;
    iframe?: boolean;
    img1_url?: string;
    img2_url?: string;
    img3_url?: string;
    img4_url?: string;
    img5_url?: string;
    video1_url?: string;
    video1_file_path?: string;
    topic_id?: number;
    window_id?: number;
    subject_ids?: number[];
    institution_type_ids?: number[];
}

export interface CardFilters {
    skip?: number;
    limit?: number;
    grade?: number;
    quarter?: number;
    subject_id?: number;
    institution_type_id?: number;
    topic_id?: number;
    window_id?: number;
    author_id?: number;
    search?: string;
}

export interface CardTopicCreate {
    topic: string;
    parent_topic_id?: number | null;
}

export interface CardTopicUpdate {
    topic?: string;
    parent_topic_id?: number | null;
}

export const cardApi = {
    async getCards(filters?: CardFilters): Promise<CardListItem[]> {
        const response = await apiClient.get<CardListItem[]>('/cards/', {
            params: filters
        });
        return response.data;
    },

    async getCardById(id: number): Promise<CardDetailResponse> {
        const response = await apiClient.get<CardDetailResponse>(
            `/cards/${id}`
        );
        return response.data;
    },

    async createCard(data: CardCreate): Promise<CardDetailResponse> {
        const response = await apiClient.post<CardDetailResponse>(
            '/cards/',
            data
        );
        return response.data;
    },

    async updateCard(
        id: number,
        data: CardUpdate
    ): Promise<CardDetailResponse> {
        const response = await apiClient.put<CardDetailResponse>(
            `/cards/${id}`,
            data
        );
        return response.data;
    },

    async deleteCard(id: number): Promise<void> {
        await apiClient.delete(`/cards/${id}`);
    },

    async toggleFavorite(id: number): Promise<CardDetailResponse> {
        const response = await apiClient.post<CardDetailResponse>(
            `/cards/${id}/favorite`
        );
        return response.data;
    },

    async getMyFavorites(params?: {
        skip?: number;
        limit?: number;
    }): Promise<CardListItem[]> {
        const response = await apiClient.get<CardListItem[]>(
            '/cards/favorites/me',
            { params }
        );
        return response.data;
    },

    async getCardTopics(params?: {
        skip?: number;
        limit?: number;
    }): Promise<CardTopic[]> {
        const response = await apiClient.get<CardTopic[]>('/cards/topics/', {
            params
        });
        return response.data;
    },

    async getCardTopicById(id: number): Promise<CardTopic> {
        const response = await apiClient.get<CardTopic>(`/cards/topics/${id}`);
        return response.data;
    },

    async createCardTopic(data: CardTopicCreate): Promise<CardTopic> {
        const response = await apiClient.post<CardTopic>(
            '/cards/topics/',
            data
        );
        return response.data;
    },

    async updateCardTopic(
        id: number,
        data: CardTopicUpdate
    ): Promise<CardTopic> {
        const response = await apiClient.put<CardTopic>(
            `/cards/topics/${id}`,
            data
        );
        return response.data;
    },

    async deleteCardTopic(id: number): Promise<void> {
        await apiClient.delete(`/cards/topics/${id}`);
    }
};
