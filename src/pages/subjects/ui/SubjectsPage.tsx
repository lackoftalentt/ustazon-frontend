import { useMemo, useState } from 'react'

import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SearchInput } from '@/shared/ui/search-input'
import { SectionTitle } from '@/shared/ui/section-title'

import { SubjectCard } from '@/entities/subject'
import { useSubjects } from '@/entities/subject/model/useSubjects'

import { EmptyState } from '@/shared/ui/empty-state/ui/EmptyState'
import { ErrorState } from '@/shared/ui/error-state/ui/ErrorState'
import { Loader } from '@/shared/ui/loader'
import s from './SubjectsPage.module.scss'

const PAGE_SIZE = 9

export const SubjectsPage = () => {
	const [search, setSearch] = useState('')
	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
	const [activeFilter, setActiveFilter] = useState<string | null>(null)
	const { data: subjects = [], isLoading, isError, refetch } = useSubjects()

	const filteredSubjects = useMemo(() => {
		let filtered = subjects.filter(subject =>
			subject.name.toLowerCase().includes(search.toLowerCase())
		)

		return filtered
	}, [subjects, search, activeFilter])

	const visibleSubjects = filteredSubjects.slice(0, visibleCount)
	const hasMore = visibleCount < filteredSubjects.length

	const handleLoadMore = () => {
		setVisibleCount(prev => prev + PAGE_SIZE)
	}

	const handleSearch = (value: string) => {
		setSearch(value)
		setVisibleCount(PAGE_SIZE)
	}

	const handleRetry = () => {
		refetch()
	}

	const handleClearSearch = () => {
		setSearch('')
		setActiveFilter(null)
		setVisibleCount(PAGE_SIZE)
	}

	return (
		<main className={s.subjectMaterialPage}>
			<Container className={s.container}>
				<div className={s.header}>
					<SectionTitle
						className={s.title}
						title="Пәндер каталогы"
					/>

					<div className={s.searchContainer}>
						<SearchInput
							className={s.searchInput}
							placeholder="Курс атауы бойынша іздеу..."
							value={search}
							onChange={e => handleSearch(e.target.value)}
							onSubmit={() => {}}
						/>
					</div>

					{/* <div className={s.filters}>
                        <button
                            className={`${s.filterChip} ${
                                !activeFilter ? s.active : ''
                            }`}
                            onClick={() => setActiveFilter(null)}>
                            Все курсы
                        </button>
                        <button
                            className={`${s.filterChip} ${
                                activeFilter === 'school' ? s.active : ''
                            }`}
                            onClick={() => setActiveFilter('school')}>
                            Для школы
                        </button>
                        <button
                            className={`${s.filterChip} ${
                                activeFilter === 'university' ? s.active : ''
                            }`}
                            onClick={() => setActiveFilter('university')}>
                            Для университета
                        </button>
                        <button
                            className={`${s.filterChip} ${
                                activeFilter === 'programming' ? s.active : ''
                            }`}
                            onClick={() => setActiveFilter('programming')}>
                            Программирование
                        </button>
                    </div> */}
				</div>

				{isLoading && <Loader />}

				{isError && <ErrorState handleRetry={handleRetry} />}

				{!isLoading && !isError && (
					<>
						{visibleSubjects.length > 0 ? (
							<>
								<div className={s.cardsContainer}>
									{visibleSubjects.map(subject => (
										<SubjectCard
											key={subject.id}
											id={subject.id}
											title={subject.name}
											thumbnail={subject.image_url ?? undefined}
											path={`/subjects-materials/${subject.code || subject.id}`}
										/>
									))}
								</div>

								{hasMore && (
									<div className={s.loadMoreContainer}>
										<Button
											className={s.loadMoreButton}
											onClick={handleLoadMore}
										>
											Көбірек көрсету
										</Button>
									</div>
								)}
							</>
						) : (
							<EmptyState
								search={search}
								handleClearSearch={handleClearSearch}
							/>
						)}
					</>
				)}
			</Container>
		</main>
	)
}

export default SubjectsPage
