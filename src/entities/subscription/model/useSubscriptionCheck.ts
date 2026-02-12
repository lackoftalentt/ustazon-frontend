import { useQuery } from '@tanstack/react-query'
import { subscriptionApi } from '../api/subscriptionApi'

export const useSubscriptionCheck = (subjectId?: number) => {
	return useQuery({
		queryKey: ['subscription-check', subjectId],
		queryFn: () => subscriptionApi.checkMySubscription(subjectId!),
		enabled: !!subjectId,
		staleTime: 5 * 60 * 1000,
	})
}
