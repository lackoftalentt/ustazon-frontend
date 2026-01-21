import s from '../SubjectsMaterialsPage.module.scss'

interface WindowFilterBadgeProps {
	windowName: string
	onReset: () => void
}

export const WindowFilterBadge = ({
	windowName,
	onReset
}: WindowFilterBadgeProps) => {
	return (
		<div className={s.windowFilter}>
			<div className={s.windowFilterTitle}>Бөлім: {windowName}</div>
			<button onClick={onReset} className={s.windowFilterReset}>
				Қалпына келтіру
				<span className={s.resetIcon}>✕</span>
			</button>
		</div>
	)
}
