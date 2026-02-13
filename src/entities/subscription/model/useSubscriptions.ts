import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { subscriptionApi } from '../api/subscriptionApi';
import type { SubscriptionCreate, SubscriptionUpdate } from '../model/types';

export const subscriptionKeys = {
	all: ['subscriptions'] as const,
	lists: () => [...subscriptionKeys.all, 'list'] as const,
	list: (params?: { skip?: number; limit?: number; active_only?: boolean }) =>
		[...subscriptionKeys.lists(), params] as const,
	expired: () => [...subscriptionKeys.all, 'expired'] as const,
	expiredList: (params?: { skip?: number; limit?: number }) =>
		[...subscriptionKeys.expired(), params] as const,
	expiringSoon: (days?: number) => [...subscriptionKeys.all, 'expiring-soon', days] as const,
	details: () => [...subscriptionKeys.all, 'detail'] as const,
	detail: (id: number) => [...subscriptionKeys.details(), id] as const,
	user: (userId: number) => [...subscriptionKeys.all, 'user', userId] as const,
	subject: (subjectId: number) => [...subscriptionKeys.all, 'subject', subjectId] as const,
	me: () => [...subscriptionKeys.all, 'me'] as const,
};

export const useSubscriptions = (params?: {
	skip?: number;
	limit?: number;
	active_only?: boolean;
}) => {
	return useQuery({
		queryKey: subscriptionKeys.list(params),
		queryFn: () => subscriptionApi.getSubscriptions(params),
		staleTime: 5 * 60 * 1000,
	});
};

export const useExpiredSubscriptions = (params?: { skip?: number; limit?: number }) => {
	return useQuery({
		queryKey: subscriptionKeys.expiredList(params),
		queryFn: () => subscriptionApi.getExpiredSubscriptions(params),
		staleTime: 5 * 60 * 1000,
	});
};

export const useExpiringSoonSubscriptions = (params?: {
	days?: number;
	skip?: number;
	limit?: number;
}) => {
	return useQuery({
		queryKey: subscriptionKeys.expiringSoon(params?.days),
		queryFn: () => subscriptionApi.getExpiringSoonSubscriptions(params),
		staleTime: 5 * 60 * 1000,
	});
};

export const useSubscription = (id: number, enabled = true) => {
	return useQuery({
		queryKey: subscriptionKeys.detail(id),
		queryFn: () => subscriptionApi.getSubscriptionById(id),
		enabled,
		staleTime: 5 * 60 * 1000,
	});
};

export const useCreateSubscription = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: SubscriptionCreate) => subscriptionApi.createSubscription(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
		},
	});
};

export const useUpdateSubscription = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: SubscriptionUpdate }) =>
			subscriptionApi.updateSubscription(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: subscriptionKeys.detail(variables.id),
			});
			queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
		},
	});
};

export const useDeleteSubscription = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => subscriptionApi.deleteSubscription(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: subscriptionKeys.lists() });
		},
	});
};

export const useUserSubscriptions = (
	userId: number,
	params?: { active_only?: boolean; skip?: number; limit?: number }
) => {
	return useQuery({
		queryKey: [...subscriptionKeys.user(userId), params] as const,
		queryFn: () => subscriptionApi.getUserSubscriptions(userId, params),
		staleTime: 5 * 60 * 1000,
	});
};

export const useSubjectSubscriptions = (
	subjectId: number,
	params?: { active_only?: boolean; skip?: number; limit?: number }
) => {
	return useQuery({
		queryKey: [...subscriptionKeys.subject(subjectId), params] as const,
		queryFn: () => subscriptionApi.getSubjectSubscriptions(subjectId, params),
		staleTime: 5 * 60 * 1000,
	});
};

export const useMySubscriptions = (params?: {
	active_only?: boolean;
	skip?: number;
	limit?: number;
}, enabled = true) => {
	return useQuery({
		queryKey: [...subscriptionKeys.me(), params] as const,
		queryFn: () => subscriptionApi.getMySubscriptions(params),
		staleTime: 5 * 60 * 1000,
		enabled,
	});
};
