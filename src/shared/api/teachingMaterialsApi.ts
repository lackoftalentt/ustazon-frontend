import { apiClient } from './apiClient';

export interface TeachingMaterial {
    id: number;
    title: string;
    subject: string;
    grade: string;
    topic: string;
    material_type: string;
    ai_model: string | null;
    difficulty_level: string | null;
    estimated_time: number | null;
    question_count: number | null;
    view_count: number;
    download_count: number;
    user_id: number;
    file_url: string | null;
    gamma_url?: string | null;
    status?: string;
    created_at: string | null;
}

export interface TeachingMaterialsResponse {
    items: TeachingMaterial[];
    total: number;
}

export const teachingMaterialsApi = {
    async getAll(params?: {
        material_type?: string;
        skip?: number;
        limit?: number;
    }): Promise<TeachingMaterialsResponse> {
        const response = await apiClient.get<TeachingMaterialsResponse>(
            '/teaching-materials/',
            { params }
        );
        return response.data;
    },

    async getMy(material_type?: string): Promise<TeachingMaterial[]> {
        const response = await apiClient.get<TeachingMaterial[]>(
            '/teaching-materials/my',
            { params: material_type ? { material_type } : undefined }
        );
        return response.data;
    },

    async delete(id: number): Promise<void> {
        await apiClient.delete(`/teaching-materials/${id}`);
    },
};
