import { useSubjects } from '@/entities/subject/model/useSubjects'
import { Container } from '@/shared/ui/container'
import { Loader } from '@/shared/ui/loader'
import { SectionTitle } from '@/shared/ui/section-title'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import s from './KmzhMainPage.module.scss'

export const KmzhMainPage = () => {
	const navigate = useNavigate()
	const { data: subjects = [], isLoading } = useSubjects({ limit: 100 })

	return (
		<main className={s.page}>
			<Container className={s.container}>
				<header className={s.header}>
					<SectionTitle title="ҚМЖ" />
					<p className={s.subtitle}>Қысқа мерзімді жоспарлар — пәндер бойынша</p>
				</header>

				{isLoading ? (
					<Loader />
				) : (
					<div className={s.list}>
						{subjects.map(subj => (
							<div
								key={subj.id}
								className={s.card}
								onClick={() => navigate(`/lesson-plans/${subj.code}`)}
							>
								<span className={s.name}>{subj.name}</span>
								<ChevronRight className={s.arrow} />
							</div>
						))}
					</div>
				)}
			</Container>
		</main>
	)
}

export default KmzhMainPage
