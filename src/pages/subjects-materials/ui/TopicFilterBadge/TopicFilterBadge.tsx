import { Link } from 'react-router-dom'
import s from '../SubjectsMaterialsPage.module.scss'

interface TopicFilterBadgeProps {
	topicName: string
	subjectCode: string
	windowId?: number
}

export const TopicFilterBadge = ({
	topicName,
	subjectCode,
	windowId
}: TopicFilterBadgeProps) => {
	const resetLink = `/subjects-materials/${subjectCode}${windowId ? `?window=${windowId}` : ''}`

	return (
		<div className={s.topicFilter}>
			<div className={s.topicFilterContent}>
				<div className={s.topicFilterIcon}>📚</div>
				<span>
					Тақырып: <strong>{topicName}</strong>
				</span>
			</div>
			<Link to={resetLink} className={s.topicFilterReset}>
				Тақырыпты алып тастау
			</Link>
		</div>
	)
}
