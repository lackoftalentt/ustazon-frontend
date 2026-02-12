import s from '../SubjectsMaterialsPage.module.scss'

interface DropOverlayProps {
	isDragOver: boolean
	isUploading: boolean
}

export const DropOverlay = ({ isDragOver, isUploading }: DropOverlayProps) => {
	return (
		<>
			{isDragOver && (
				<div className={s.dropOverlay}>
					<svg className={s.dropIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="17 8 12 3 7 8" />
						<line x1="12" y1="3" x2="12" y2="15" />
					</svg>
					<span className={s.dropText}>Файлды осында тастаңыз</span>
				</div>
			)}

			{isUploading && (
				<div className={s.uploadingOverlay}>
					<div className={s.uploadSpinner} />
					<span className={s.uploadText}>Жүктелуде...</span>
				</div>
			)}
		</>
	)
}
