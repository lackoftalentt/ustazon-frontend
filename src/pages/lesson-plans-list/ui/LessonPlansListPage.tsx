import { useSubjectByCode } from '@/entities/subject/model/useSubjects'
import { useTranslation } from 'react-i18next'
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

export const LessonPlansListPage = () => {
	const { t } = useTranslation()

	const GRADES = Array.from({ length: 11 }, (_, i) => t('lessonPlans.gradeN', { n: i + 1 }))
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

	const selectedGrade = t('lessonPlans.gradeN', { n: grade })

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
				<SectionTitle title={`${subject?.name} - ${t('lessonPlans.gradeN', { n: grade })}`} />
				<p className={s.subtitle}>{t('lessonPlans.shortTermPlans')}</p>
				<div className={s.filters}>
					<QuarterTabs code={code} />
					<Dropdown
						items={GRADES}
						value={selectedGrade}
						placeholder={t('lessonPlans.grade')}
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
