import { useQuery } from '@tanstack/react-query'
import { templatesApi } from './templatesApi'

export const templateKeys = {
	all: ['templates'] as const,
	list: () => [...templateKeys.all, 'list'] as const
}

export const useTemplates = () => {
	return useQuery({
		queryKey: templateKeys.list(),
		queryFn: () => templatesApi.getTemplates(),
		staleTime: 10 * 60 * 1000
	})
}
