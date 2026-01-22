import { apiClient } from './apiClient'

export interface Template {
	id: number
	name: string
	code_name: string
	created_at: string
}

export const templatesApi = {
	async getTemplates(): Promise<Template[]> {
		const response = await apiClient.get<Template[]>('/subjects/templates/')
		return response.data
	}
}
