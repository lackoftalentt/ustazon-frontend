import { useSubjectByCode } from '@/entities/subject/model/useSubjects'
import { TestItem, useInfiniteTests, type TestDifficulty } from '@/entities/test'
import { CreateTestModal, useCreateTestStore } from '@/features/create-test'
import { EditTestModal } from '@/features/edit-test'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { EmptyState } from '@/shared/ui/empty-state'
import { Loader } from '@/shared/ui/loader'
import { SearchInput } from '@/shared/ui/search-input'
import { Dropdown } from '@/shared/ui/dropdown'
import { SectionTitle } from '@/shared/ui/section-title'
import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import s from './TestsPage.module.scss'

const PAGE_SIZE = 12

export const TestsPage = () => {
	const { t } = useTranslation()
	const [searchParams] = useSearchParams()
	const code = searchParams.get('code') || undefined
	const [searchQuery, setSearchQuery] = useState('')
	const [difficulty, setDifficulty] = useState<TestDifficulty | undefined>()

	const { openModal: openCreateTestModal } = useCreateTestStore()

	const difficultyLabels = [
		t('tests.all'),
		t('tests.easy'),
		t('tests.medium'),
		t('tests.hard')
	]

	const difficultyMap: Record<string, TestDifficulty | undefined> = {
		[t('tests.all')]: undefined,
		[t('tests.easy')]: 'easy',
		[t('tests.medium')]: 'medium',
		[t('tests.hard')]: 'hard'
	}

	const reverseMap: Record<string, string> = {
		easy: t('tests.easy'),
		medium: t('tests.medium'),
		hard: t('tests.hard')
	}

	const { data: subject } = useSubjectByCode(code || '', {
		enabled: !!code
	})
	const subjectName = subject?.name || undefined

	const {
		data: testsData,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useInfiniteTests(
		{ subject: subjectName, difficulty },
		PAGE_SIZE
	)

	const tests = useMemo(() => testsData?.pages.flat() || [], [testsData])

	const filteredTests = useMemo(() => {
		if (!tests) return []
		if (!searchQuery) return tests

		const query = searchQuery.toLowerCase()
		return tests.filter(
			test =>
				test.title.toLowerCase().includes(query) ||
				test.subject.toLowerCase().includes(query)
		)
	}, [tests, searchQuery])

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}

	return (
		<main className={s.testPage}>
			<Container>
				<header className={s.header}>
					<SectionTitle title={t('tests.listTitle')} />
					<p className={s.subtitle}>
						{subject?.name || t('tests.allSubjects')}
					</p>
				</header>

				<div className={s.controls}>
					<SearchInput
						placeholder={t('tests.searchPlaceholder')}
						value={searchQuery}
						onChange={e => setSearchQuery(e.target.value)}
						className={s.searchInput}
					/>

					<Dropdown
						items={difficultyLabels}
						value={difficulty ? reverseMap[difficulty] : undefined}
						placeholder={t('tests.allLevels')}
						onChange={label => setDifficulty(difficultyMap[label])}
					/>

					<Button
						className={s.btnNewTest}
						onClick={openCreateTestModal}
					>
						<Plus size={20} />
						<span>{t('tests.createTest')}</span>
					</Button>
				</div>

				{isLoading ? (
					<Loader />
				) : filteredTests.length > 0 ? (
					<>
						<div className={s.testList}>
							{filteredTests.map(test => (
								<TestItem
									key={test.id}
									id={String(test.id)}
									title={test.title}
									description={test.subject}
									questionsCount={test.questions_count}
									timeLimit={test.duration}
									difficulty={test.difficulty}
									category={test.subject}
								/>
							))}
						</div>
						{hasNextPage && !searchQuery && (
							<div className={s.loadMoreContainer}>
								<Button
									className={s.loadMoreButton}
									onClick={handleLoadMore}
									disabled={isFetchingNextPage}
								>
									{isFetchingNextPage ? t('tests.loading') : t('tests.showMore')}
								</Button>
							</div>
						)}
					</>
				) : (
					<EmptyState
						search={searchQuery}
						handleClearSearch={() => setSearchQuery('')}
					/>
				)}
			</Container>

			<CreateTestModal />
			<EditTestModal />
		</main>
	)
}

export default TestsPage
