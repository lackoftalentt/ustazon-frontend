const MEDIA_PREFIXES = [
	'cards/',
	'files/',
	'prezas/',
	'images/',
	'image/',
	'avatars/',
	'videos/',
	'subject/',
	'window/',
	'texts/',
	'topic_tasks/',
	'question_photos/',
	'olimp_problems/',
]

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

	// Legacy paths from old Django system are stored without /media/ prefix
	// but served via nginx at /media/
	if (MEDIA_PREFIXES.some((p) => cleanPath.startsWith(p))) {
		return `${backendUrl}/media/${cleanPath}`
	}

	// Return absolute URL using backend base
	return `${backendUrl}/${cleanPath}`
}
