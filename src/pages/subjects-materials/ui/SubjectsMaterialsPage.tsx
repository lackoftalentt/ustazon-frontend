import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SectionTitle } from '@/shared/ui/section-title';
import s from './SubjectsMaterialsPage.module.scss';
import { Container } from '@/shared/ui/container';
import { Input } from '@/shared/ui/input';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import { TopicGraph } from '@/widgets/subject-navigator';
import { SubjectCard } from '@/entities/subject/ui';
import { Link } from 'react-router-dom';
import { useSubjectByCode } from '@/entities/subject/model/useSubjects';
import { useCards, useCardTopics } from '@/entities/card/model/useCards';
import { Loader } from '@/shared/ui/loader';
import ArrowIcon from '@/shared/assets/icons/arrowLeft.svg?react';

const windowIdDatas = [
    {
        name: 'Жасанды интеллект',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 1,
        created_at: '2025-12-30T18:40:40.466433',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Онлайн тақталар',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 2,
        created_at: '2025-12-30T18:40:40.468145',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Квиз ойындары',
        template_id: 1,
        link: null,
        nsub: true,
        image_url:
            'https://i.pinimg.com/736x/97/6e/e3/976ee3e3af583037b9cfb2768c5d964f.jpg',
        id: 3,
        created_at: '2025-12-30T18:40:40.469203',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Дидактикалық ойындар',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 4,
        created_at: '2025-12-30T18:40:40.470223',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Дидактикалық ойындар құрастыру платформалар',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 6,
        created_at: '2025-12-30T18:40:40.471170',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Презентация',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 7,
        created_at: '2025-12-30T18:40:40.472092',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Презентация шеберханасы',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 8,
        created_at: '2025-12-30T18:40:40.473131',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Презентация шаблондары-1',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 9,
        created_at: '2025-12-30T18:40:40.473985',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Презентация шаблондары-2',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 10,
        created_at: '2025-12-30T18:40:40.474796',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Жұмыс парағы',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 11,
        created_at: '2025-12-30T18:40:40.475631',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Көрнекіліктер',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 12,
        created_at: '2025-12-30T18:40:40.476477',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Олимпиада тапсырмалары',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 13,
        created_at: '2025-12-30T18:40:40.477314',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Математикалық сауаттылық',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 14,
        created_at: '2025-12-30T18:40:40.478256',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Электронды оқулықтар',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 15,
        created_at: '2025-12-30T18:40:40.479232',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Desmos ойындар',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 16,
        created_at: '2025-12-30T18:40:40.480092',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Анимация',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 17,
        created_at: '2025-12-30T18:40:40.480976',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Тест',
        template_id: 2,
        link: 'https://ustazon.com/test',
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 18,
        created_at: '2025-12-30T18:40:40.481787',
        template: {
            name: 'Тест',
            code_name: 'test',
            id: 2,
            created_at: '2025-12-30T18:40:40.458787'
        }
    },
    {
        name: 'ҚМЖ',
        template_id: 3,
        link: 'http://185.129.51.101:5555/qmj',
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 19,
        created_at: '2025-12-30T18:40:40.482661',
        template: {
            name: 'ҚМЖ',
            code_name: 'qmj',
            id: 3,
            created_at: '2025-12-30T18:40:40.459913'
        }
    },
    {
        name: 'Электронды Журнал',
        template_id: 4,
        link: 'https://ustazon.com/dashboard',
        nsub: false,
        image_url:
            'https://plus.unsplash.com/premium_vector-1727952231396-e301fbf4ef1b?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        id: 20,
        created_at: '2025-12-30T18:40:40.483521',
        template: {
            name: 'Журнал',
            code_name: 'dashboard',
            id: 4,
            created_at: '2025-12-30T18:40:40.460877'
        }
    },
    {
        name: 'The Progress Arena',
        template_id: 1,
        link: null,
        nsub: false,
        image_url:
            'https://ustazon.com/media/window/image/olinetaqta_djl1Ril.jpg',
        id: 21,
        created_at: '2025-12-30T18:40:40.484361',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Python',
        template_id: 5,
        link: 'https://python-django.kz',
        nsub: false,
        image_url: 'https://python-django.kz/static/main/img/logo.png',
        id: 22,
        created_at: '2025-12-30T18:40:40.485243',
        template: {
            name: 'python-django',
            code_name: 'python',
            id: 5,
            created_at: '2025-12-30T18:40:40.461727'
        }
    },
    {
        name: 'Тақырыптық тапсырмалар',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 23,
        created_at: '2025-12-30T18:40:40.486093',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'Олимпиада есептері',
        template_id: 1,
        link: null,
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 24,
        created_at: '2025-12-30T18:40:40.486889',
        template: {
            name: 'Карточка',
            code_name: 'card',
            id: 1,
            created_at: '2025-12-30T18:40:40.456920'
        }
    },
    {
        name: 'UstazOn AI chat',
        template_id: 5,
        link: 'https://ustazon.com/ai/chat',
        nsub: false,
        image_url: 'https://ustazon.com/static/main/img/books12.jpg',
        id: 25,
        created_at: '2025-12-30T18:40:40.487635',
        template: {
            name: 'python-django',
            code_name: 'python',
            id: 5,
            created_at: '2025-12-30T18:40:40.461727'
        }
    }
];

