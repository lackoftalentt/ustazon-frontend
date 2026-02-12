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

export interface Template {
    id: number;
    name: string;
    code_name: string;
    created_at: string;
}

export interface TemplateCreate {
    name: string;
    code_name: string;
}

export interface TemplateUpdate {
    name?: string;
    code_name?: string;
}

export interface SubjectCreate {
    name: string;
    code: string;
    image_url?: string;
    hero_image_url?: string;
    image_file?: string;
    hero_image_file?: string;
    institution_type_ids?: number[];
    window_ids?: number[];
}

export interface SubjectUpdate {
    name?: string;
    code?: string;
    image_url?: string;
    hero_image_url?: string;
    image_file?: string;
    hero_image_file?: string;
    institution_type_ids?: number[];
    window_ids?: number[];
}

export interface InstitutionTypeCreate {
    name: string;
    code?: string | null;
}

export interface InstitutionTypeUpdate {
    name?: string;
    code?: string | null;
}

export interface WindowCreate {
    name: string;
    template_id?: number | null;
    link?: string | null;
    nsub?: boolean;
    image_url?: string | null;
    image_file?: string | null;
    subject_ids?: number[];
}

export interface WindowUpdate {
    name?: string;
    template_id?: number | null;
    link?: string | null;
    nsub?: boolean;
    image_url?: string | null;
    image_file?: string | null;
    subject_ids?: number[];
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
    },

    // Template CRUD
    async getTemplates(params?: {
        skip?: number;
        limit?: number;
    }): Promise<Template[]> {
        const response = await apiClient.get<Template[]>('/subjects/templates/', {
            params
        });
        return response.data;
    },

    async createTemplate(data: TemplateCreate): Promise<Template> {
        const response = await apiClient.post<Template>('/subjects/templates/', data);
        return response.data;
    },

    async updateTemplate(id: number, data: TemplateUpdate): Promise<Template> {
        const response = await apiClient.put<Template>(`/subjects/templates/${id}`, data);
        return response.data;
    },

    async deleteTemplate(id: number): Promise<void> {
        await apiClient.delete(`/subjects/templates/${id}`);
    },

    // InstitutionType CRUD
    async createInstitutionType(data: InstitutionTypeCreate): Promise<InstitutionType> {
        const response = await apiClient.post<InstitutionType>('/subjects/institution-types/', data);
        return response.data;
    },

    async updateInstitutionType(id: number, data: InstitutionTypeUpdate): Promise<InstitutionType> {
        const response = await apiClient.put<InstitutionType>(`/subjects/institution-types/${id}`, data);
        return response.data;
    },

    async deleteInstitutionType(id: number): Promise<void> {
        await apiClient.delete(`/subjects/institution-types/${id}`);
    },

    // Window CRUD
    async createWindow(data: WindowCreate): Promise<Window> {
        const response = await apiClient.post<Window>('/subjects/windows/', data);
        return response.data;
    },

    async updateWindow(id: number, data: WindowUpdate): Promise<Window> {
        const response = await apiClient.put<Window>(`/subjects/windows/${id}`, data);
        return response.data;
    },

    async deleteWindow(id: number): Promise<void> {
        await apiClient.delete(`/subjects/windows/${id}`);
    }
};
