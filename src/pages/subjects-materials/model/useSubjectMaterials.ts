import { useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSubjectByCode } from '@/entities/subject/model/useSubjects';
import { useCards, useCardTopics } from '@/entities/card/model/useCards';
import type { CardListItem } from '@/entities/card/api/cardApi';

interface TopicNode {
    id: number;
    topic: string;
    parent_topic_id: number | null;
    children: TopicNode[];
}

export const useSubjectMaterials = () => {
    const { subjectCode } = useParams<{ subjectCode: string }>();
    const [searchParams, setSearchParams] = useSearchParams();

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

    const { isLoading: isLoadingTopics } = useCardTopics({
        limit: 20
    });

    const topics = useMemo((): TopicNode[] => {
        if (!cards) return [];

        const gradeQuarterTopics = new Map<string, TopicNode>();

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
                        const quarterNode: TopicNode = {
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
                        if (!quarterNode.children.find(t => t.id === topic.id)) {
                            quarterNode.children.push({
                                id: topic.id,
                                topic: topic.topic,
                                parent_topic_id: quarterNode.id,
                                children: []
                            });
                        }
                    }
                } else if (topic) {
                    const gradeNode = gradeQuarterTopics.get(gradeKey)!;
                    if (!gradeNode.children.find(t => t.id === topic.id)) {
                        gradeNode.children.push({
                            id: topic.id,
                            topic: topic.topic,
                            parent_topic_id: gradeNode.id,
                            children: []
                        });
                    }
                }
            } else if (topic) {
                const topicKey = `topic-${topic.id}`;
                if (!gradeQuarterTopics.has(topicKey)) {
                    gradeQuarterTopics.set(topicKey, {
                        id: topic.id,
                        topic: topic.topic,
                        parent_topic_id: null,
                        children: []
                    });
                }
            }
        });

        return Array.from(gradeQuarterTopics.values()).filter(
            node => node.parent_topic_id === null
        );
    }, [cards]);

    const isLoading = isLoadingSubject || isLoadingCards || isLoadingTopics;

    const handleTopicSelect = (topicId: number | null) => {
        if (topicId === null) {
            searchParams.delete('topic');
        } else {
            searchParams.set('topic', topicId.toString());
        }
        setSearchParams(searchParams);
    };

    const selectedTopic = topics.find(
        t => t.id === parseInt(selectedTopicId || '0')
    );

    return {
        subjectCode,
        subject,
        cards,
        topics,
        isLoading,
        selectedTopicId,
        selectedWindowId,
        selectedTopic,
        handleTopicSelect
    };
};

export const useFilteredCards = (
    cards: CardListItem[] | undefined,
    searchQuery: string,
    selectedTopicId: string | null
) => {
    return useMemo(() => {
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
};

export const useCardsByWindow = (cards: CardListItem[]) => {
    return useMemo(() => {
        const grouped = new Map<number | null, CardListItem[]>();

        cards.forEach(card => {
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
    }, [cards]);
};
