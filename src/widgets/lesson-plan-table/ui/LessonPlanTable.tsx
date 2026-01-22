import { useKmzhByQuarter, kmzhApi, type KmzhItem } from '@/entities/kmzh'
import type { LessonPlanRow, QuarterId } from '@/entities/lesson-plan'
import { AddFilesModal, useAddFilesStore } from '@/features/add-files-kmzh'
import { CreateKMZHModal, useCreateKMZHStore } from '@/features/create-kmzh'
import {
	EditKMJModal,
	useEditKMJStore,
	type KMJData
} from '@/features/edit-kmzh'
import { ConfirmModal } from '@/shared/ui/confirm-modal'
import { LessonPlanFilesModal } from '@/widgets/lesson-plan-files-modal'
import {
	flexRender,
	getCoreRowModel,
	useReactTable,
	type ColumnDef,
	type RowSelectionState
} from '@tanstack/react-table'
import toast from 'react-hot-toast'

import {
	DndContext,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	closestCenter,
	useSensor,
	useSensors,
	type DragEndEvent
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
	SortableContext,
	useSortable,
	verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { Button } from '@/shared/ui/button'
import { EmptyState } from '@/shared/ui/empty-state'
import { Loader } from '@/shared/ui/loader'
import { SearchInput } from '@/shared/ui/search-input'
import { Plus } from 'lucide-react'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import s from './LessonPlanTable.module.scss'

type LessonPlanTableProps = {
	grade: string
	quarter: QuarterId
	code?: string
}

const mapKmzhToLessonPlan = (kmzh: KmzhItem, index: number): LessonPlanRow => ({
	id: String(kmzh.id),
	index: index + 1,
	topic: kmzh.title,
	objectives: [{ code: kmzh.code, text: '' }],
	hours: kmzh.hour,
	author: `Автор #${kmzh.author_id}`,
	filesCount: kmzh.files_count
})

const quarterToNum = (q: QuarterId): number => {
	const map: Record<QuarterId, number> = { q1: 1, q2: 2, q3: 3, q4: 4 }
	return map[q]
}

const IndeterminateCheckbox = ({
	indeterminate,
	className,
	checked,
	...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
	indeterminate?: boolean
}) => {
	const ref = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (!ref.current) return
		ref.current.indeterminate = false
	}, [indeterminate, checked])

	return (
		<input
			ref={ref}
			className={className}
			type="checkbox"
			checked={checked}
			{...rest}
		/>
	)
}

const DraggableRow = ({ row }: { row: any }) => {
	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
		isDragging
	} = useSortable({ id: row.original.id })

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.85 : 1,
		position: 'relative',
		zIndex: isDragging ? 1 : 0
	}

	return (
		<tr
			ref={setNodeRef}
			style={style}
			className={s.tr}
			{...attributes}
			{...listeners}
		>
			{row.getVisibleCells().map((cell: any) => (
				<td
					key={cell.id}
					className={s.td}
				>
					{flexRender(cell.column.columnDef.cell, cell.getContext())}
				</td>
			))}
		</tr>
	)
}

