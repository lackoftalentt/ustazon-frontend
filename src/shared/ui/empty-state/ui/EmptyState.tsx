import { Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import s from './EmptyState.module.scss'

interface EmptyStateProps {
	search: string
	handleClearSearch: () => void
}

export const EmptyState = ({ search, handleClearSearch }: EmptyStateProps) => {
	const { t } = useTranslation()

	return (
		<div className={s.emptyState}>
			<div className={s.emptyIcon}>
				<Search />
			</div>
			<h3 className={s.emptyTitle}>{t('emptyState.title')}</h3>
			<p className={s.emptyDescription}>
				{search ? (
					<>
						{t('emptyState.searchDescription', { search })}
					</>
				) : (
					t('emptyState.noCoursesYet')
				)}
			</p>
			{search && (
				<button
					className={s.clearSearchButton}
					onClick={handleClearSearch}
				>
					{t('emptyState.showAll')}
				</button>
			)}
		</div>
	)
}
