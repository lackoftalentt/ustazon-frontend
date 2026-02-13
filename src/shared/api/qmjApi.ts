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

export interface UpdateQMJRequest {
	grade?: number
	quarter?: number
	code?: string
	title?: string
	text?: string
	hour?: number
	order?: number
	file?: string
	subject_ids?: number[]
	institution_type_ids?: number[]
}

export interface AddFileToQMJRequest {
	file: File
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
		const formData = new FormData()
		formData.append('file', fileData.file)

		const response = await apiClient.post<QMJFileResponse>(
			`/qmj/${qmjId}/files`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		return response.data
	},

	async updateQMJ(
		qmjId: number,
		data: UpdateQMJRequest
	): Promise<QMJResponse> {
		const response = await apiClient.put<QMJResponse>(`/qmj/${qmjId}`, data)
		return response.data
	},

	async deleteQMJ(qmjId: number): Promise<void> {
		await apiClient.delete(`/qmj/${qmjId}`)
	},

	async deleteQMJFile(fileId: number): Promise<void> {
		await apiClient.delete(`/qmj/files/${fileId}`)
	}
}