export const LessonPlanTable = ({
	grade,
	quarter,
	code
}: LessonPlanTableProps) => {
	const gradeNum = parseInt(grade)
	const quarterNum = quarterToNum(quarter)

	const { data: apiData, isLoading } = useKmzhByQuarter(
		quarterNum,
		{ grade: gradeNum, code },
		true
	)

	const [localData, setLocalData] = useState<LessonPlanRow[]>([])
	const [searchQuery, setSearchQuery] = useState('')

	useEffect(() => {
		if (apiData) {
			setLocalData(apiData.map((item, idx) => mapKmzhToLessonPlan(item, idx)))
		}
	}, [apiData])

	const filteredData = useMemo(() => {
		if (!searchQuery.trim()) return localData
		const query = searchQuery.toLowerCase()
		return localData.filter(
			row =>
				row.topic.toLowerCase().includes(query) ||
				row.objectives.some(o => o.code.toLowerCase().includes(query))
		)
	}, [localData, searchQuery])

	const data = filteredData

	const reorderRows = (
		_quarter: QuarterId,
		oldIndex: number,
		newIndex: number
	) => {
		setLocalData(prev => {
			const rows = [...prev]
			const [removed] = rows.splice(oldIndex, 1)
			rows.splice(newIndex, 0, removed)
			return rows.map((row, idx) => ({ ...row, index: idx + 1 }))
		})
	}

	const [filesOpen, setFilesOpen] = useState(false)
	const [activeRow, setActiveRow] = useState<LessonPlanRow | null>(null)
	const [deleteRow, setDeleteRow] = useState<LessonPlanRow | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const { openModal: openAddFilesModal } = useAddFilesStore()
	const { openModal: openEditKMJModal } = useEditKMJStore()
	const { openModal: openCreateKMZHModal } = useCreateKMZHStore()

	const openFiles = useCallback((row: LessonPlanRow) => {
		setActiveRow(row)
		setFilesOpen(true)
	}, [])

	const closeFiles = useCallback(() => {
		setFilesOpen(false)
		setActiveRow(null)
	}, [])

	const handleAddFiles = useCallback(
		(rowId: string) => {
			openAddFilesModal(rowId)
		},
		[openAddFilesModal]
	)

	const handleEditKMJ = useCallback(
		async (row: LessonPlanRow) => {
			try {
				const detail = await kmzhApi.getKmzhById(parseInt(row.id))

				const gradeToClassLevel = (grade: number): string => `${grade}-сынып`
				const quarterToString = (q: number): string => `${q} тоқсан`

				const kmjData: KMJData = {
					id: row.id,
					title: detail.title,
					classLevel: gradeToClassLevel(detail.grade),
					quarter: quarterToString(detail.quarter),
					subjectCode: detail.code,
					hours: detail.hour,
					lessonTopic: detail.title,
					learningObjectives: detail.text,
					existingAdditionalFiles: detail.files.map(f => ({
						id: String(f.id),
						name: f.file.split('/').pop() || f.file,
						size: f.file_size_formatted,
						path: f.file,
						file_size: f.file_size,
						file_type: f.file_type
					})),
					subjects: [],
					institutionType: 'Мектеп',
					mainFile: detail.file || undefined
				}
				openEditKMJModal(kmjData)
			} catch {
				toast.error('Деректерді жүктеу кезінде қате орын алды')
			}
		},
		[openEditKMJModal]
	)

	const handleDeleteClick = useCallback((row: LessonPlanRow) => {
		setDeleteRow(row)
	}, [])

	const handleDeleteConfirm = useCallback(async () => {
		if (!deleteRow) return

		setIsDeleting(true)
		try {
			console.log('Deleting row:', deleteRow.id)
			toast.success('Сабақ жоспары сәтті жойылды!')
			setDeleteRow(null)
		} catch {
			toast.error('Жою кезінде қате орын алды')
		} finally {
			setIsDeleting(false)
		}
	}, [deleteRow])

	const handleDeleteCancel = useCallback(() => {
		setDeleteRow(null)
	}, [])

	const columns = useMemo<ColumnDef<LessonPlanRow>[]>(
		() => [
			{
				id: 'select',
				header: ({ table }) => (
					<IndeterminateCheckbox
						className={s.checkbox}
						checked={table.getIsAllRowsSelected()}
						indeterminate={table.getIsSomeRowsSelected()}
						onChange={table.getToggleAllRowsSelectedHandler()}
						onPointerDown={e => e.stopPropagation()}
					/>
				),
				cell: ({ row }) => (
					<input
						className={s.checkbox}
						type="checkbox"
						checked={row.getIsSelected()}
						disabled={!row.getCanSelect()}
						onChange={row.getToggleSelectedHandler()}
						onPointerDown={e => e.stopPropagation()}
					/>
				),
				size: 50
			},
			{
				id: 'index',
				accessorKey: 'index',
				header: '№',
				size: 80
			},
			{
				id: 'topic',
				accessorKey: 'topic',
				header: 'Сабақ тақырыбы',
				cell: info => <div className={s.topic}>{info.getValue<string>()}</div>
			},
			{
				id: 'objectives',
				header: 'Оқыту мақсаттары',
				cell: ({ row }) => (
					<div className={s.objectives}>
						{row.original.objectives.map((o, i) => (
							<div
								key={`${row.original.id}-${o.code}-${i}`}
								className={s.objectiveItem}
							>
								<div className={s.objectiveCode}>{o.code}</div>
								<div className={s.objectiveText}>{o.text}</div>
							</div>
						))}
					</div>
				)
			},
			{
				id: 'hours',
				accessorKey: 'hours',
				header: 'Сағат',
				size: 80
			},
			{
				id: 'author',
				accessorKey: 'author',
				header: 'Автор',
				size: 140
			},
			{
				id: 'files',
				header: 'Файлдар',
				cell: ({ row }) => (
					<button
						type="button"
						className={s.viewBtn}
						onPointerDown={e => e.stopPropagation()}
						onClick={() => openFiles(row.original)}
					>
						Көру ({row.original.filesCount})
					</button>
				),
				size: 180
			},
			{
				id: 'actions',
				header: 'Әрекеттер',
				cell: ({ row }) => (
					<div
						className={s.actions}
						onPointerDown={e => e.stopPropagation()}
					>
						<button
							type="button"
							className={s.iconBtn}
							aria-label="Қосу"
							onClick={() => handleAddFiles(row.original.id)}
						>
							+
						</button>
						<button
							type="button"
							className={s.iconBtn}
							onClick={() => handleEditKMJ(row.original)}
							aria-label="Өңдеу"
						>
							✎
						</button>
						<button
							type="button"
							className={s.iconBtn}
							aria-label="Жою"
							onClick={() => handleDeleteClick(row.original)}
						>
							🗑
						</button>
					</div>
				),
				size: 180
			}
		],
		[openFiles, handleAddFiles, handleEditKMJ, handleDeleteClick]
	)

	useEffect(() => {
		setRowSelection({})
	}, [quarter])

	const dataIds = useMemo(() => data.map(x => x.id), [data])

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getRowId: row => row.id,

		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
		state: { rowSelection }
	})

	const sensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 150, tolerance: 5 }
		}),
		useSensor(KeyboardSensor)
	)

	const onDragEnd = (event: DragEndEvent) => {
		const { active, over } = event
		if (!over || active.id === over.id) return

		const oldIndex = data.findIndex(x => x.id === active.id)
		const newIndex = data.findIndex(x => x.id === over.id)
		reorderRows(quarter, oldIndex, newIndex)
	}

	const handleClearSearch = useCallback(() => {
		setSearchQuery('')
	}, [])

	if (isLoading) {
		return <Loader />
	}

	return (
		<DndContext
			collisionDetection={closestCenter}
			modifiers={[restrictToVerticalAxis]}
			sensors={sensors}
			onDragEnd={onDragEnd}
		>
			<div className={s.toolbar}>
				<SearchInput
					className={s.searchInput}
					placeholder="Сабақ тақырыбы бойынша іздеу..."
					value={searchQuery}
					onChange={e => setSearchQuery(e.target.value)}
				/>
				<Button
					variant="primary"
					onClick={openCreateKMZHModal}
					className={s.createBtn}
				>
					<Plus size={18} />
					ҚМЖ қосу
				</Button>
			</div>

			{!data.length ? (
				<EmptyState
					search={searchQuery}
					handleClearSearch={handleClearSearch}
				/>
			) : (
				<div className={s.root}>
					<table className={s.table}>
						<thead className={s.thead}>
							{table.getHeaderGroups().map(hg => (
								<tr key={hg.id}>
									{hg.headers.map(header => (
										<th
											key={header.id}
											className={s.th}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
										</th>
									))}
								</tr>
							))}
						</thead>

						<tbody className={s.tbody}>
							<SortableContext
								items={dataIds}
								strategy={verticalListSortingStrategy}
							>
								{table.getRowModel().rows.map(row => (
									<DraggableRow
										key={row.id}
										row={row}
									/>
								))}
							</SortableContext>
						</tbody>
					</table>
				</div>
			)}

			<LessonPlanFilesModal
				open={filesOpen}
				onClose={closeFiles}
				lessonTitle={activeRow?.topic}
				files={
					activeRow
						? Array.from({ length: activeRow.filesCount }, (_, i) => ({
								id: `${activeRow.id}-f${i}`,
								name: `Файл ${i + 1}.pdf`
							}))
						: []
				}
			/>

			<AddFilesModal />
			<EditKMJModal />
			<CreateKMZHModal />

			<ConfirmModal
				open={!!deleteRow}
				onClose={handleDeleteCancel}
				onConfirm={handleDeleteConfirm}
				title="Сабақ жоспарын жою"
				message={`"${deleteRow?.topic}" сабақ жоспарын жойғыңыз келетініне сенімдісіз бе? Бұл әрекетті қайтару мүмкін емес.`}
				confirmText="Жою"
				cancelText="Бас тарту"
				variant="danger"
				loading={isDeleting}
			/>
		</DndContext>
	)
}
