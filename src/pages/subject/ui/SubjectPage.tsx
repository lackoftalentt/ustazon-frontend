import { useState, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SectionTitle } from '@/shared/ui/section-title';
import s from './SubjectPage.module.scss';
import { Container } from '@/shared/ui/container';
import { Input } from '@/shared/ui/input';
import SearchIcon from '@/shared/assets/icons/search.svg?react';
import { TopicGraph } from '@/widgets/subject-navigator';
import { SubjectCard } from '@/entities/subject/ui';
import { Link } from 'react-router-dom';
import { useSubjectByCode } from '@/entities/subject/model/useSubjects';
import { useCards, useCardTopics } from '@/entities/card/model/useCards';
import { Loader } from '@/shared/ui/loader';

export const SubjectPage = () => {
    const { subjectCode } = useParams<{ subjectCode: string }>();
    const [searchParams] = useSearchParams();
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
                  limit: 100000
              }
            : undefined
    );

    const { isLoading: isLoadingTopics } = useCardTopics({
        limit: 1000
    });

    // Build hierarchical structure: Grade → Quarter → Topics
    const topics = useMemo(() => {
        if (!cards) return [];

        // Collect unique grades and quarters from cards
        const gradeQuarterTopics = new Map<string, any>();

        cards.forEach(card => {
            const grade = card.grade;
            const quarter = card.quarter;
            const topic = card.topic;

            // Create virtual grade node
            if (grade !== null && grade !== undefined) {
                const gradeKey = `grade-${grade}`;
                if (!gradeQuarterTopics.has(gradeKey)) {
                    gradeQuarterTopics.set(gradeKey, {
                        id: -1000 - grade, // Negative IDs for virtual nodes
                        topic: `${grade}-сынып`,
                        parent_topic_id: null,
                        children: []
                    });
                }

                // Create virtual quarter node under grade
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

                    // Add topic under quarter
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
                    // No quarter, add topic directly under grade
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
                // No grade/quarter, add topic at root level
                const topicKey = `topic-${topic.id}`;
                if (!gradeQuarterTopics.has(topicKey)) {
                    gradeQuarterTopics.set(topicKey, {
                        ...topic,
                        children: topic.children || []
                    });
                }
            }
        });

        // Return only root level nodes (grades and topics without grade)
        return Array.from(gradeQuarterTopics.values()).filter(
            node => node.parent_topic_id === null
        );
    }, [cards]);

    const isLoading = isLoadingSubject || isLoadingCards || isLoadingTopics;

    // Filter cards by search query and selected topic
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

        // Apply topic filter if selected
        if (selectedTopicId) {
            filtered = filtered.filter(
                card => card.topic?.id === parseInt(selectedTopicId)
            );
        }

        return filtered;
    }, [cards, searchQuery, selectedTopicId]);

    // Group cards by window
    const cardsByWindow = useMemo(() => {
        if (!filteredCards || !subject?.windows) return [];

        // Create a map of window_id -> cards
        const windowMap = new Map<number, typeof filteredCards>();

        filteredCards.forEach(card => {
            if (card.window_id !== null) {
                if (!windowMap.has(card.window_id)) {
                    windowMap.set(card.window_id, []);
                }
                windowMap.get(card.window_id)!.push(card);
            }
        });

        // Create array of window groups with their cards
        return (
            subject.windows
                .map(window => ({
                    window,
                    cards: windowMap.get(window.id) || []
                }))
                // Show only windows that have cards in filtered results
                .filter(group => group.cards.length > 0)
        );
    }, [filteredCards, subject?.windows]);

    // Cards without window
    const cardsWithoutWindow = useMemo(() => {
        if (!filteredCards) return [];
        return filteredCards.filter(card => card.window_id === null);
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

    // Find selected topic name
    const selectedTopic = topics.find(
        t => t.id === parseInt(selectedTopicId || '0')
    );

    return (
        <main className={s.subjectPage}>
            <Container>
                <SectionTitle title={subject.name} />

                {/* Topic filter indicator */}
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
                            to={`/subject/${subjectCode}`}
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
                />

                {/* Window filter indicator */}
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
                            Фильтр по категории активен
                        </span>
                        <Link
                            to={`/subject/${subjectCode}`}
                            style={{
                                color: '#2f8450',
                                textDecoration: 'underline',
                                fontSize: '14px'
                            }}>
                            Сбросить фильтр
                        </Link>
                    </div>
                )}

                {/* Window Groups */}
                {!selectedWindowId &&
                    cardsByWindow.map(({ window, cards }) => (
                        <div key={window.id}>
                            <SectionTitle title={window.name} />
                            <div className={s.container}>
                                {cards.slice(0, 3).map(card => (
                                    <SubjectCard
                                        key={card.id}
                                        id={card.id}
                                        title={card.name}
                                        description={
                                            card.description ||
                                            `${
                                                card.topic?.topic || 'Материал'
                                            } • ${
                                                card.grade
                                                    ? `${card.grade} класс`
                                                    : ''
                                            }`
                                        }
                                        thumbnail={card.img1_url || undefined}
                                        path={`/subject/${subjectCode}/detail/${card.id}`}
                                    />
                                ))}
                            </div>
                            {cards.length > 3 && (
                                <Link
                                    to={`/subject/${subjectCode}?window=${window.id}`}
                                    className={s.showMoreLink}
                                    style={{
                                        cursor: 'pointer',
                                        opacity: 1,
                                        color: '#2f8450',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        display: 'block',
                                        marginTop: '16px'
                                    }}>
                                    Показать все ({cards.length})
                                </Link>
                            )}
                        </div>
                    ))}

                {/* Show all cards when window filter is active */}
                {selectedWindowId && (
                    <div>
                        <SectionTitle
                            title={
                                subject?.windows?.find(
                                    w => w.id === parseInt(selectedWindowId)
                                )?.name || 'Материалы'
                            }
                        />
                        <div className={s.container}>
                            {filteredCards.map(card => (
                                <SubjectCard
                                    key={card.id}
                                    id={card.id}
                                    title={card.name}
                                    description={
                                        card.description ||
                                        `${card.topic?.topic || 'Материал'} • ${
                                            card.grade
                                                ? `${card.grade} класс`
                                                : ''
                                        }`
                                    }
                                    thumbnail={card.img1_url || undefined}
                                    path={`/subject/${subjectCode}/detail/${card.id}`}
                                />
                            ))}
                        </div>
                        {filteredCards.length === 0 && (
                            <div
                                style={{
                                    textAlign: 'center',
                                    padding: '40px',
                                    color: '#666'
                                }}>
                                Нет материалов в этой категории
                            </div>
                        )}
                    </div>
                )}

                {/* Cards without window */}
                {cardsWithoutWindow.length > 0 && (
                    <>
                        <SectionTitle title="Другие материалы" />
                        <div className={s.container}>
                            {cardsWithoutWindow.slice(0, 6).map(card => (
                                <SubjectCard
                                    key={card.id}
                                    id={card.id}
                                    title={card.name}
                                    description={
                                        card.description ||
                                        `${card.topic?.topic || 'Материал'} • ${
                                            card.grade
                                                ? `${card.grade} класс`
                                                : ''
                                        }`
                                    }
                                    thumbnail={card.img1_url || undefined}
                                    path={`/subject/${subjectCode}/detail/${card.id}`}
                                />
                            ))}
                            {cardsWithoutWindow.length > 6 && (
                                <div
                                    className={s.showMoreLink}
                                    style={{ cursor: 'default', opacity: 0.6 }}>
                                    Всего материалов:{' '}
                                    {cardsWithoutWindow.length}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* Empty State */}
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

                {/* Total count */}
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
export default SubjectPage;
