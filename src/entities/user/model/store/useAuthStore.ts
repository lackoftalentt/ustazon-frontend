import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
	accessToken: string | null
	refreshToken: string | null
	user: {
		id: number
		iin: string
		name: string
		phoneNumber: string
		is_admin?: boolean
		is_superuser?: boolean
	} | null
	setTokens: (accessToken: string, refreshToken: string) => void
	setUser: (user: AuthState['user']) => void
	logout: () => void
	isAuthenticated: () => boolean
	isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => ({
			accessToken: null,
			refreshToken: null,
			user: null,

			setTokens: (accessToken, refreshToken) => {
				set({ accessToken, refreshToken })
			},

			setUser: user => {
				set({ user })
			},

			logout: () => {
				set({ accessToken: null, refreshToken: null, user: null })
			},

			isAuthenticated: () => {
				return !!get().accessToken
			},

			isAdmin: () => {
				const user = get().user
				return !!(user?.is_admin || user?.is_superuser)
			}
		}),
		{
			name: 'auth-storage'
		}
	)
)
