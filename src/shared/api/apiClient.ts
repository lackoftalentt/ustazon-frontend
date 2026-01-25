import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import axios from 'axios'

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 10000
})

let isRefreshing = false
let failedQueue: Array<{
	resolve: (value?: any) => void
	reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
	failedQueue.forEach(prom => {
		if (error) {
			prom.reject(error)
		} else {
			prom.resolve(token)
		}
	})
	failedQueue = []
}

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
	async error => {
		const originalRequest = error.config

		if (error.response?.status === 401 && !originalRequest._retry) {
			if (originalRequest.url?.includes('/auth/refresh')) {
				useAuthStore.getState().logout()
				window.location.href = '/login'
				return Promise.reject(error)
			}

			if (isRefreshing) {
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject })
				})
					.then(token => {
						originalRequest.headers.Authorization = `Bearer ${token}`
						return apiClient(originalRequest)
					})
					.catch(err => {
						return Promise.reject(err)
					})
			}

			originalRequest._retry = true
			isRefreshing = true

			const refreshToken = useAuthStore.getState().refreshToken

			if (!refreshToken) {
				useAuthStore.getState().logout()
				window.location.href = '/login'
				return Promise.reject(error)
			}

			try {
				const response = await axios.post(
					`${apiClient.defaults.baseURL}/auth/refresh`,
					{ refresh_token: refreshToken },
					{
						headers: { 'Content-Type': 'application/json' }
					}
				)

				const { access_token, refresh_token } = response.data

				useAuthStore.getState().setTokens(access_token, refresh_token)

				originalRequest.headers.Authorization = `Bearer ${access_token}`
				processQueue(null, access_token)

				return apiClient(originalRequest)
			} catch (refreshError) {
				processQueue(refreshError, null)
				useAuthStore.getState().logout()
				window.location.href = '/login'
				return Promise.reject(refreshError)
			} finally {
				isRefreshing = false
			}
		}

		return Promise.reject(error)
	}
)
