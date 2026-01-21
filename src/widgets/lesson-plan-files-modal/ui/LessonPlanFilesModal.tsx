import { LessonPlanFile } from '@/shared/ui/lesson-plan-file'
import { Modal } from '@/shared/ui/modal'
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
	return (
		<Modal
			open={open}
			onClose={onClose}
			title={lessonTitle ? `Файлдар: ${lessonTitle}` : 'Файл'}
		>
			{files.length === 0 ? (
				<div className={s.empty}>Файлдар жоқ</div>
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
