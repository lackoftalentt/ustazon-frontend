import { Search } from 'lucide-react'
import s from './EmptyState.module.scss'

interface EmptyStateProps {
	search: string
	handleClearSearch: () => void
}

export const EmptyState = ({ search, handleClearSearch }: EmptyStateProps) => {
	return (
		<div className={s.emptyState}>
			<div className={s.emptyIcon}>
				<Search />
			</div>
			<h3 className={s.emptyTitle}>Курстар табылмады</h3>
			<p className={s.emptyDescription}>
				{search ? (
					<>
						&quot;{search}&quot; сөзі бойынша сәйкес келетін курстар жоқ. Басқа
						сөздермен іздеп көріңіз немесе барлық курстарды көріңіз.
					</>
				) : (
					'Әзірше ешбір курс қолжетімді емес'
				)}
			</p>
			{search && (
				<button
					className={s.clearSearchButton}
					onClick={handleClearSearch}
				>
					Барлық курстарды көрсету
				</button>
			)}
		</div>
	)
}
