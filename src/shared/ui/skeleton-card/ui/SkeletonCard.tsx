import s from './SkeletonCard.module.scss'
import clsx from 'clsx'

interface SkeletonCardProps {
	className?: string
}

export const SkeletonCard = ({ className }: SkeletonCardProps) => {
	return (
		<div className={clsx(s.skeleton, className)}>
			<div className={s.thumbnail} />
			<div className={s.content}>
				<div className={clsx(s.line, s.lineTitle)} />
				<div className={clsx(s.line, s.lineDesc)} />
				<div className={clsx(s.line, s.lineShort)} />
			</div>
		</div>
	)
}
