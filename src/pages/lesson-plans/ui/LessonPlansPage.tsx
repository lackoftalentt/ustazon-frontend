import { useKmzhList } from '@/entities/kmzh'
import { useSubjectByCode } from '@/entities/subject/model/useSubjects'
import { Container } from '@/shared/ui/container'
import { Dropdown } from '@/shared/ui/dropdown'
import { EmptyState } from '@/shared/ui/empty-state'
import { Loader } from '@/shared/ui/loader'
import { PlanCard } from '@/shared/ui/plan-card/ui/PlanCard'
import { SectionTitle } from '@/shared/ui/section-title'
import { StatCounter } from '@/shared/ui/stat-counter'
import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import s from './LessonPlansPage.module.scss'

export const LessonPlansPage = () => {
	const { code, quarter } = useParams<{ code?: string; quarter?: string }>()
	const navigate = useNavigate()

	const quarters = ['1 тоқсан', '2 тоқсан', '3 тоқсан', '4 тоқсан']
	const classes = [
		'Барлық сыныптар',
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

	const quarterNumFromUrl =
		quarter && /^q\d+$/.test(quarter)
			? parseInt(quarter.replace('q', ''), 10)
			: undefined

	const quarterIndex =
		quarterNumFromUrl && quarterNumFromUrl >= 1 && quarterNumFromUrl <= 4
			? quarterNumFromUrl - 1
			: undefined

	const selectedQuarter =
		quarterIndex !== undefined ? quarters[quarterIndex] : undefined

	const handleQuarterChange = (value: string | undefined) => {
		const quarterNum = value ? parseInt(value.replace(/\D/g, ''), 10) : 1
		navigate(`/lesson-plans/${code}/q${quarterNum}`, { replace: true })
	}

	const [selectedClass, setSelectedClass] = useState<string>()

	const gradeNum =
		selectedClass && selectedClass !== 'Барлық сыныптар'
			? parseInt(selectedClass.replace(/\D/g, ''), 10)
			: undefined

	const quarterNum = quarterNumFromUrl
	const allGrades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

	const { data: kmzhData, isLoading } = useKmzhList({
		grade: gradeNum,
		quarter: quarterNum,
		code: code
	})

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

		const gradesToShow = gradeNum ? [gradeNum] : allGrades

		return gradesToShow.map(grade => ({
			grade,
			count: grouped[grade]?.count || 0,
			hours: grouped[grade]?.hours || 0
		}))
	}, [kmzhData, gradeNum])

	const totalKmzh = kmzhData?.length || 0
	const totalGrades = plansByGrade.filter(p => p.count > 0).length
	const totalFiles =
		kmzhData?.reduce((sum, item) => sum + item.files_count, 0) || 0

	const noResults = !isLoading && (!kmzhData || kmzhData.length === 0)

	return (
		<main className={s.kmzhPage}>
			<Container className={s.container}>
				<header className={s.header}>
					<SectionTitle title={`${subject?.name}`} />
					<p className={s.subtitle}>Қысқа мерзімді жоспарлар (ҚМЖ)</p>

					<div className={s.filters}>
						<Dropdown
							items={quarters}
							value={selectedQuarter}
							placeholder="Тоқсан"
							onChange={handleQuarterChange}
						/>

						<Dropdown
							items={classes}
							value={selectedClass}
							placeholder="Сынып"
							onChange={setSelectedClass}
						/>
					</div>
				</header>

				{!noResults && (
					<section className={s.stats}>
						<StatCounter
							value={totalKmzh}
							label="Жалпы ҚМЖ"
						/>
						<StatCounter
							value={totalGrades}
							label="Сыныптар"
						/>
						<StatCounter
							value={totalFiles}
							label="Файлдар"
						/>
					</section>
				)}

				{isLoading ? (
					<Loader />
				) : noResults ? (
					<EmptyState
						search={selectedClass || ''}
						handleClearSearch={() => setSelectedClass(undefined)}
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
										hours={p.hours}
										kmzhCount={String(p.count)}
										lessonsCount={p.hours}
										onDetails={() =>
											navigate(
												`/lesson-plans-list/${p.grade}/q${quarterNum ?? 1}?code=${code}`
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
