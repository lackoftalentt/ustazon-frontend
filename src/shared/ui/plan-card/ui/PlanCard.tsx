import { ChevronRight } from 'lucide-react'
import clsx from 'clsx'
import s from './PlanCard.module.scss'

type Props = {
	title: string
	kmzhCount?: number | string
	lessonsCount?: number | string
	className?: string
	onDetails?: () => void
}

export const PlanCard = ({
	title,
	className,
	onDetails
}: Props) => {
	return (
		<article className={clsx(s.card, className)} onClick={onDetails}>
			<h3 className={s.title}>{title}</h3>
			<ChevronRight className={s.arrow} />
		</article>
	)
}
