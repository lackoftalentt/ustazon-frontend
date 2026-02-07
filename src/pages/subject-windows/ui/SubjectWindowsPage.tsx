import { AlertTriangle, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import { SubjectCard } from '@/entities/subject'
import {
	useSubjectByCode,
	useWindows
} from '@/entities/subject/model/useSubjects'

import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SearchInput } from '@/shared/ui/search-input'
import { SectionTitle } from '@/shared/ui/section-title'

import { LoaderPage } from '@/pages/loader-page'
import { Loader } from '@/shared/ui/loader'
import { useParams } from 'react-router'
import s from './SubjectWindowsPage.module.scss'

const PAGE_SIZE = 12

export const SubjectWindowsPage = () => {
	const { subjectCode } = useParams<{ subjectCode: string }>()

	const { data: subject, isLoading: isLoadingSubject } = useSubjectByCode(
		subjectCode || '',
		{ enabled: !!subjectCode }
	)

	const { data: windows = [], isLoading, isError, refetch } = useWindows()

	const [search, setSearch] = useState('')
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
	const [activeFilter, setActiveFilter] = useState<string | null>(null)

	const filteredWindows = useMemo(() => {
		let filtered = windows

		if (search.trim()) {
			filtered = filtered.filter(w =>
				w.name.toLowerCase().includes(search.toLowerCase())
			)
		}

		return filtered
	}, [windows, search, activeFilter])

	const visibleWindows = filteredWindows.slice(0, visibleCount)
	const hasMore = visibleCount < filteredWindows.length

	const handleLoadMore = () => setVisibleCount(prev => prev + PAGE_SIZE)

	const handleSearch = (value: string) => {
		setSearch(value)
		setVisibleCount(PAGE_SIZE)
	}

	const handleRetry = () => refetch()

	const handleClearSearch = () => {
		setSearch('')
		setActiveFilter(null)
		setVisibleCount(PAGE_SIZE)
	}

	if (isLoadingSubject) {
		return <LoaderPage />
	}

	if (!subject) {
		return (
			<div className={s.errorState}>
				<div className={s.errorIcon}>
					<AlertTriangle />
				</div>
				<h3 className={s.errorTitle}>Жүктеу сәтсіз аяқталды</h3>
				<p className={s.errorDescription}>
					Терезелерді жүктеу кезінде қате пайда болды. Қайта байқап көріңіз.
				</p>
				<button
					className={s.retryButton}
					onClick={handleRetry}
				>
					Қайта жүктеу
				</button>
			</div>
		)
	}

	return (
		<main className={s.subjectWindowsPage}>
			<Container className={s.container}>
				<SectionTitle
					className={s.title}
					title={subject.name}
				/>

				<div className={s.searchContainer}>
					<SearchInput
						className={s.searchInput}
						placeholder="Терезелер бойынша іздеу..."
						value={search}
						onChange={e => handleSearch(e.target.value)}
						onSubmit={() => {}}
					/>
				</div>

				{isLoading && <Loader />}

				{isError && (
					<div className={s.errorState}>
						<div className={s.errorIcon}>
							<AlertTriangle />
						</div>
						<h3 className={s.errorTitle}>Жүктеу сәтсіз аяқталды</h3>
						<p className={s.errorDescription}>
							Терезелерді жүктеу кезінде қате пайда болды. Қайта байқап көріңіз.
						</p>
						<button
							className={s.retryButton}
							onClick={handleRetry}
						>
							Қайта жүктеу
						</button>
					</div>
				)}

				{!isLoading && !isError && (
					<>
						{visibleWindows.length > 0 ? (
							<>
								<div className={s.windowsList}>
									{visibleWindows.map(w => {
										let path = `/subjects-materials/${subjectCode}?window=${w.id}`
										if (w.id === 19) {
											path = `/lesson-plans/${subjectCode}`
										} else if (w.id === 18) {
											path = `/tests?code=${subjectCode}`
										}

										return (
											<SubjectCard
												key={w.id}
												id={w.id}
												title={w.name}
												thumbnail={w.image_file || w.image_url}
												path={path}
											/>
										)
									})}
								</div>

								{hasMore && (
									<div className={s.loadMoreContainer}>
										<Button
											className={s.loadMoreButton}
											onClick={handleLoadMore}
										>
											Тағы көрсету
										</Button>
									</div>
								)}
							</>
						) : (
							<div className={s.emptyState}>
								<div className={s.emptyIcon}>
									<Search />
								</div>
								<h3 className={s.emptyTitle}>Терезелер табылмады</h3>
								<p className={s.emptyDescription}>
									{search ? (
										<>
											&quot;{search}&quot; бойынша сәйкес келетін терезелер жоқ.
											Басқа сөзбен іздеп көріңіз.
										</>
									) : (
										'Пока терезелер жоқ'
									)}
								</p>
								{search && (
									<button
										className={s.clearSearchButton}
										onClick={handleClearSearch}
									>
										Барлығын көрсету
									</button>
								)}
							</div>
						)}
					</>
				)}
			</Container>
		</main>
	)
}

export default SubjectWindowsPage
