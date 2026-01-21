export const extractHref = (html: string) => {
	const match = html.match(/href=['"]([^'"]+)['"]/)
	return match?.[1] ?? null
}
