import type { CardListItem } from '@/entities/card/api/cardApi'
import type { KmzhItem } from '@/entities/kmzh/api/kmzhApi'
import type { Test } from '@/entities/test/api/testApi'
import type { TopicNode } from '../model/store'

const getGradeNodeId = (grade: number): number => -1000 - grade

const getQuarterNodeId = (grade: number, quarter: number): number =>
	-2000 - (grade * 10 + quarter)

export const buildTopicTree = (
	cards: CardListItem[] = [],
	kmzhList: KmzhItem[] = [],
	_tests: Test[] = []
): TopicNode[] => {
	if (cards.length === 0 && kmzhList.length === 0) return []

	const gradeQuarterTopics = new Map<string, TopicNode>()

	cards.forEach(card => {
		const { grade, quarter, topic } = card

		if (grade !== null && grade !== undefined) {
			const gradeKey = `grade-${grade}`

			// Создаем узел класса если его нет
			if (!gradeQuarterTopics.has(gradeKey)) {
				gradeQuarterTopics.set(gradeKey, {
					id: getGradeNodeId(grade),
					topic: `${grade}-сынып`,
					parent_topic_id: null,
					children: []
				})
			}

			if (quarter !== null && quarter !== undefined) {
				const quarterKey = `grade-${grade}-quarter-${quarter}`

				// Создаем узел четверти если его нет
				if (!gradeQuarterTopics.has(quarterKey)) {
					const quarterNode: TopicNode = {
						id: getQuarterNodeId(grade, quarter),
						topic: `${quarter}-тоқсан`,
						parent_topic_id: getGradeNodeId(grade),
						children: []
					}
					gradeQuarterTopics.set(quarterKey, quarterNode)
					gradeQuarterTopics.get(gradeKey)!.children.push(quarterNode)
				}

				// Добавляем topic в четверть если он есть
				if (topic) {
					const quarterNode = gradeQuarterTopics.get(quarterKey)!
					if (!quarterNode.children.find(t => t.id === topic.id)) {
						quarterNode.children.push({
							id: topic.id,
							topic: topic.topic,
							parent_topic_id: quarterNode.id,
							children: []
						})
					}
				}
			} else if (topic) {
				// Добавляем topic напрямую в класс (без четверти)
				const gradeNode = gradeQuarterTopics.get(gradeKey)!
				if (!gradeNode.children.find(t => t.id === topic.id)) {
					gradeNode.children.push({
						id: topic.id,
						topic: topic.topic,
						parent_topic_id: gradeNode.id,
						children: []
					})
				}
			}
		} else if (topic) {
			// Topic без grade - добавляем на корневой уровень
			const topicKey = `topic-${topic.id}`
			if (!gradeQuarterTopics.has(topicKey)) {
				gradeQuarterTopics.set(topicKey, {
					id: topic.id,
					topic: topic.topic,
					parent_topic_id: null,
					children: []
				})
			}
		}
	})

	// Обработка KMZH (только grade/quarter структура, без topic)
	kmzhList.forEach(kmzh => {
		const { grade, quarter } = kmzh

		if (grade !== null && grade !== undefined) {
			const gradeKey = `grade-${grade}`

			if (!gradeQuarterTopics.has(gradeKey)) {
				gradeQuarterTopics.set(gradeKey, {
					id: getGradeNodeId(grade),
					topic: `${grade}-сынып`,
					parent_topic_id: null,
					children: []
				})
			}

			if (quarter !== null && quarter !== undefined) {
				const quarterKey = `grade-${grade}-quarter-${quarter}`

				if (!gradeQuarterTopics.has(quarterKey)) {
					const quarterNode: TopicNode = {
						id: getQuarterNodeId(grade, quarter),
						topic: `${quarter}-тоқсан`,
						parent_topic_id: getGradeNodeId(grade),
						children: []
					}
					gradeQuarterTopics.set(quarterKey, quarterNode)
					gradeQuarterTopics.get(gradeKey)!.children.push(quarterNode)
				}
			}
		}
	})

	// Возвращаем только корневые узлы (parent_topic_id === null)
	return Array.from(gradeQuarterTopics.values()).filter(
		node => node.parent_topic_id === null
	)
}

// Находит узел в дереве по ID
export const findTopicNode = (
	tree: TopicNode[],
	id: number
): TopicNode | null => {
	for (const node of tree) {
		if (node.id === id) return node

		const found = findTopicNode(node.children, id)
		if (found) return found
	}
	return null
}

// Получает все ID узлов от корня до указанного узла (breadcrumb)
export const getTopicPath = (
	tree: TopicNode[],
	id: number,
	path: number[] = []
): number[] | null => {
	for (const node of tree) {
		if (node.id === id) {
			return [...path, node.id]
		}

		const found = getTopicPath(node.children, id, [...path, node.id])
		if (found) return found
	}
	return null
}

// Получает все листовые узлы дерева
export const getLeafTopics = (tree: TopicNode[]): TopicNode[] => {
	const leaves: TopicNode[] = []

	const traverse = (nodes: TopicNode[]) => {
		for (const node of nodes) {
			if (node.children.length === 0) {
				leaves.push(node)
			} else {
				traverse(node.children)
			}
		}
	}

	traverse(tree)
	return leaves
}
