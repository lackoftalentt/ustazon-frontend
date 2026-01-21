export const getDifficultyLabel = (difficulty: string): string => {
	switch (difficulty) {
		case 'easy':
			return 'Жеңіл'
		case 'medium':
			return 'Орташа'
		case 'hard':
			return 'Қиын'
		default:
			return difficulty
	}
}
