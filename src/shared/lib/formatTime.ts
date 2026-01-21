export const formatTime = (seconds: number): string => {
	const mins = Math.floor(seconds / 60)
	const secs = seconds % 60
	return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export const getTimeColor = (remainingTime: number): 'safe' | 'warning' | 'danger' => {
	if (remainingTime > 120) return 'safe'
	if (remainingTime > 60) return 'warning'
	return 'danger'
}
