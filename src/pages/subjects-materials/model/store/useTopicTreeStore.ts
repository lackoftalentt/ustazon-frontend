import { create } from 'zustand'

export interface TopicNode {
	id: number
	topic: string
	parent_topic_id: number | null
	children: TopicNode[]
}

interface TopicTreeState {
	topicTree: TopicNode[]
	selectedTopicId: number | null
	isTreeBuilt: boolean

	setTopicTree: (tree: TopicNode[]) => void
	setSelectedTopicId: (id: number | null) => void
	resetTree: () => void
}

export const useTopicTreeStore = create<TopicTreeState>()((set) => ({
	topicTree: [],
	selectedTopicId: null,
	isTreeBuilt: false,

	setTopicTree: (tree) =>
		set({
			topicTree: tree,
			isTreeBuilt: true
		}),

	setSelectedTopicId: (id) =>
		set({
			selectedTopicId: id
		}),

	resetTree: () =>
		set({
			topicTree: [],
			selectedTopicId: null,
			isTreeBuilt: false
		})
}))
