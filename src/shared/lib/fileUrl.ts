export const getFileUrl = (path: string | null | undefined): string => {
	if (!path) return ''
	
	// If already an absolute URL (http:// or https://), return as is
	if (path.startsWith('http://') || path.startsWith('https://')) {
		return path
	}
	
	// Remove leading slash to avoid double slashes
	const cleanPath = path.replace(/^\//, '')
	
	// Get backend URL from environment variable or fallback to window origin
	const backendUrl = import.meta.env.VITE_BACKEND_URL || window.location.origin
	
	// Return absolute URL using backend base
	return `${backendUrl}/${cleanPath}`
}
