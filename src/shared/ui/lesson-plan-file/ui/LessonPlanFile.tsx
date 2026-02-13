import s from './LessonPlanFile.module.scss'
import FileIcon from '@/shared/assets/icons/document2.svg?react'
import DownloadIcon from '@/shared/assets/icons/download.svg?react'
import { useTranslation } from 'react-i18next'

export type LessonPlanFileItem = {
	id: string
	name: string
	url?: string
}

type Props = {
	file: LessonPlanFileItem
	onDownloadClick?: (file: LessonPlanFileItem) => void
}

export const LessonPlanFile = ({ file, onDownloadClick }: Props) => {
	const { t } = useTranslation()

	return (
		<div className={s.root}>
			<div className={s.left}>
				<FileIcon className={s.fileIcon} />

				<div className={s.meta}>
					<div className={s.name}>{file.name}</div>
				</div>
			</div>

			{file.url ? (
				<a
					className={s.downloadBtn}
					href={file.url}
					download
					aria-label={t('lessonPlanFiles.downloadFile', { name: file.name })}
					onPointerDown={e => e.stopPropagation()}
					onClick={() => onDownloadClick?.(file)}
				>
					<DownloadIcon className={s.downloadIcon} />
				</a>
			) : (
				<button
					className={s.downloadBtnDisabled}
					type="button"
					disabled
					aria-label={t('lessonPlanFiles.downloadUnavailable')}
					onPointerDown={e => e.stopPropagation()}
				>
					<DownloadIcon className={s.downloadIcon} />
				</button>
			)}
		</div>
	)
}
