import Arrow from '@/shared/assets/icons/arrowLeft.svg?react'
import { PaywallModal } from '@/shared/ui/paywall-modal'
import { Button } from '@/shared/ui/button'
import { Lock } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import s from './KmzhCard.module.scss'

interface KmzhCardProps {
	id: number
	title: string
	grade: number
	quarter: number
	hour: number
	code: string
	filesCount: number
	path?: string
	isLocked?: boolean
}

export const KmzhCard = ({
	id,
	title,
	grade,
	quarter,
	hour,
	code,
	filesCount,
	path,
	isLocked = false
}: KmzhCardProps) => {
	const linkPath = path || `/kmzh/detail/${id}`
	const [paywallOpen, setPaywallOpen] = useState(false)

	const handleLockedClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setPaywallOpen(true)
	}

	return (
		<article className={`${s.card} ${isLocked ? s.cardLocked : ''}`}>
			<div className={s.header}>
				<span className={s.grade}>{grade}-сынып</span>
				<span className={s.quarter}>{quarter}-тоқсан</span>
				{isLocked && <Lock size={16} className={s.lockIcon} />}
			</div>
			<div className={s.container}>
				<h3 className={s.title}>{title}</h3>
				<div className={s.meta}>
					<span className={s.metaItem}>Код: {code}</span>
					<span className={s.metaItem}>{hour} сағат</span>
					<span className={s.metaItem}>{filesCount} файл</span>
				</div>
				{isLocked ? (
					<Button className={s.button} onClick={handleLockedClick}>
						<Lock size={18} />
						Жазылым қажет
					</Button>
				) : (
					<Link to={linkPath} className={s.link}>
						<Button className={s.button}>
							Қарау
							<Arrow className={s.arrowIcon} />
						</Button>
					</Link>
				)}
			</div>
			<PaywallModal open={paywallOpen} onClose={() => setPaywallOpen(false)} />
		</article>
	)
}
