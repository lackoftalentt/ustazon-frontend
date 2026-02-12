import { apiClient } from '@shared/api/apiClient';

import type {
	Subscription,
	SubscriptionCreate,
	SubscriptionUpdate,
	SubscriptionListParams,
	UserSubscriptionsParams,
} from '../model/types';

export const subscriptionApi = {
	async getSubscriptions(params?: SubscriptionListParams): Promise<Subscription[]> {
		const response = await apiClient.get<Subscription[]>('/subscriptions', {
			params,
		});
		return response.data;
	},

	async getExpiredSubscriptions(params?: { skip?: number; limit?: number }): Promise<Subscription[]> {
		const response = await apiClient.get<Subscription[]>('/subscriptions/expired', {
			params,
		});
		return response.data;
	},

	async getExpiringSoonSubscriptions(params?: {
		days?: number;
		skip?: number;
		limit?: number;
	}): Promise<Subscription[]> {
		const response = await apiClient.get<Subscription[]>('/subscriptions/expiring-soon', {
			params,
		});
		return response.data;
	},

	async getSubscriptionById(id: number): Promise<Subscription> {
		const response = await apiClient.get<Subscription>(`/subscriptions/${id}`);
		return response.data;
	},

	async createSubscription(data: SubscriptionCreate): Promise<Subscription> {
		const response = await apiClient.post<Subscription>('/subscriptions', data);
		return response.data;
	},

	async updateSubscription(id: number, data: SubscriptionUpdate): Promise<Subscription> {
		const response = await apiClient.put<Subscription>(`/subscriptions/${id}`, data);
		return response.data;
	},

	async deleteSubscription(id: number): Promise<void> {
		await apiClient.delete(`/subscriptions/${id}`);
	},

	async getUserSubscriptions(userId: number, params?: UserSubscriptionsParams): Promise<Subscription[]> {
		const response = await apiClient.get<Subscription[]>(`/subscriptions/users/${userId}/subscriptions`, {
			params,
		});
		return response.data;
	},

	async getSubjectSubscriptions(subjectId: number, params?: UserSubscriptionsParams): Promise<Subscription[]> {
		const response = await apiClient.get<Subscription[]>(`/subscriptions/subjects/${subjectId}/subscriptions`, {
			params,
		});
		return response.data;
	},

	async getMySubscriptions(params?: UserSubscriptionsParams): Promise<Subscription[]> {
		const response = await apiClient.get<Subscription[]>('/subscriptions/me/subscriptions', {
			params,
		});
		return response.data;
	},

	async checkMySubscription(subjectId: number): Promise<{ has_subscription: boolean }> {
		const response = await apiClient.get<{ has_subscription: boolean }>('/subscriptions/me/check', {
			params: { subject_id: subjectId },
		});
		return response.data;
	},
};
