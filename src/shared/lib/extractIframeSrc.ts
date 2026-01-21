export const extractIframeSrc = (html?: string | null) => {
	if (!html) return null
	const match = html.match(/src="([^"]+)"/)
	return match?.[1] ?? null
}
