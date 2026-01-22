import { apiClient } from './apiClient'

export interface UploadResponse {
	file_path: string
	message: string
}

export const uploadApi = {
	async uploadImage(file: File): Promise<UploadResponse> {
		const formData = new FormData()
		formData.append('file', file)

		const response = await apiClient.post<UploadResponse>(
			'/uploads/images',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		return response.data
	},

	async uploadVideo(file: File): Promise<UploadResponse> {
		const formData = new FormData()
		formData.append('file', file)

		const response = await apiClient.post<UploadResponse>(
			'/uploads/videos',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		return response.data
	},

	async uploadDocument(file: File): Promise<UploadResponse> {
		const formData = new FormData()
		formData.append('file', file)

		const response = await apiClient.post<UploadResponse>(
			'/uploads/documents',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		return response.data
	},

	async uploadImages(files: File[]): Promise<UploadResponse[]> {
		const formData = new FormData()
		files.forEach(file => {
			formData.append('files', file)
		})

		const response = await apiClient.post<UploadResponse[]>(
			'/uploads/images/bulk',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
		)
		return response.data
	}
}
