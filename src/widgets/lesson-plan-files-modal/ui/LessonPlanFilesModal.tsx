import { LessonPlanFile } from '@/shared/ui/lesson-plan-file'
import { Modal } from '@/shared/ui/modal'
import { useTranslation } from 'react-i18next'
import s from './LessonPlanFilesModal.module.scss'

type FileItem = { id: string; name: string; url?: string }

type Props = {
	open: boolean
	onClose: () => void
	lessonTitle?: string
	files: FileItem[]
}

export const LessonPlanFilesModal = ({
	open,
	onClose,
	lessonTitle,
	files
}: Props) => {
	const { t } = useTranslation()

	return (
		<Modal
			open={open}
			onClose={onClose}
			title={lessonTitle ? t('lessonPlanFiles.title', { title: lessonTitle }) : t('lessonPlanFiles.titleDefault')}
		>
			{files.length === 0 ? (
				<div className={s.empty}>{t('lessonPlanFiles.noFiles')}</div>
			) : (
				<ul className={s.list}>
					{files.map(f => (
						<LessonPlanFile
							key={f.id}
							file={f}
						/>
					))}
				</ul>
			)}
		</Modal>
	)
}
