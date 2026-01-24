import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import axios from 'axios'

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 10000
})

apiClient.interceptors.request.use(
	config => {
		const token = useAuthStore.getState().accessToken
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

apiClient.interceptors.response.use(
	response => response,
	error => {
		if (error.response?.status === 401) {
			useAuthStore.getState().logout()
			window.location.href = '/login'
		}
		return Promise.reject(error)
	}
)
