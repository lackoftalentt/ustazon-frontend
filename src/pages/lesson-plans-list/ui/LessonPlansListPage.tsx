import { useSubjectByCode } from '@/entities/subject/model/useSubjects'
import s from './LessonPlansListPage.module.scss'

import { Container } from '@/shared/ui/container'
import { Dropdown } from '@/shared/ui/dropdown'
import { SectionTitle } from '@/shared/ui/section-title'
import { LessonPlanTable } from '@/widgets/lesson-plan-table'
import { QuarterTabs } from '@/widgets/quarter-tabs'
import { useCallback, useEffect } from 'react'
import {
	Navigate,
	useNavigate,
	useParams,
	useSearchParams
} from 'react-router-dom'

const quarters = ['q1', 'q2', 'q3', 'q4'] as const
type QuarterId = (typeof quarters)[number]

const GRADES = [
	'1 сынып',
	'2 сынып',
	'3 сынып',
	'4 сынып',
	'5 сынып',
	'6 сынып',
	'7 сынып',
	'8 сынып',
	'9 сынып',
	'10 сынып',
	'11 сынып'
]

export const LessonPlansListPage = () => {
	const { quarter, grade } = useParams<{
		quarter: string
		grade: string
	}>()
	const [searchParams] = useSearchParams()
	const navigate = useNavigate()
	const code = searchParams.get('code') ?? undefined

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [grade, quarter, code])

	const { data: subject } = useSubjectByCode(code!, {
		enabled: !!code
	})

	const selectedGrade = `${grade} сынып`

	const handleGradeChange = useCallback(
		(value: string) => {
			const newGrade = value.replace(/\D/g, '')
			const codeParam = code ? `?code=${code}` : ''
			navigate(`/lesson-plans-list/${newGrade}/${quarter}${codeParam}`)
		},
		[navigate, quarter, code]
	)

	if (!grade || !quarter || !quarters.includes(quarter as QuarterId)) {
		return (
			<Navigate
				to="/lesson-plan/5/q1"
				replace
			/>
		)
	}

	return (
		<div>
			<Container className={s.container}>
				<SectionTitle title={`${subject?.name} - ${grade}-сынып`} />
				<p className={s.subtitle}>Қысқа мерзімді жоспарлар (ҚМЖ)</p>
				<div className={s.filters}>
					<QuarterTabs code={code} />
					<Dropdown
						items={GRADES}
						value={selectedGrade}
						placeholder="Сынып"
						onChange={handleGradeChange}
					/>
				</div>
				<LessonPlanTable
					grade={grade}
					quarter={quarter as QuarterId}
					code={code}
				/>
			</Container>
		</div>
	)
}

export default LessonPlansListPage
