export const isGeoGebra = (url: string) => {
	return url.includes('geogebra.org')
}

export const normalizeGeoGebra = (url: string) => {
	if (!url.includes('embed')) {
		return url + (url.includes('?') ? '&' : '?') + 'embed'
	}
	return url
}
