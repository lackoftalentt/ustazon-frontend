import type { CardDetailResponse } from '@/entities/card/api/cardApi'
import { extractHref } from '@/shared/lib/extractHref'
import { extractIframeSrc } from '@/shared/lib/extractIframeSrc'
import { isGeoGebra, normalizeGeoGebra } from '@/shared/lib/geoGebraUtils'
import { Button } from '@/shared/ui/button'
import { IFrameEmbed } from '@/widgets/iframe-embed/ui/IFrameEmbed'
import { PresentationViewer } from '@/widgets/presentation-viewer'
import { SubjectDetailPlayer } from '@/widgets/subject-detail-player/ui/SubjectDetailPlayer'
import { TryEmbedUrl } from '@/widgets/try-embed-url/ui/TryEmbedUrl'
import { ExternalLink } from 'lucide-react'
import { useEffect } from 'react'

import s from './ContentViewer.module.scss'

interface ContentViewerProps {
	lesson: CardDetailResponse
}

const ExternalLinkOpener = ({ href }: { href: string | null }) => {
	useEffect(() => {
		if (href) window.open(href, '_blank', 'noopener,noreferrer')
	}, [href])

	return (
		<div className={s.openedNotice}>
			<div className={s.iconWrapper}>
				<ExternalLink className={s.icon} />
			</div>
			<h3 className={s.title}>Материал сәтті ашылды</h3>
			<p className={s.description}>
				Материал жаңа қойындыда ашылды. Егер ол автоматты түрде ашылмаса, төмендегі батырманы басыңыз.
			</p>
			<Button
				className={s.button}
				onClick={() => window.open(href ?? '', '_blank', 'noopener,noreferrer')}
			>
				<ExternalLink size={18} />
				Қайта ашу
			</Button>
		</div>
	)
}

const isPresentationWindow = (l: CardDetailResponse) =>
	[7, 8, 9, 10, 11].includes(l?.window_id ?? 0)

const isPresentationFile = (file: string) =>
	file.endsWith('.pdf') || file.endsWith('.ppt') || file.endsWith('.pptx')

const isUrl = (str: string) =>
	str.startsWith('http://') || str.startsWith('https://')

const isYouTube = (str: string) =>
	str.includes('youtube.com') || str.includes('youtu.be')

const normalizeUrl = (raw?: string | null) => {
	if (!raw) return null
	const trimmed = raw.trim()
	if (
		trimmed === '' ||
		trimmed === 'None' ||
		trimmed === 'null' ||
		trimmed === 'undefined'
	) {
		return null
	}
	return trimmed
}

export const ContentViewer = ({ lesson }: ContentViewerProps) => {
	const url = normalizeUrl(lesson.url)

	// 1. PDF/PPT по window_id
	if (isPresentationWindow(lesson)) {
		const fileUrl = lesson.file_path || url || ''
		if (!fileUrl) {
			// Fallback to URL viewer if file_path and url are empty
			if (url) {
				return <TryEmbedUrl url={url} />
			}
			return <SubjectDetailPlayer url={url ?? ''} />
		}
		return (
			<PresentationViewer
				fileUrl={fileUrl}
				fileName={lesson.name}
			/>
		)
	}

	// 2. PDF/PPT по file extension
	if (lesson.file_path && isPresentationFile(lesson.file_path)) {
		return (
			<PresentationViewer
				fileUrl={lesson.file_path}
				fileName={lesson.name}
			/>
		)
	}

	// 3. <iframe>
	if (url?.startsWith('<iframe')) {
		const src = extractIframeSrc(url)
		return src ? <IFrameEmbed src={src} /> : null
	}

	// 4. <a>
	if (url?.startsWith('<a ')) {
		const href = extractHref(url)
		return <ExternalLinkOpener href={href} />
	}

	// 5. GeoGebra / Desmos plain URL
	if (typeof url === 'string' && isGeoGebra(url)) {
		const normalized = normalizeGeoGebra(url)
		return <IFrameEmbed src={normalized} />
	}

	// 6. YouTube
	if (typeof url === 'string' && isYouTube(url)) {
		return <SubjectDetailPlayer url={url} />
	}

	// 7. plain external URL → TryEmbed (с fallback кнопкой для открытия в новой вкладке)
	if (typeof url === 'string' && isUrl(url)) {
		return <TryEmbedUrl url={url} />
	}

	// 8. fallback → VideoPlayer
	return <SubjectDetailPlayer url={url ?? ''} />
}
