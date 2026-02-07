import { apiClient } from '@shared/api/apiClient';

export interface InstitutionType {
    id: number;
    name: string;
    code: string | null;
    created_at: string;
    updated_at: string;
}

export interface Window {
    id: number;
    name: string;
    template_id: number | null;
    link: string | null;
    nsub: boolean;
    image_url: string | null;
    image_file: string | null;
    created_at: string;
}

export interface Subject {
    id: number;
    name: string;
    code: string;
    image_url: string | null;
    hero_image_url: string | null;
    image_file: string | null;
    hero_image_file: string | null;
    created_at: string;
    updated_at: string;
    institution_types: InstitutionType[];
    windows: Window[];
}

export interface SubjectCreate {
    name: string;
    code: string;
    image_url?: string;
    hero_image_url?: string;
    institution_type_ids?: number[];
}

export interface SubjectUpdate {
    name?: string;
    code?: string;
    image_url?: string;
    hero_image_url?: string;
    institution_type_ids?: number[];
}

export const subjectApi = {
    async getSubjects(params?: {
        skip?: number;
        limit?: number;
    }): Promise<Subject[]> {
        const response = await apiClient.get<Subject[]>('/subjects', {
            params
        });
        return response.data;
    },

    async getSubjectById(id: number): Promise<Subject> {
        const response = await apiClient.get<Subject>(`/subjects/${id}`);
        return response.data;
    },

    async getSubjectByCode(code: string): Promise<Subject> {
        const response = await apiClient.get<Subject>(
            `/subjects/code/${encodeURIComponent(code)}`
        );
        return response.data;
    },

    async createSubject(data: SubjectCreate): Promise<Subject> {
        const response = await apiClient.post<Subject>('/subjects', data);
        return response.data;
    },

    async updateSubject(id: number, data: SubjectUpdate): Promise<Subject> {
        const response = await apiClient.put<Subject>(`/subjects/${id}`, data);
        return response.data;
    },

    async deleteSubject(id: number): Promise<void> {
        await apiClient.delete(`/subjects/${id}`);
    },

    async getInstitutionTypes(params?: {
        skip?: number;
        limit?: number;
    }): Promise<InstitutionType[]> {
        const response = await apiClient.get<InstitutionType[]>(
            '/subjects/institution-types/',
            { params }
        );
        return response.data;
    },

    async getInstitutionTypeById(id: number): Promise<InstitutionType> {
        const response = await apiClient.get<InstitutionType>(
            `/subjects/institution-types/${id}`
        );
        return response.data;
    },

    async getWindows(params?: {
        skip?: number;
        limit?: number;
    }): Promise<Window[]> {
        const response = await apiClient.get<Window[]>('/subjects/windows/', {
            params
        });
        return response.data;
    },

    async getWindowById(id: number): Promise<Window> {
        const response = await apiClient.get<Window>(`/subjects/windows/${id}`);
        return response.data;
    }
};
