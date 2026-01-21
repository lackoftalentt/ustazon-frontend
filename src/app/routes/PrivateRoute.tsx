import { useAuthStore } from '@/entities/user'
import { Navigate, useLocation } from 'react-router-dom'

interface PrivateRouteProps {
	children: React.ReactNode
}

export const PrivateRoute = ({ children }: PrivateRouteProps) => {
	const isAuthenticated = useAuthStore(state => state.isAuthenticated)
	const location = useLocation()

	if (!isAuthenticated()) {
		return (
			<Navigate
				to="/login"
				state={{ from: location }}
				replace
			/>
		)
	}

	return <>{children}</>
}
