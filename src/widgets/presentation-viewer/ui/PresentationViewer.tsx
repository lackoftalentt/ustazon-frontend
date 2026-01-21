import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'
import '@cyntler/react-doc-viewer/dist/index.css'
import { useCallback, useEffect, useRef, useState } from 'react'
import s from './PresentationViewer.module.scss'

interface PresentationViewerProps {
	fileUrl: string
	fileName?: string
	className?: string
}

export const PresentationViewer = ({
	fileUrl,
	fileName,
	className
}: PresentationViewerProps) => {
	const containerRef = useRef<HTMLDivElement>(null)
	const [isFullscreen, setIsFullscreen] = useState(false)

	const toggleFullscreen = useCallback(() => {
		if (!containerRef.current) return

		if (!document.fullscreenElement) {
			containerRef.current.requestFullscreen()
		} else {
			document.exitFullscreen()
		}
	}, [])

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement)
		}

		document.addEventListener('fullscreenchange', handleFullscreenChange)
		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange)
		}
	}, [])

	// Формируем абсолютный URL если передан относительный путь
	const getAbsoluteUrl = (url: string): string => {
		if (!url) return ''
		if (url.startsWith('http://') || url.startsWith('https://')) {
			return url
		}
		// Добавляем базовый URL API
		const baseUrl = import.meta.env.VITE_API_URL || window.location.origin
		return `${baseUrl}/${url.replace(/^\//, '')}`
	}

	const absoluteUrl = getAbsoluteUrl(fileUrl)

	const getFileType = (url: string): string | undefined => {
		const ext = url.split('.').pop()?.toLowerCase()
		return ext
	}

	if (!fileUrl) {
		return (
			<div className={`${s.presentationViewer} ${className || ''}`}>
				<div className={s.emptyState}>
					<svg
						width="64"
						height="64"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
						<polyline points="14 2 14 8 20 8" />
						<line
							x1="12"
							y1="18"
							x2="12"
							y2="12"
						/>
						<line
							x1="9"
							y1="15"
							x2="15"
							y2="15"
						/>
					</svg>
					<p>Файл не найден</p>
				</div>
			</div>
		)
	}

	const documents = [
		{
			uri: absoluteUrl,
			fileName: fileName || 'document',
			fileType: getFileType(absoluteUrl)
		}
	]

	return (
		<div
			ref={containerRef}
			className={`${s.presentationViewer} ${isFullscreen ? s.fullscreen : ''} ${
				className || ''
			}`}
		>
			<button
				className={s.fullscreenButton}
				onClick={toggleFullscreen}
				title={
					isFullscreen
						? 'Выйти из полноэкранного режима'
						: 'Полноэкранный режим'
				}
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					{isFullscreen ? (
						<path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
					) : (
						<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
					)}
				</svg>
			</button>

			<button
				className={s.downloadButton}
				onClick={() => window.open(absoluteUrl, '_blank')}
				title="Скачать файл"
			>
				<svg
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
				>
					<path d="M12 3v12m0 0l4-4m-4 4l-4-4" />
					<path d="M5 19h14" />
				</svg>
			</button>

			<DocViewer
				documents={documents}
				pluginRenderers={DocViewerRenderers}
				config={{
					header: {
						disableHeader: false,
						disableFileName: false,
						retainURLParams: false
					},
					pdfVerticalScrollByDefault: true
				}}
				style={{ height: '100%', width: '100%' }}
			/>
		</div>
	)
}
