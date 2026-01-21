import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { testApi, type TestFilters } from '../api/testApi';

export const testKeys = {
    all: ['tests'] as const,
    lists: () => [...testKeys.all, 'list'] as const,
    list: (params?: TestFilters) => [...testKeys.lists(), params] as const,
    infinite: (params?: Omit<TestFilters, 'skip' | 'limit'>) => [...testKeys.all, 'infinite', params] as const,
    details: () => [...testKeys.all, 'detail'] as const,
    detail: (id: number) => [...testKeys.details(), id] as const
};

export const useTests = (params?: TestFilters, enabled = true) => {
    return useQuery({
        queryKey: testKeys.list(params),
        queryFn: () => testApi.getTests(params),
        enabled,
        staleTime: 5 * 60 * 1000
    });
};

export const useTest = (id: number, enabled = true) => {
    return useQuery({
        queryKey: testKeys.detail(id),
        queryFn: () => testApi.getTestById(id),
        enabled,
        staleTime: 5 * 60 * 1000
    });
};

export const useInfiniteTests = (
    params?: Omit<TestFilters, 'skip' | 'limit'>,
    pageSize = 12
) => {
    return useInfiniteQuery({
        queryKey: testKeys.infinite(params),
        queryFn: ({ pageParam = 0 }) =>
            testApi.getTests({ ...params, skip: pageParam, limit: pageSize }),
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < pageSize) return undefined;
            return allPages.length * pageSize;
        },
        enabled: true,
        staleTime: 5 * 60 * 1000
    });
};
