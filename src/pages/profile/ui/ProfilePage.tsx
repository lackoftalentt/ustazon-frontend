import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
    Settings,
    BookMarked,
    CheckCircle,
    Eye,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { SearchInput } from '@/shared/ui/search-input';
import { useAuthStore } from '@/entities/user';
import {
    MaterialCard,
    type MaterialType,
    type SavedMaterial,
    type UserStats,
    materialTypeLabels
} from '@/entities/material';
import s from './ProfilePage.module.scss';

const ITEMS_PER_PAGE = 8;

const mockMaterials: SavedMaterial[] = [
    {
        id: '1',
        title: 'Математика: Квадрат теңдеулер',
        description: 'Квадрат теңдеулерді шешу әдістері және формулалары',
        type: 'card',
        thumbnail: '',
        savedAt: '2024-01-15',
        path: '/subjects-materials/math/detail/1',
        subjectName: 'Математика'
    },
    {
        id: '2',
        title: 'Физика бойынша тест',
        description: 'Механика бөлімі бойынша тест тапсырмалары',
        type: 'test',
        thumbnail: '',
        savedAt: '2024-01-14',
        path: '/take-test?id=2',
        subjectName: 'Физика'
    },
    {
        id: '3',
        title: 'Қазақ тілі КМЖ - 5 сынып',
        description: 'Күнтізбелік-мазмұндық жоспар, 1-тоқсан',
        type: 'kmzh',
        thumbnail: '',
        savedAt: '2024-01-13',
        path: '/kmzh',
        subjectName: 'Қазақ тілі'
    },
    {
        id: '4',
        title: 'Химия: Периодтық кесте',
        description: 'Менделеев кестесі және элементтер қасиеттері',
        type: 'card',
        thumbnail: '',
        savedAt: '2024-01-12',
        path: '/subjects-materials/chemistry/detail/4',
        subjectName: 'Химия'
    },
    {
        id: '5',
        title: 'Биология тесті',
        description: 'Жасуша құрылысы бойынша тест',
        type: 'test',
        thumbnail: '',
        savedAt: '2024-01-11',
        path: '/take-test?id=5',
        subjectName: 'Биология'
    },
    {
        id: '6',
        title: 'Ағылшын тілі КМЖ - 7 сынып',
        description: 'Күнтізбелік жоспар, 2-тоқсан',
        type: 'kmzh',
        thumbnail: '',
        savedAt: '2024-01-10',
        path: '/kmzh',
        subjectName: 'Ағылшын тілі'
    },
    {
        id: '7',
        title: 'География: Материктер',
        description: 'Материктер мен мұхиттар туралы ақпарат',
        type: 'card',
        thumbnail: '',
        savedAt: '2024-01-09',
        path: '/subjects-materials/geography/detail/7',
        subjectName: 'География'
    },
    {
        id: '8',
        title: 'Тарих тесті',
        description: 'Қазақстан тарихы бойынша тест',
        type: 'test',
        thumbnail: '',
        savedAt: '2024-01-08',
        path: '/take-test?id=8',
        subjectName: 'Тарих'
    },
    {
        id: '9',
        title: 'Информатика карточкасы',
        description: 'Алгоритмдер және программалау негіздері',
        type: 'card',
        thumbnail: '',
        savedAt: '2024-01-07',
        path: '/subjects-materials/informatics/detail/9',
        subjectName: 'Информатика'
    },
    {
        id: '10',
        title: 'Математика КМЖ - 6 сынып',
        description: 'Күнтізбелік жоспар, 3-тоқсан',
        type: 'kmzh',
        thumbnail: '',
        savedAt: '2024-01-06',
        path: '/kmzh',
        subjectName: 'Математика'
    },
    {
        id: '11',
        title: 'Физика презентациясы',
        description: 'Электр тогы туралы презентация',
        type: 'presentation',
        thumbnail: '',
        savedAt: '2024-01-05',
        path: '/subject-presentation-detail?id=11',
        subjectName: 'Физика'
    }
];

const mockStats: UserStats = {
    savedMaterials: 24,
    completedTests: 12,
    viewedCards: 48
};

const filterTypes: MaterialType[] = ['all', 'card', 'test', 'kmzh', 'presentation'];