const institutionTypes = [
    {
        name: 'Мектеп',
        code: null,
        id: 1,
        created_at: '2025-12-30T18:40:39.719645',
        updated_at: '2025-12-30T18:40:39.719651'
    },
    {
        name: 'Университет',
        code: null,
        id: 2,
        created_at: '2025-12-30T18:40:39.721469',
        updated_at: '2025-12-30T18:40:39.721471'
    },
    {
        name: 'Колледж',
        code: null,
        id: 3,
        created_at: '2025-12-30T18:40:39.722375',
        updated_at: '2025-12-30T18:40:39.722377'
    },
    {
        name: 'Балабақша',
        code: null,
        id: 4,
        created_at: '2025-12-30T18:40:39.723240',
        updated_at: '2025-12-30T18:40:39.723243'
    },
    {
        name: 'Python тілін үйрену',
        code: null,
        id: 5,
        created_at: '2025-12-30T18:40:39.724044',
        updated_at: '2025-12-30T18:40:39.724046'
    }
];

export const SubjectsMaterialsPage = () => {
    const { subjectCode } = useParams<{ subjectCode: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');

    const selectedTopicId = searchParams.get('topic');
    const selectedWindowId = searchParams.get('window');

    const { data: subject, isLoading: isLoadingSubject } = useSubjectByCode(
        subjectCode || '',
        !!subjectCode
    );

    const { data: cards, isLoading: isLoadingCards } = useCards(
        subject?.id
            ? {
                  subject_id: subject.id,
                  window_id: selectedWindowId
                      ? parseInt(selectedWindowId)
                      : undefined,
                  limit: 1000
              }
            : undefined
    );

    console.log(subject);
    console.log(cards);

    const { data: allTopics, isLoading: isLoadingTopics } = useCardTopics({
        limit: 20
    });

    console.log(allTopics);

    const topics = useMemo(() => {
        if (!cards) return [];

        const gradeQuarterTopics = new Map<string, any>();

        cards.forEach(card => {
            const grade = card.grade;
            const quarter = card.quarter;
            const topic = card.topic;

            if (grade !== null && grade !== undefined) {
                const gradeKey = `grade-${grade}`;
                if (!gradeQuarterTopics.has(gradeKey)) {
                    gradeQuarterTopics.set(gradeKey, {
                        id: -1000 - grade,
                        topic: `${grade}-сынып`,
                        parent_topic_id: null,
                        children: []
                    });
                }

                if (quarter !== null && quarter !== undefined) {
                    const quarterKey = `grade-${grade}-quarter-${quarter}`;
                    if (!gradeQuarterTopics.has(quarterKey)) {
                        const quarterNode = {
                            id: -2000 - (grade * 10 + quarter),
                            topic: `${quarter}-тоқсан`,
                            parent_topic_id: -1000 - grade,
                            children: []
                        };
                        gradeQuarterTopics.set(quarterKey, quarterNode);
                        gradeQuarterTopics
                            .get(gradeKey)!
                            .children.push(quarterNode);
                    }

                    if (topic) {
                        const quarterNode = gradeQuarterTopics.get(quarterKey)!;
                        if (
                            !quarterNode.children.find(
                                (t: any) => t.id === topic.id
                            )
                        ) {
                            quarterNode.children.push({
                                ...topic,
                                children: topic.children || []
                            });
                        }
                    }
                } else if (topic) {
                    const gradeNode = gradeQuarterTopics.get(gradeKey)!;
                    if (
                        !gradeNode.children.find((t: any) => t.id === topic.id)
                    ) {
                        gradeNode.children.push({
                            ...topic,
                            children: topic.children || []
                        });
                    }
                }
            } else if (topic) {
                const topicKey = `topic-${topic.id}`;
                if (!gradeQuarterTopics.has(topicKey)) {
                    gradeQuarterTopics.set(topicKey, {
                        ...topic,
                        children: topic.children || []
                    });
                }
            }
        });

        return Array.from(gradeQuarterTopics.values()).filter(
            node => node.parent_topic_id === null
        );
    }, [cards]);

    const isLoading = isLoadingSubject || isLoadingCards || isLoadingTopics;

    const filteredCards = useMemo(() => {
        let filtered =
            cards?.filter(
                card =>
                    card.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    card.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
            ) || [];

        if (selectedTopicId) {
            filtered = filtered.filter(
                card => card.topic?.id === parseInt(selectedTopicId)
            );
        }

        return filtered;
    }, [cards, searchQuery, selectedTopicId]);

    const getWindowName = (windowId: number | null): string => {
        if (windowId === null) return 'Без категории';
        const windowData = windowIdDatas.find(w => w.id === windowId);
        return windowData?.name || `Window ID: ${windowId}`;
    };

    const getWindowLink = (windowId: number | null): string => {
        if (windowId === null) {
            return `/subjects-materials/${subjectCode}`;
        }
        return `/subjects-materials/${subjectCode}?window=${windowId}`;
    };

    const cardsByWindowId = useMemo(() => {
        const grouped = new Map<number | null, typeof filteredCards>();

        filteredCards.forEach(card => {
            const windowId = card.window_id ?? null;
            if (!grouped.has(windowId)) {
                grouped.set(windowId, []);
            }
            grouped.get(windowId)!.push(card);
        });

        const sortedEntries = Array.from(grouped.entries()).sort((a, b) => {
            if (a[0] === null) return 1;
            if (b[0] === null) return -1;
            return b[1].length - a[1].length;
        });

        return sortedEntries;
    }, [filteredCards]);

    if (isLoading) {
        return (
            <main className={s.subjectPage}>
                <Container>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '80px 0'
                        }}>
                        <Loader />
                    </div>
                </Container>
            </main>
        );
    }

    if (!subject) {
        return (
            <main className={s.subjectPage}>
                <Container>
                    <div style={{ textAlign: 'center', padding: '80px 0' }}>
                        Предмет не найден
                    </div>
                </Container>
            </main>
        );
    }

    const selectedTopic = topics.find(
        t => t.id === parseInt(selectedTopicId || '0')
    );

    return (
        <main className={s.subjectPage}>
            <Container>
                <SectionTitle title={subject.name} />

                {selectedTopicId && selectedTopic && (
                    <div
                        style={{
                            padding: '12px 20px',
                            background: '#f0f9ff',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                        <span style={{ color: '#0284c7', fontWeight: 500 }}>
                            Выбрана тема: {selectedTopic.topic}
                        </span>
                        <Link
                            to={`/subjects-materials/${subjectCode}`}
                            style={{
                                color: '#0284c7',
                                textDecoration: 'underline',
                                fontSize: '14px'
                            }}>
                            Сбросить фильтр
                        </Link>
                    </div>
                )}

                <Input
                    className={s.searchInput}
                    placeholder="Поиск материалов..."
                    leftIcon={<SearchIcon className={s.searchIcon} />}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                />

                <TopicGraph
                    subjectCode={subjectCode || ''}
                    topics={topics || []}
                    selectedTopicId={
                        selectedTopicId ? parseInt(selectedTopicId) : null
                    }
                    onTopicSelect={topicId => {
                        if (topicId === null) {
                            searchParams.delete('topic');
                        } else {
                            searchParams.set('topic', topicId.toString());
                        }
                        setSearchParams(searchParams);
                    }}
                />

                {selectedWindowId && (
                    <div
                        style={{
                            padding: '12px 20px',
                            background: '#f0fdf4',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: '1px solid #2f8450'
                        }}>
                        <span style={{ color: '#2f8450', fontWeight: 500 }}>
                            {getWindowName(parseInt(selectedWindowId))}
                        </span>
                        <Link
                            to={`/subjects-materials/${subjectCode}`}
                            style={{
                                color: '#2f8450',
                                textDecoration: 'underline',
                                fontSize: '14px'
                            }}>
                            Сбросить фильтр
                        </Link>
                    </div>
                )}

                {cardsByWindowId.map(([windowId, windowCards]) => {
                    const isFiltered = !!selectedWindowId;
                    const displayCards = isFiltered
                        ? windowCards
                        : windowCards.slice(0, 3);
                    const hasMore = !isFiltered && windowCards.length > 3;

                    return (
                        <div key={windowId ?? 'no-window'}>
                            {!isFiltered && (
                                <SectionTitle title={getWindowName(windowId)} />
                            )}
                            <div className={s.container}>
                                {displayCards.map(card => (
                                    <SubjectCard
                                        key={card.id}
                                        id={card.id}
                                        title={card.name}
                                        description={
                                            card.description ||
                                            `${
                                                card.topic?.topic || 'Материал'
                                            }${
                                                card.grade
                                                    ? ` • ${card.grade} класс`
                                                    : ''
                                            }`
                                        }
                                        thumbnail={card.img1_url || undefined}
                                        path={`/subjects-materials/${subjectCode}/detail/${card.id}`}
                                    />
                                ))}
                            </div>
                            {hasMore && (
                                <div
                                    style={{
                                        textAlign: 'right',
                                        marginTop: '12px',
                                        marginBottom: '24px'
                                    }}>
                                    <Link
                                        to={getWindowLink(windowId)}
                                        className={s.showMoreLink}>
                                        Показать больше
                                        <ArrowIcon className={s.arrowIcon} />
                                    </Link>
                                </div>
                            )}
                        </div>
                    );
                })}

                {(!filteredCards || filteredCards.length === 0) && (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '60px 20px',
                            color: '#888'
                        }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>
                            📚
                        </div>
                        <div
                            style={{
                                fontSize: '18px',
                                fontWeight: 500,
                                marginBottom: '8px'
                            }}>
                            {searchQuery
                                ? 'Материалы не найдены'
                                : 'Нет доступных материалов'}
                        </div>
                        {selectedTopicId && (
                            <div
                                style={{ fontSize: '14px', marginTop: '12px' }}>
                                Попробуйте{' '}
                                <Link
                                    to={`/subject/${subjectCode}`}
                                    style={{
                                        color: '#0284c7',
                                        textDecoration: 'underline'
                                    }}>
                                    сбросить фильтр
                                </Link>{' '}
                                по теме
                            </div>
                        )}
                    </div>
                )}

                {filteredCards && filteredCards.length > 0 && (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '24px 0',
                            color: '#666',
                            fontSize: '14px',
                            borderTop: '1px solid #eee',
                            marginTop: '40px'
                        }}>
                        Всего материалов: {filteredCards.length}
                        {selectedTopicId &&
                            selectedTopic &&
                            ` (тема: ${selectedTopic.topic})`}
                    </div>
                )}
            </Container>
        </main>
    );
};
export default SubjectsMaterialsPage;
