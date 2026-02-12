import { AlertTriangle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import s from './ErrorState.module.scss'

interface ErrorStateProps {
	handleRetry: () => void
}

export const ErrorState = ({ handleRetry }: ErrorStateProps) => {
	const { t } = useTranslation()

	return (
		<div className={s.errorState}>
			<div className={s.errorIcon}>
				<AlertTriangle />
			</div>
			<h3 className={s.errorTitle}>{t('errorState.title')}</h3>
			<p className={s.errorDescription}>
				{t('errorState.description')}
			</p>
			<button
				className={s.retryButton}
				onClick={handleRetry}
			>
				{t('errorState.retry')}
			</button>
		</div>
	)
}
