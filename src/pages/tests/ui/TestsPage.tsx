import { Container } from '@/shared/ui/container';
import s from './TestsPage.module.scss';
import { SectionTitle } from '@/shared/ui/section-title';
import { Button } from '@/shared/ui/button';
import { Plus, TextSelectionIcon, Search, BookOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TestItem } from '@/shared/ui/test-item';
import { SearchInput } from '@/shared/ui/search-input';

interface Test {
    id: string;
    title: string;
    description: string;
    questionsCount: number;
    timeLimit: number;
    participants: number;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
}

export const TestsPage = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [tests, setTests] = useState<Test[]>([]);

    useEffect(() => {
        setIsMounted(true);
        setTimeout(() => {
            const mockTests: Test[] = [
                {
                    id: '1',
                    title: 'Алгебра негіздері',
                    description:
                        'Темірқазықтарға арналған алгебралық теңдеулерді шешу',
                    questionsCount: 20,
                    timeLimit: 30,
                    participants: 156,
                    difficulty: 'easy',
                    category: 'Алгебра'
                },
                {
                    id: '2',
                    title: 'Геометриялық фигуралар',
                    description:
                        'Жазықтықтағы фигуралардың қасиеттері мен есептеулері',
                    questionsCount: 15,
                    timeLimit: 25,
                    participants: 89,
                    difficulty: 'medium',
                    category: 'Геометрия'
                },
                {
                    id: '3',
                    title: 'Тригонометрия есептері',
                    description:
                        'Синус, косинус және тангенс функциялары бойынша күрделі есептер',
                    questionsCount: 25,
                    timeLimit: 45,
                    participants: 42,
                    difficulty: 'hard',
                    category: 'Тригонометрия'
                },
                {
                    id: '4',
                    title: 'Есептеу техникасы',
                    description:
                        'Математикалық есептеулерді жедел және дұрыс орындау әдістері',
                    questionsCount: 18,
                    timeLimit: 35,
                    participants: 231,
                    difficulty: 'medium',
                    category: 'Есептеу'
                },
                {
                    id: '5',
                    title: 'Функцияларды зерттеу',
                    description:
                        'Функциялардың қасиеттері, графиктері және қолданылуы',
                    questionsCount: 22,
                    timeLimit: 40,
                    participants: 78,
                    difficulty: 'hard',
                    category: 'Функциялар'
                },
                {
                    id: '6',
                    title: 'Математикалық логика',
                    description:
                        'Логикалық операциялар және математикалық дәлелдеулер',
                    questionsCount: 12,
                    timeLimit: 20,
                    participants: 95,
                    difficulty: 'easy',
                    category: 'Логика'
                }
            ];
            setTests(mockTests);
            setIsLoading(false);
        }, 1500);
    }, []);

    const filteredTests = tests.filter(
        test =>
            test.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            test.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            test.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

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
                            <h1 className={s.subjectName}>Математика</h1>
                        </div>
                        <p className={s.subtitle}>
                            Білімді тексеру және дайындық деңгейін бағалау үшін
                            арналған интерактивті тестілер
                        </p>
                    </div>
                </div>

                <div className={s.controls}>
                    <div className={s.controlsLeft}>
                        <div className={s.testsCount}>
                            <TextSelectionIcon size={20} />
                            <span className={s.countNumber}>
                                {tests.length}
                            </span>
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
                    </div>

                    <div className={s.buttonContainer}>
                        <Button
                            className={s.btnNewTest}
                            onClick={() =>
                                console.log('Создание нового теста')
                            }>
                            <Plus size={20} />
                            <span>Жаңа тест жасау</span>
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className={s.loadingState}>
                        <div className={s.spinnerContainer}>
                            <div className={s.spinner}></div>
                            <div className={s.spinnerRing}></div>
                        </div>
                        <p className={s.loadingText}>Тесттер жүктелуде...</p>
                        <p className={s.loadingSubtext}>Біраз уақыт күтіңіз</p>
                    </div>
                ) : filteredTests.length > 0 ? (
                    <div className={s.testList}>
                        {filteredTests.map(test => (
                            <TestItem
                                key={test.id}
                                {...test}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={s.emptyList}>
                        <div className={s.emptyIcon}>
                            <Search size={48} />
                        </div>
                        <h3 className={s.emptyTitle}>Тесттер табылмады</h3>
                        <p className={s.emptyDescription}>
                            &quot;{searchQuery}&quot; сөзі бойынша сәйкес
                            келетін тесттер жоқ. Басқа сөздермен іздеп көріңіз.
                        </p>
                        <button
                            className={s.resetButton}
                            onClick={() => setSearchQuery('')}>
                            Барлық тесттерді көрсету
                        </button>
                    </div>
                )}
            </Container>
        </main>
    );
};

export default TestsPage;
