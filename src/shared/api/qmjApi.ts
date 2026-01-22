import { apiClient } from './apiClient'

export interface CreateQMJRequest {
	grade: number
	quarter: number
	code: string
	title: string
	text: string
	hour: number
	order?: number
	file?: string
	subject_ids: number[]
	institution_type_ids: number[]
}

export interface AddFileToQMJRequest {
	file: string
	file_size: number
	file_type: string
}

export interface QMJFileResponse {
	id: number
	qmj_id: number
	file: string
	file_size: number
	file_type: string
	uploaded_by_id: number
	uploaded_at: string
	file_size_formatted: string
	file_icon_class: string
}

export interface QMJResponse {
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
	files: QMJFileResponse[]
}

export const qmjApi = {
	async createQMJ(data: CreateQMJRequest): Promise<QMJResponse> {
		const response = await apiClient.post<QMJResponse>('/qmj/', data)
		return response.data
	},

	async addFileToQMJ(
		qmjId: number,
		fileData: AddFileToQMJRequest
	): Promise<QMJFileResponse> {
		const response = await apiClient.post<QMJFileResponse>(
			`/qmj/${qmjId}/files`,
			fileData
		)
		return response.data
	}
}
