import { useKmzhList } from '@/entities/kmzh'
import { useSubjectByCode } from '@/entities/subject/model/useSubjects'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/shared/ui/empty-state'
import { Loader } from '@/shared/ui/loader'
import { PlanCard } from '@/shared/ui/plan-card/ui/PlanCard'
import { SectionTitle } from '@/shared/ui/section-title'
import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import s from './LessonPlansPage.module.scss'

const allGrades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

export const LessonPlansPage = () => {
	const { code } = useParams<{ code?: string }>()
	const navigate = useNavigate()

	const { data: kmzhData, isLoading } = useKmzhList({ code })

	if (!code) return null

	const { data: subject } = useSubjectByCode(code)

	const plansByGrade = useMemo(() => {
		const grouped = (kmzhData || []).reduce(
			(acc, item) => {
				const key = item.grade
				if (!acc[key]) {
					acc[key] = { grade: key, count: 0, hours: 0 }
				}
				acc[key].count++
				acc[key].hours += item.hour
				return acc
			},
			{} as Record<number, { grade: number; count: number; hours: number }>
		)

		return allGrades.map(grade => ({
			grade,
			count: grouped[grade]?.count || 0,
			hours: grouped[grade]?.hours || 0
		}))
	}, [kmzhData])

	const noResults = !isLoading && (!kmzhData || kmzhData.length === 0)

	return (
		<main className={s.kmzhPage}>
			<Container className={s.container}>
				<header className={s.header}>
					<SectionTitle title={`${subject?.name}`} />
					<p className={s.subtitle}>Қысқа мерзімді жоспарлар (ҚМЖ)</p>
				</header>

				{isLoading ? (
					<Loader />
				) : noResults ? (
					<EmptyState
						search=""
						handleClearSearch={() => {}}
					/>
				) : (
					<section className={s.section}>
						<SectionTitle title="ҚМЖ сыныптар бойынша" />

						<div className={s.cards}>
							{plansByGrade
								.filter(p => p.count > 0)
								.map(p => (
									<PlanCard
										key={p.grade}
										title={`${p.grade} сынып`}
										onDetails={() =>
											navigate(
												`/lesson-plans-list/${p.grade}/q1?code=${code}`
											)
										}
									/>
								))}
						</div>
					</section>
				)}
			</Container>
		</main>
	)
}

export default LessonPlansPage
