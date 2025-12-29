import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectApi } from '../api/subjectApi';
import type { SubjectCreate, SubjectUpdate } from '../api/subjectApi';

// Query keys
export const subjectKeys = {
    all: ['subjects'] as const,
    lists: () => [...subjectKeys.all, 'list'] as const,
    list: (params?: { skip?: number; limit?: number }) =>
        [...subjectKeys.lists(), params] as const,
    details: () => [...subjectKeys.all, 'detail'] as const,
    detail: (id: number) => [...subjectKeys.details(), id] as const,
    byCode: (code: string) => [...subjectKeys.all, 'code', code] as const,
    institutionTypes: ['institutionTypes'] as const
};

/**
 * Hook to get all subjects
 */
export const useSubjects = (params?: { skip?: number; limit?: number }) => {
    return useQuery({
        queryKey: subjectKeys.list(params),
        queryFn: () => subjectApi.getSubjects(params),
        staleTime: 5 * 60 * 1000 // 5 minutes
    });
};

/**
 * Hook to get subject by ID
 */
export const useSubject = (id: number, enabled = true) => {
    return useQuery({
        queryKey: subjectKeys.detail(id),
        queryFn: () => subjectApi.getSubjectById(id),
        enabled,
        staleTime: 5 * 60 * 1000
    });
};

/**
 * Hook to get subject by code
 */
export const useSubjectByCode = (code: string, enabled = true) => {
    return useQuery({
        queryKey: subjectKeys.byCode(code),
        queryFn: () => subjectApi.getSubjectByCode(code),
        enabled: enabled && !!code,
        staleTime: 5 * 60 * 1000
    });
};

/**
 * Hook to create subject
 */
export const useCreateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: SubjectCreate) => subjectApi.createSubject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
        }
    });
};

/**
 * Hook to update subject
 */
export const useUpdateSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: SubjectUpdate }) =>
            subjectApi.updateSubject(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: subjectKeys.detail(variables.id)
            });
            queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
        }
    });
};

/**
 * Hook to delete subject
 */
export const useDeleteSubject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => subjectApi.deleteSubject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: subjectKeys.lists() });
        }
    });
};

/**
 * Hook to get all institution types
 */
export const useInstitutionTypes = (params?: {
    skip?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: [...subjectKeys.institutionTypes, params] as const,
        queryFn: () => subjectApi.getInstitutionTypes(params),
        staleTime: 10 * 60 * 1000 // 10 minutes
    });
};

/**
 * Hook to get institution type by ID
 */
export const useInstitutionType = (id: number, enabled = true) => {
    return useQuery({
        queryKey: [...subjectKeys.institutionTypes, id] as const,
        queryFn: () => subjectApi.getInstitutionTypeById(id),
        enabled,
        staleTime: 10 * 60 * 1000
    });
};
