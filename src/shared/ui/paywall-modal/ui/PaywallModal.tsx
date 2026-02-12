import { useCallback, useEffect } from 'react'
import { Lock } from 'lucide-react'
import { Button } from '@/shared/ui/button'
import s from './PaywallModal.module.scss'

interface PaywallModalProps {
	open: boolean
	onClose: () => void
}

export const PaywallModal = ({ open, onClose }: PaywallModalProps) => {
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
				<div className={s.iconWrapper}>
					<Lock size={28} />
				</div>

				<h3 className={s.title}>Жазылым қажет</h3>
				<p className={s.message}>
					Бұл материалға қол жеткізу үшін жазылым қажет. Жазылым алу үшін
					әкімшіге хабарласыңыз.
				</p>

				<div className={s.actions}>
					<Button variant="primary" onClick={onClose}>
						Жабу
					</Button>
				</div>
			</div>
		</div>
	)
}
