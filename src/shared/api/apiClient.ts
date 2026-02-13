import { useAuthStore } from '@/entities/user/model/store/useAuthStore'
import axios from 'axios'
import toast from 'react-hot-toast'

export const apiClient = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
	headers: {
		'Content-Type': 'application/json'
	},
	timeout: 10000
})

let refreshPromise: Promise<string> | null = null

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

		// Let subscription_required 403 pass through for component-level handling
		if (
			error.response?.status === 403 &&
			error.response?.data?.detail === 'subscription_required'
		) {
			return Promise.reject(error)
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			// Auth endpoints (login, register, check-iin, etc.) handle their own errors
			if (originalRequest.url?.includes('/auth/')) {
				return Promise.reject(error)
			}

			originalRequest._retry = true

			// Use shared promise to prevent concurrent refresh requests
			if (!refreshPromise) {
				refreshPromise = performTokenRefresh()
			}

			try {
				const newToken = await refreshPromise
				originalRequest.headers.Authorization = `Bearer ${newToken}`
				return apiClient(originalRequest)
			} catch (refreshError) {
				return Promise.reject(refreshError)
			}
		}

		return Promise.reject(error)
	}
)

async function performTokenRefresh(): Promise<string> {
	const refreshToken = useAuthStore.getState().refreshToken

	if (!refreshToken) {
		useAuthStore.getState().logout()
		toast.error('Сессия истекла. Войдіте заново.')
		window.location.href = '/login'
		return Promise.reject(new Error('No refresh token'))
	}

	try {
		const response = await axios.post(
			`${apiClient.defaults.baseURL}/auth/refresh`,
			{ refresh_token: refreshToken },
			{
				headers: { 'Content-Type': 'application/json' },
				timeout: 10000
			}
		)

		const { access_token, refresh_token } = response.data
		useAuthStore.getState().setTokens(access_token, refresh_token)

		return access_token
	} catch (refreshError) {
		useAuthStore.getState().logout()
		toast.error('Сессия истекла. Войдите заново.')
		window.location.href = '/login'
		throw refreshError
	} finally {
		refreshPromise = null
	}
}
