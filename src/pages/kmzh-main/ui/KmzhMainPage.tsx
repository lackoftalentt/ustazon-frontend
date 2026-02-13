import { useSubjects } from '@/entities/subject/model/useSubjects'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/shared/ui/empty-state'
import { Loader } from '@/shared/ui/loader'
import { SectionTitle } from '@/shared/ui/section-title'
import { ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import s from './KmzhMainPage.module.scss'

export const KmzhMainPage = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { data: subjects = [], isLoading } = useSubjects({ limit: 100 })

	return (
		<main className={s.page}>
			<Container className={s.container}>
				<header className={s.header}>
					<SectionTitle title={t('kmzhMain.title')} />
					<p className={s.subtitle}>{t('kmzhMain.subtitle')}</p>
				</header>

				{isLoading ? (
					<Loader />
				) : subjects.length === 0 ? (
					<EmptyState
						search=""
						handleClearSearch={() => {}}
					/>
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
