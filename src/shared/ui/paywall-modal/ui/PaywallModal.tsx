import { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Lock, X } from 'lucide-react'
import s from './PaywallModal.module.scss'

// const WHATSAPP_URL =
// 	'https://api.whatsapp.com/send/?phone=77066652841&text&type=phone_number&app_absent=0'

interface PaywallModalProps {
	open: boolean
	onClose: () => void
}

export const PaywallModal = ({ open, onClose }: PaywallModalProps) => {
	const { t } = useTranslation()

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				onClose()
			}
		},
		[onClose]
	)

	useEffect(() => {
		if (open) {
			document.addEventListener('keydown', handleKeyDown)
			document.body.style.overflow = 'hidden'
		}
		return () => {
			document.removeEventListener('keydown', handleKeyDown)
			document.body.style.overflow = ''
		}
	}, [open, handleKeyDown])

	const handleBackdropClick = (e: React.MouseEvent) => {
		if (e.target === e.currentTarget) {
			onClose()
		}
	}

	if (!open) return null

	return (
		<div className={s.overlay} onClick={handleBackdropClick}>
			<div className={s.modal}>
				<button className={s.close} onClick={onClose} aria-label={t('paywall.close')}>
					<X size={20} />
				</button>
				<div className={s.iconWrapper}>
					<Lock size={28} />
				</div>
				<h3 className={s.title}>{t('paywall.title')}</h3>
				<p className={s.message}>{t('paywall.message')}</p>
				{/* <a
					href={WHATSAPP_URL}
					target="_blank"
					rel="noopener noreferrer"
					className={s.buyButton}
				>
					{t('paywall.buyButton')}
				</a> */}
			</div>
		</div>
	)
}
