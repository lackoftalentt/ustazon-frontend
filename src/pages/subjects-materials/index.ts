export { default, SubjectsMaterialsPage } from './ui/SubjectsMaterialsPage'
export { useTopicTreeStore, type TopicNode } from './model/store'
export {
	buildTopicTree,
	findTopicNode,
	getTopicPath,
	getLeafTopics
} from './lib/buildTopicTree'
export {
	useSubjectMaterialsPage,
	MATERIAL_WINDOWS
} from './model/useSubjectMaterialsPage'
