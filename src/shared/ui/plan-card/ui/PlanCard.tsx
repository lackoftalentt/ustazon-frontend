import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react'
import CalendarIcon from '@/shared/assets/icons/calendar.svg?react'
import NoteIcon from '@/shared/assets/icons/note.svg?react'
import clsx from 'clsx'
import s from './PlanCard.module.scss'

type Props = {
	title: string
	kmzhCount: number | string
	lessonsCount: number | string
	hours: number
	className?: string
	onDetails?: () => void
}

export const PlanCard = ({
	title,
	kmzhCount,
	lessonsCount,
	hours,
	className,
	onDetails
}: Props) => {
	return (
		<article className={clsx(s.card, className)}>
			<div className={s.header}>
				<h3 className={s.title}>{title}</h3>
			</div>

			<div className={s.meta}>
				<div className={s.metaItem}>
					<div className={s.iconWrapper}>
						<NoteIcon
							className={s.metaIcon}
							aria-hidden="true"
						/>
					</div>
					<div className={s.metaContent}>
						<span className={s.metaLabel}>КМЖ</span>
						<span className={s.metaValue}>{kmzhCount}</span>
					</div>
				</div>

				<div className={s.metaItem}>
					<div className={s.iconWrapper}>
						<CalendarIcon
							className={s.metaIcon}
							aria-hidden="true"
						/>
					</div>
					<div className={s.metaContent}>
						<span className={s.metaLabel}>Сабақтар</span>
						<span className={s.metaValue}>{lessonsCount}</span>
					</div>
				</div>
			</div>

			<button
				type="button"
				className={s.button}
				onClick={onDetails}
			>
				Подробнее
				<ArrowIcon className={s.buttonIcon} />
			</button>
		</article>
	)
}
