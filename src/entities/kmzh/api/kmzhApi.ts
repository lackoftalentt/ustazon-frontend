import { apiClient } from '@shared/api/apiClient'

export interface KmzhItem {
	id: number
	grade: number
	quarter: number
	code: string
	title: string
	hour: number
	order: number
	author_id: number
	files_count: number
	created_at: string
}

export interface KmzhFile {
	file: string
	file_size: number
	file_type: string
	id: number
	qmj_id: number
	uploaded_by_id: number
	uploaded_at: string
	file_size_formatted: string
	file_icon_class: string
}

export interface KmzhDetail {
	id: number
	grade: number
	quarter: number
	code: string
	title: string
	text: string
	hour: number
	order: number
	file: string | null
	author_id: number
	created_at: string
	updated_at: string
	has_files: boolean
	files_count: number
	files: KmzhFile[]
}

export interface KmzhFilters {
	skip?: number
	limit?: number
	grade?: number
	quarter?: number
	code?: string
	author_id?: number
}

export interface KmzhByQuarterFilters {
	grade?: number
	code?: string
}

export const kmzhApi = {
	async getKmzhList(filters?: KmzhFilters): Promise<KmzhItem[]> {
		const response = await apiClient.get<KmzhItem[]>('/qmj/', {
			params: filters
		})
		return response.data
	},

	async getKmzhById(id: number): Promise<KmzhDetail> {
		const response = await apiClient.get<KmzhDetail>(`/qmj/${id}`)
		return response.data
	},

	async getKmzhByQuarter(
		quarter: number,
		filters?: KmzhByQuarterFilters
	): Promise<KmzhItem[]> {
		const response = await apiClient.get<KmzhItem[]>(`/qmj/quarter/${quarter}`, {
			params: filters
		})
		return response.data
	}
}
