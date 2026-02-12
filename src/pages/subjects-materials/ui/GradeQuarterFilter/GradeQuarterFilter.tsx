import clsx from 'clsx'
import s from './GradeQuarterFilter.module.scss'

interface GradeQuarterFilterProps {
	grade: number | null
	quarter: number | null
	onGradeChange: (grade: number | null) => void
	onQuarterChange: (quarter: number | null) => void
}

const GRADES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
const QUARTERS = [
	{ value: 1, label: '1-тоқсан' },
	{ value: 2, label: '2-тоқсан' },
	{ value: 3, label: '3-тоқсан' },
	{ value: 4, label: '4-тоқсан' }
]

export const GradeQuarterFilter = ({
	grade,
	quarter,
	onGradeChange,
	onQuarterChange
}: GradeQuarterFilterProps) => {
	return (
		<div className={s.wrapper}>
			<div className={s.label}>Сынып</div>
			<div className={s.row}>
				{GRADES.map(g => (
					<button
						key={g}
						type="button"
						className={clsx(s.pill, grade === g && s.pillActive)}
						onClick={() => onGradeChange(grade === g ? null : g)}
					>
						{g}
					</button>
				))}
			</div>

			<div className={s.label}>Тоқсан</div>
			<div className={s.row}>
				{QUARTERS.map(q => (
					<button
						key={q.value}
						type="button"
						className={clsx(s.pill, quarter === q.value && s.pillActive)}
						onClick={() => onQuarterChange(quarter === q.value ? null : q.value)}
					>
						{q.label}
					</button>
				))}
			</div>
		</div>
	)
}
