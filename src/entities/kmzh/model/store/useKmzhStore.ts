import { create } from 'zustand'
import type { LessonPlanRow, QuarterId } from '@/entities/lesson-plan'
import type { KmzhItem } from '../../api/kmzhApi'

interface KmzhState {
	data: Record<QuarterId, LessonPlanRow[]>
	selectedRows: Record<QuarterId, string[]>

	setRowsFromApi: (quarter: QuarterId, kmzhItems: KmzhItem[]) => void
	reorderRows: (quarter: QuarterId, oldIndex: number, newIndex: number) => void

	setSelectedRows: (quarter: QuarterId, rowIds: string[]) => void
	toggleRowSelection: (quarter: QuarterId, rowId: string) => void
	selectAllRows: (quarter: QuarterId) => void
	clearSelection: (quarter: QuarterId) => void
}

const initialData: Record<QuarterId, LessonPlanRow[]> = {
	q1: [],
	q2: [],
	q3: [],
	q4: []
}

const initialSelection: Record<QuarterId, string[]> = {
	q1: [],
	q2: [],
	q3: [],
	q4: []
}

// Преобразование KmzhItem в LessonPlanRow
const mapKmzhToLessonPlan = (kmzh: KmzhItem, index: number): LessonPlanRow => ({
	id: String(kmzh.id),
	index: index + 1,
	topic: kmzh.title,
	objectives: [{ code: kmzh.code, text: '' }],
	hours: kmzh.hour,
	author: `Автор #${kmzh.author_id}`,
	filesCount: kmzh.files_count
})

export const useKmzhStore = create<KmzhState>()((set) => ({
	data: initialData,
	selectedRows: initialSelection,

	setRowsFromApi: (quarter, kmzhItems) => {
		const rows = kmzhItems.map((item, idx) => mapKmzhToLessonPlan(item, idx))
		set(state => ({
			data: { ...state.data, [quarter]: rows }
		}))
	},

	reorderRows: (quarter, oldIndex, newIndex) => {
		set(state => {
			const rows = [...state.data[quarter]]
			const [removed] = rows.splice(oldIndex, 1)
			rows.splice(newIndex, 0, removed)

			const updatedRows = rows.map((row, idx) => ({
				...row,
				index: idx + 1
			}))

			return {
				data: { ...state.data, [quarter]: updatedRows }
			}
		})
	},

	setSelectedRows: (quarter, rowIds) => {
		set(state => ({
			selectedRows: { ...state.selectedRows, [quarter]: rowIds }
		}))
	},

	toggleRowSelection: (quarter, rowId) => {
		set(state => {
			const current = state.selectedRows[quarter]
			const isSelected = current.includes(rowId)

			return {
				selectedRows: {
					...state.selectedRows,
					[quarter]: isSelected
						? current.filter(id => id !== rowId)
						: [...current, rowId]
				}
			}
		})
	},

	selectAllRows: quarter => {
		set(state => ({
			selectedRows: {
				...state.selectedRows,
				[quarter]: state.data[quarter].map(row => row.id)
			}
		}))
	},

	clearSelection: quarter => {
		set(state => ({
			selectedRows: { ...state.selectedRows, [quarter]: [] }
		}))
	}
}))
