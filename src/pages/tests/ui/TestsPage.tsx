import { useSubjectByCode } from '@/entities/subject/model/useSubjects'
import { TestItem, useInfiniteTests, type TestDifficulty } from '@/entities/test'
import { CreateTestModal, useCreateTestStore } from '@/features/create-test'
import { EditTestModal, useEditTestStore, type TestData } from '@/features/edit-test'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { Dropdown } from '@/shared/ui/dropdown'
import { EmptyState } from '@/shared/ui/empty-state'
import { Loader } from '@/shared/ui/loader'
import { SearchInput } from '@/shared/ui/search-input'
import { SectionTitle } from '@/shared/ui/section-title'
import { BookOpen, Plus, TextSelectionIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import s from './TestsPage.module.scss'

const DIFFICULTY_MAP: Record<string, TestDifficulty | ''> = {
	Барлығы: '',
	Оңай: 'easy',
	Орташа: 'medium',
	Қиын: 'hard'
}

const DIFFICULTY_LABELS = ['Барлығы', 'Оңай', 'Орташа', 'Қиын']

const DIFFICULTY_REVERSE_MAP: Record<TestDifficulty | '', string> = {
	'': 'Барлығы',
	easy: 'Оңай',
	medium: 'Орташа',
	hard: 'Қиын'
}

const SUBJECT_LABELS = [
	'Барлығы',
	'Математика',
	'phys',
	'chem',
	'bastau',
	'math',
	'kaz',
	'bio',
	'қазақ тілі | әдебиеті',
	'Биология',
	'geo',
	'history',
	'rus',
	'lit',
	'eng'
]

const SUBJECT_MAP: Record<string, string> = {
	Барлығы: '',
	Математика: 'Математика',
	phys: 'phys',
	chem: 'chem',
	bastau: 'bastau',
	math: 'math',
	kaz: 'kaz',
	bio: 'bio',
	'қазақ тілі | әдебиеті': 'қазақ тілі | әдебиеті',
	Биология: 'Биология',
	geo: 'geo',
	history: 'history',
	rus: 'rus',
	lit: 'lit',
	eng: 'eng'
}

const PAGE_SIZE = 12

export const TestsPage = () => {
	const [searchParams, setSearchParams] = useSearchParams()
	const subjectFilter = searchParams.get('subject') || undefined
	const difficultyFilter =
		(searchParams.get('difficulty') as TestDifficulty) || undefined

	const [isMounted, setIsMounted] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')

	const { openModal: openCreateTestModal } = useCreateTestStore()
	const { openModal: openEditTestModal } = useEditTestStore()

	const {
		data: testsData,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage
	} = useInfiniteTests(
		{
			subject: subjectFilter,
			difficulty: difficultyFilter
		},
		PAGE_SIZE
	)

	const tests = useMemo(() => testsData?.pages.flat() || [], [testsData])

	const { data: subject } = useSubjectByCode(subjectFilter, {
		enabled: !!subjectFilter
	})

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const handleDifficultyChange = (label: string) => {
		const value = DIFFICULTY_MAP[label]
		if (value) {
			searchParams.set('difficulty', value)
		} else {
			searchParams.delete('difficulty')
		}
		setSearchParams(searchParams)
	}

	const handleSubjectChange = (label: string) => {
		const value = SUBJECT_MAP[label]
		if (value) {
			searchParams.set('subject', value)
		} else {
			searchParams.delete('subject')
		}
		setSearchParams(searchParams)
	}

	const handleLoadMore = () => {
		if (hasNextPage && !isFetchingNextPage) {
			fetchNextPage()
		}
	}

	const currentDifficultyLabel = DIFFICULTY_REVERSE_MAP[difficultyFilter || '']
	const currentSubjectLabel = subjectFilter || 'Барлығы'

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

	return (
		<main className={`${s.testPage} ${isMounted ? s.mounted : ''}`}>
			<Container>
				<div className={s.header}>
					<SectionTitle title="Тесттер тізімі" />
					<div className={s.subjectInfo}>
						<div className={s.subjectHeader}>
							<BookOpen
								className={s.subjectIcon}
								size={28}
							/>
							<h1 className={s.subjectName}>
								{subject?.name ||
									(subjectFilter ? subjectFilter : 'Барлық пәндер')}
							</h1>
						</div>
						<p className={s.subtitle}>
							Білімді тексеру және дайындық деңгейін бағалау үшін арналған
							интерактивті тестілер
						</p>
					</div>
				</div>

				<div className={s.controls}>
					<div className={s.controlsLeft}>
						<div className={s.testsCount}>
							<TextSelectionIcon size={20} />
							<span className={s.countNumber}>{tests?.length || 0}</span>
							<span className={s.countText}>тест табылды</span>
						</div>

						<div className={s.searchContainer}>
							<SearchInput
								placeholder="Тест іздеу..."
								value={searchQuery}
								onChange={e => setSearchQuery(e.target.value)}
								className={s.searchInput}
							/>
						</div>

						<Dropdown
							items={SUBJECT_LABELS}
							value={currentSubjectLabel === 'Барлығы' ? 'Барлық пәндер' : currentSubjectLabel}
							placeholder="Барлық пәндер"
							onChange={handleSubjectChange}
							className={s.dropdown}
						/>

						<Dropdown
							items={DIFFICULTY_LABELS}
							value={currentDifficultyLabel === 'Барлығы' ? 'Барлық деңгейлер' : currentDifficultyLabel}
							placeholder="Барлық деңгейлер"
							onChange={handleDifficultyChange}
							className={s.dropdown}
						/>
					</div>

					<div className={s.buttonContainer}>
						<Button
							className={s.btnNewTest}
							onClick={openCreateTestModal}
						>
							<Plus size={20} />
							<span>Жаңа тест жасау</span>
						</Button>
					</div>
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
									onEdit={() => openEditTestModal({
										id: test.id,
										title: test.title,
										subject: test.subject,
										duration: test.duration,
										difficulty: test.difficulty,
										questionsCount: test.questions_count
									} as TestData)}
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
									{isFetchingNextPage ? 'Жүктелуде...' : 'Көбірек көрсету'}
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
