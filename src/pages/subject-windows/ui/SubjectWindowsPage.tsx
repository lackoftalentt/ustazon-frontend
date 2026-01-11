import { AlertTriangle, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

import {
	useSubjectByCode,
	useWindows
} from '@/entities/subject/model/useSubjects'
import { SubjectCard } from '@/entities/subject/ui'

import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SearchInput } from '@/shared/ui/search-input'
import { SectionTitle } from '@/shared/ui/section-title'

import { LoaderPage } from '@/pages/loader-page'
import { useParams } from 'react-router'
import s from './SubjectWindowsPage.module.scss'

const PAGE_SIZE = 12

export const SubjectWindowsPage = () => {
	const { subjectCode } = useParams<{ subjectCode: string }>()

	const { data: subject, isLoading: isLoadingSubject } = useSubjectByCode(
		subjectCode || '',
		!!subjectCode
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
					Курстарды жүктеу кезінде қате пайда болды. Өтінеміз, қайта байқап
					көріңіз.
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

				{isLoading && (
					<div className={s.loadingState}>
						<div className={s.spinnerContainer}>
							<div className={s.spinner}></div>
							<div className={s.spinnerRing}></div>
						</div>
						<p className={s.loadingText}>Курстар жүктелуде...</p>
						<p className={s.loadingSubtext}>Біраз уақыт күтіңіз</p>
					</div>
				)}

				{isError && (
					<div className={s.errorState}>
						<div className={s.errorIcon}>
							<AlertTriangle />
						</div>
						<h3 className={s.errorTitle}>Жүктеу сәтсіз аяқталды</h3>
						<p className={s.errorDescription}>
							Курстарды жүктеу кезінде қате пайда болды. Өтінеміз, қайта байқап
							көріңіз.
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
									{visibleWindows.map(w => (
										<SubjectCard
											key={w.id}
											id={w.id}
											title={w.name}
											path={`/subjects-materials/${subjectCode}?window=${w.id}`}
										/>
									))}
								</div>

								{hasMore && (
									<div className={s.loadMoreContainer}>
										<Button
											className={s.loadMoreButton}
											onClick={handleLoadMore}
										>
											Показать еще
										</Button>
									</div>
								)}
							</>
						) : (
							<div className={s.emptyState}>
								<div className={s.emptyIcon}>
									<Search />
								</div>
								<h3 className={s.emptyTitle}>Курстар табылмады</h3>
								<p className={s.emptyDescription}>
									{search ? (
										<>
											&quot;{search}&quot; сөзі бойынша сәйкес келетін курстар
											жоқ. Басқа сөздермен іздеп көріңіз немесе барлық курстарды
											көріңіз.
										</>
									) : (
										'Пока что окна недоступны'
									)}
								</p>
								{search && (
									<button
										className={s.clearSearchButton}
										onClick={handleClearSearch}
									>
										Барлық курстарды көрсету
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
