import { AlertTriangle } from 'lucide-react'
import s from './ErrorState.module.scss'

interface ErrorStateProps {
	handleRetry: () => void
}

export const ErrorState = ({ handleRetry }: ErrorStateProps) => {
	return (
		<div className={s.errorState}>
			<div className={s.errorIcon}>
				<AlertTriangle />
			</div>
			<h3 className={s.errorTitle}>Жүктеу сәтсіз аяқталды</h3>
			<p className={s.errorDescription}>
				Курстарды жүктеу кезінде қате пайда болды. Өтінеміз, қайта байқап
				көріңіз.
			</p>
			<button
				className={s.retryButton}
				onClick={handleRetry}
			>
				Қайта жүктеу
			</button>
		</div>
	)
}
