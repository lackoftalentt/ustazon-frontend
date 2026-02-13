import Arrow from '@/shared/assets/icons/arrowLeft.svg?react'
import { Button } from '@/shared/ui/button'
import { Lock } from 'lucide-react'
import { useTranslation } from 'react-i18next'
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
	onLockedClick?: () => void
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
	isLocked = false,
	onLockedClick
}: KmzhCardProps) => {
	const { t } = useTranslation()
	const linkPath = path || `/kmzh/detail/${id}`

	const handleLockedClick = (e: React.MouseEvent) => {
		e.preventDefault()
		e.stopPropagation()
		onLockedClick?.()
	}

	return (
		<article className={`${s.card} ${isLocked ? s.cardLocked : ''}`}>
			<div className={s.header}>
				<span className={s.grade}>{t('kmzhCard.grade', { n: grade })}</span>
				<span className={s.quarter}>{t('kmzhCard.quarter', { n: quarter })}</span>
				{isLocked && <Lock size={16} className={s.lockIcon} />}
			</div>
			<div className={s.container}>
				<h3 className={s.title}>{title}</h3>
				<div className={s.meta}>
					<span className={s.metaItem}>{t('kmzhCard.code', { code })}</span>
					<span className={s.metaItem}>{t('kmzhCard.hours', { n: hour })}</span>
					<span className={s.metaItem}>{t('kmzhCard.files', { n: filesCount })}</span>
				</div>
				{isLocked ? (
					<Button className={s.button} onClick={handleLockedClick}>
						<Lock size={18} />
						{t('kmzhCard.accessRequired')}
					</Button>
				) : (
					<Link to={linkPath} className={s.link}>
						<Button className={s.button}>
							{t('kmzhCard.view')}
							<Arrow className={s.arrowIcon} />
						</Button>
					</Link>
				)}
			</div>
		</article>
	)
}
