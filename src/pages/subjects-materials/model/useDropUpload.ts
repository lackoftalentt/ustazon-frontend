import { useCallback, useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { cardApi } from '@/entities/card/api/cardApi'
import { cardKeys } from '@/entities/card/model/useCards'
import { uploadApi } from '@/shared/api/uploadApi'

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp']
const VIDEO_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi']
const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx']

interface UseDropUploadOptions {
	windowId: number
	subjectId?: number
	enabled?: boolean
}

export const useDropUpload = ({ windowId, subjectId, enabled = false }: UseDropUploadOptions) => {
	const [isDragOver, setIsDragOver] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const dragCounter = useRef(0)
	const queryClient = useQueryClient()

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
	}, [])

	const handleDragEnter = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current++
		if (e.dataTransfer.types.includes('Files')) {
			setIsDragOver(true)
		}
	}, [])

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		dragCounter.current--
		if (dragCounter.current === 0) {
			setIsDragOver(false)
		}
	}, [])

	const handleDrop = useCallback(async (e: React.DragEvent) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragOver(false)
		dragCounter.current = 0

		const files = Array.from(e.dataTransfer.files)
		if (!files.length) return

		setIsUploading(true)
		for (const file of files) {
			try {
				const ext = file.name.split('.').pop()?.toLowerCase() || ''
				const isImage = IMAGE_EXTENSIONS.includes(ext)
				const isVideo = VIDEO_EXTENSIONS.includes(ext)
				const isDocument = DOCUMENT_EXTENSIONS.includes(ext)
				let filePath: string

				if (isImage) {
					const res = await uploadApi.uploadImage(file)
					filePath = res.file_path
				} else if (isVideo) {
					const res = await uploadApi.uploadVideo(file)
					filePath = res.file_path
				} else if (isDocument) {
					const res = await uploadApi.uploadDocument(file)
					filePath = res.file_path
				} else {
					const res = await uploadApi.uploadFile(file)
					filePath = res.file_path
				}

				const cardName = file.name.replace(/\.[^/.]+$/, '')
				await cardApi.createCard({
					name: cardName,
					window_id: windowId,
					subject_ids: subjectId ? [subjectId] : [],
					...(isImage ? { img1_url: filePath } : { url: filePath })
				})
				toast.success(`"${cardName}" сәтті қосылды`)
			} catch {
				toast.error(`"${file.name}" жүктеу кезінде қате`)
			}
		}
		setIsUploading(false)
		queryClient.invalidateQueries({ queryKey: cardKeys.all })
	}, [windowId, subjectId, queryClient])

	const dragProps = enabled
		? {
				onDragOver: handleDragOver,
				onDragEnter: handleDragEnter,
				onDragLeave: handleDragLeave,
				onDrop: handleDrop
			}
		: {}

	return { isDragOver, isUploading, dragProps }
}
