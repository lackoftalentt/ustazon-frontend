import { useQuery } from '@tanstack/react-query'
import {
	kmzhApi,
	type KmzhFilters,
	type KmzhByQuarterFilters
} from '../api/kmzhApi'

export const kmzhKeys = {
	all: ['kmzh'] as const,
	lists: () => [...kmzhKeys.all, 'list'] as const,
	list: (filters?: KmzhFilters) => [...kmzhKeys.lists(), filters] as const,
	details: () => [...kmzhKeys.all, 'detail'] as const,
	detail: (id: number) => [...kmzhKeys.details(), id] as const,
	byQuarter: (quarter: number, filters?: KmzhByQuarterFilters) =>
		[...kmzhKeys.all, 'quarter', quarter, filters] as const
}

export const useKmzhList = (filters?: KmzhFilters, subjectCode?: string) => {
	const queryFilters = filters
		? { ...filters, code: subjectCode || filters.code }
		: undefined

	return useQuery({
		queryKey: kmzhKeys.list(queryFilters),
		queryFn: () => kmzhApi.getKmzhList(queryFilters),
		enabled: queryFilters !== undefined,
		staleTime: 3 * 60 * 1000
	})
}

export const useKmzhDetail = (id: number, enabled = true) => {
	return useQuery({
		queryKey: kmzhKeys.detail(id),
		queryFn: () => kmzhApi.getKmzhById(id),
		enabled: enabled && id > 0,
		staleTime: 3 * 60 * 1000
	})
}

export const useKmzhByQuarter = (
	quarter: number,
	filters?: KmzhByQuarterFilters,
	enabled = true
) => {
	return useQuery({
		queryKey: kmzhKeys.byQuarter(quarter, filters),
		queryFn: () => kmzhApi.getKmzhByQuarter(quarter, filters),
		enabled: enabled && quarter >= 1 && quarter <= 4,
		staleTime: 3 * 60 * 1000
	})
}