export const ProfilePage = () => {
    const { user } = useAuthStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState<MaterialType>('all');
    const [currentPage, setCurrentPage] = useState(1);

    const filteredMaterials = useMemo(() => {
        let result = mockMaterials;

        if (activeFilter !== 'all') {
            result = result.filter(m => m.type === activeFilter);
        }

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                m =>
                    m.title.toLowerCase().includes(query) ||
                    m.description?.toLowerCase().includes(query) ||
                    m.subjectName?.toLowerCase().includes(query)
            );
        }

        return result;
    }, [activeFilter, searchQuery]);

    const totalPages = Math.ceil(filteredMaterials.length / ITEMS_PER_PAGE);
    const paginatedMaterials = filteredMaterials.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleFilterChange = (filter: MaterialType) => {
        setActiveFilter(filter);
        setCurrentPage(1);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <main className={s.profilePage}>
            <Container>
                <div className={s.header}>
                    <div className={s.userInfo}>
                        <div className={s.avatar}>
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className={s.userDetails}>
                            <h1 className={s.userName}>
                                {user?.name || 'Пайдаланушы'}
                            </h1>
                            <p className={s.userPhone}>
                                {user?.phoneNumber || ''}
                            </p>
                        </div>
                    </div>
                    <Link to="/profile-settings">
                        <Button
                            variant="outline"
                            className={s.settingsButton}>
                            <Settings size={18} />
                            Баптаулар
                        </Button>
                    </Link>
                </div>

                <div className={s.stats}>
                    <div className={s.statCard}>
                        <div className={s.statIcon}>
                            <BookMarked size={24} />
                        </div>
                        <div className={s.statInfo}>
                            <span className={s.statValue}>
                                {mockStats.savedMaterials}
                            </span>
                            <span className={s.statLabel}>
                                Сақталған материалдар
                            </span>
                        </div>
                    </div>
                    <div className={s.statCard}>
                        <div className={s.statIcon}>
                            <CheckCircle size={24} />
                        </div>
                        <div className={s.statInfo}>
                            <span className={s.statValue}>
                                {mockStats.completedTests}
                            </span>
                            <span className={s.statLabel}>Өтілген тесттер</span>
                        </div>
                    </div>
                    <div className={s.statCard}>
                        <div className={s.statIcon}>
                            <Eye size={24} />
                        </div>
                        <div className={s.statInfo}>
                            <span className={s.statValue}>
                                {mockStats.viewedCards}
                            </span>
                            <span className={s.statLabel}>
                                Қаралған карточкалар
                            </span>
                        </div>
                    </div>
                </div>

                <section className={s.materialsSection}>
                    <h2 className={s.sectionTitle}>Сақталған материалдар</h2>

                    <div className={s.controls}>
                        <SearchInput
                            placeholder="Материалдарды іздеу..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className={s.searchInput}
                        />

                        <div className={s.filters}>
                            {filterTypes.map(type => (
                                <button
                                    key={type}
                                    className={`${s.filterButton} ${
                                        activeFilter === type ? s.active : ''
                                    }`}
                                    onClick={() => handleFilterChange(type)}>
                                    {materialTypeLabels[type]}
                                </button>
                            ))}
                        </div>
                    </div>

                    {paginatedMaterials.length > 0 ? (
                        <>
                            <div className={s.materialsGrid}>
                                {paginatedMaterials.map(material => (
                                    <MaterialCard
                                        key={material.id}
                                        material={material}
                                    />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className={s.pagination}>
                                    <button
                                        className={s.paginationButton}
                                        onClick={() =>
                                            setCurrentPage(p =>
                                                Math.max(1, p - 1)
                                            )
                                        }
                                        disabled={currentPage === 1}>
                                        <ChevronLeft size={18} />
                                    </button>

                                    <div className={s.paginationNumbers}>
                                        {Array.from(
                                            { length: totalPages },
                                            (_, i) => i + 1
                                        ).map(page => (
                                            <button
                                                key={page}
                                                className={`${s.pageNumber} ${
                                                    currentPage === page
                                                        ? s.active
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    setCurrentPage(page)
                                                }>
                                                {page}
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        className={s.paginationButton}
                                        onClick={() =>
                                            setCurrentPage(p =>
                                                Math.min(totalPages, p + 1)
                                            )
                                        }
                                        disabled={currentPage === totalPages}>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className={s.emptyState}>
                            <BookMarked
                                size={48}
                                strokeWidth={1.5}
                            />
                            <p>Материалдар табылмады</p>
                        </div>
                    )}
                </section>
            </Container>
        </main>
    );
};

export default ProfilePage;
