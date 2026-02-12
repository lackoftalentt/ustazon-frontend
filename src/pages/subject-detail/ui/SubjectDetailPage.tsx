import { useCard } from '@/entities/card/model/useCards'
import { LoaderPage } from '@/pages/loader-page'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SectionTitle } from '@/shared/ui/section-title'
import { ContentViewer } from '@/widgets/content-viewer'
import { SubjectDetailSidebar } from '@/widgets/subject-detail-sidebar'
import { isAxiosError } from 'axios'
import { Lock } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import s from './SubjectDetailPage.module.scss'

export const SubjectDetailPage = () => {
	const { cardId } = useParams<{ cardId: string }>()
	const navigate = useNavigate()
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

	// Subscription required — show paywall
	const isSubscriptionRequired =
		isError &&
		isAxiosError(error) &&
		error.response?.status === 403 &&
		error.response?.data?.detail === 'subscription_required'

	if (isSubscriptionRequired) {
		return (
			<main className={s.page}>
				<Container className={s.layout}>
					<div className={s.paywallState}>
						<div className={s.paywallIcon}>
							<Lock size={48} />
						</div>
						<h2>Жазылым қажет</h2>
						<p>
							Бұл материалға қол жеткізу үшін жазылым қажет. Жазылым алу
							үшін әкімшіге хабарласыңыз.
						</p>
						<Button variant="primary" onClick={() => navigate(-1)}>
							Артқа қайту
						</Button>
					</div>
				</Container>
			</main>
		)
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
