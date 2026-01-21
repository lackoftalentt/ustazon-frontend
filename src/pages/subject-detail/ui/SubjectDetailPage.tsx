import { useCard } from '@/entities/card/model/useCards'
import { LoaderPage } from '@/pages/loader-page'
import { Container } from '@/shared/ui/container'
import { SectionTitle } from '@/shared/ui/section-title'
import { ContentViewer } from '@/widgets/content-viewer'
import { SubjectDetailSidebar } from '@/widgets/subject-detail-sidebar'
import { useParams } from 'react-router-dom'
import s from './SubjectDetailPage.module.scss'

export const SubjectDetailPage = () => {
	const { cardId } = useParams<{ cardId: string }>()
	const numericId = Number(cardId)
	const isValidId = Number.isFinite(numericId) && numericId > 0

	const {
		data: lesson,
		isLoading,
		isError,
		error
	} = useCard(numericId, isValidId)

	if (isLoading) {
		return <LoaderPage />
	}

	if (isError || !lesson) {
		return (
			<main className={s.page}>
				<Container className={s.layout}>
					<div className={s.errorState}>
						<h2>Ошибка загрузки</h2>
						<p>{error?.message || 'Не удалось загрузить урок'}</p>
					</div>
				</Container>
			</main>
		)
	}

	return (
		<main className={s.page}>
			<Container className={s.layout}>
				<section className={s.main}>
					<header className={s.header}>
						<div className={s.headerText}>
							<SectionTitle title={lesson?.name} />
							{lesson?.topic?.topic && (
								<p className={s.subtitle}>Тема: {lesson?.topic.topic}</p>
							)}
						</div>

						<div className={s.headerRightSpace} />
					</header>

					<ContentViewer lesson={lesson} />

					{/* <SubjectDetailComments lessonId={lesson.id} /> */}
				</section>

				<aside className={s.sidebar}>
					<SubjectDetailSidebar lesson={lesson} />
				</aside>
			</Container>
		</main>
	)
}

export default SubjectDetailPage
