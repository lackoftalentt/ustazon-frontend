import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LessonPlanRow, QuarterId } from '../types';
import { lessonPlanMockByQuarter } from '../mock';

interface LessonPlanState {
    data: Record<QuarterId, LessonPlanRow[]>;
    selectedRows: Record<QuarterId, string[]>;

    setRows: (quarter: QuarterId, rows: LessonPlanRow[]) => void;
    reorderRows: (
        quarter: QuarterId,
        oldIndex: number,
        newIndex: number
    ) => void;
    addRow: (quarter: QuarterId, row: LessonPlanRow) => void;
    updateRow: (
        quarter: QuarterId,
        rowId: string,
        updates: Partial<LessonPlanRow>
    ) => void;
    deleteRow: (quarter: QuarterId, rowId: string) => void;
    deleteRows: (quarter: QuarterId, rowIds: string[]) => void;

    setSelectedRows: (quarter: QuarterId, rowIds: string[]) => void;
    toggleRowSelection: (quarter: QuarterId, rowId: string) => void;
    selectAllRows: (quarter: QuarterId) => void;
    clearSelection: (quarter: QuarterId) => void;

    getRowsByQuarter: (quarter: QuarterId) => LessonPlanRow[];
    resetToDefault: () => void;
}

const initialData: Record<QuarterId, LessonPlanRow[]> = {
    q1: [...lessonPlanMockByQuarter.q1],
    q2: [...lessonPlanMockByQuarter.q2],
    q3: [...lessonPlanMockByQuarter.q3],
    q4: [...lessonPlanMockByQuarter.q4]
};

const initialSelection: Record<QuarterId, string[]> = {
    q1: [],
    q2: [],
    q3: [],
    q4: []
};

export const useLessonPlanStore = create<LessonPlanState>()(
    persist(
        (set, get) => ({
            data: initialData,
            selectedRows: initialSelection,

            setRows: (quarter, rows) => {
                set(state => ({
                    data: { ...state.data, [quarter]: rows }
                }));
            },

            reorderRows: (quarter, oldIndex, newIndex) => {
                set(state => {
                    const rows = [...state.data[quarter]];
                    const [removed] = rows.splice(oldIndex, 1);
                    rows.splice(newIndex, 0, removed);

                    // Update indexes
                    const updatedRows = rows.map((row, idx) => ({
                        ...row,
                        index: idx + 1
                    }));

                    return {
                        data: { ...state.data, [quarter]: updatedRows }
                    };
                });
            },

            addRow: (quarter, row) => {
                set(state => {
                    const rows = [...state.data[quarter], row];
                    return {
                        data: { ...state.data, [quarter]: rows }
                    };
                });
            },

            updateRow: (quarter, rowId, updates) => {
                set(state => {
                    const rows = state.data[quarter].map(row =>
                        row.id === rowId ? { ...row, ...updates } : row
                    );
                    return {
                        data: { ...state.data, [quarter]: rows }
                    };
                });
            },

            deleteRow: (quarter, rowId) => {
                set(state => {
                    const rows = state.data[quarter]
                        .filter(row => row.id !== rowId)
                        .map((row, idx) => ({ ...row, index: idx + 1 }));

                    const selectedRows = state.selectedRows[quarter].filter(
                        id => id !== rowId
                    );

                    return {
                        data: { ...state.data, [quarter]: rows },
                        selectedRows: {
                            ...state.selectedRows,
                            [quarter]: selectedRows
                        }
                    };
                });
            },

            deleteRows: (quarter, rowIds) => {
                set(state => {
                    const rowIdSet = new Set(rowIds);
                    const rows = state.data[quarter]
                        .filter(row => !rowIdSet.has(row.id))
                        .map((row, idx) => ({ ...row, index: idx + 1 }));

                    const selectedRows = state.selectedRows[quarter].filter(
                        id => !rowIdSet.has(id)
                    );

                    return {
                        data: { ...state.data, [quarter]: rows },
                        selectedRows: {
                            ...state.selectedRows,
                            [quarter]: selectedRows
                        }
                    };
                });
            },

            setSelectedRows: (quarter, rowIds) => {
                set(state => ({
                    selectedRows: { ...state.selectedRows, [quarter]: rowIds }
                }));
            },

            toggleRowSelection: (quarter, rowId) => {
                set(state => {
                    const current = state.selectedRows[quarter];
                    const isSelected = current.includes(rowId);

                    return {
                        selectedRows: {
                            ...state.selectedRows,
                            [quarter]: isSelected
                                ? current.filter(id => id !== rowId)
                                : [...current, rowId]
                        }
                    };
                });
            },

            selectAllRows: quarter => {
                set(state => ({
                    selectedRows: {
                        ...state.selectedRows,
                        [quarter]: state.data[quarter].map(row => row.id)
                    }
                }));
            },

            clearSelection: quarter => {
                set(state => ({
                    selectedRows: { ...state.selectedRows, [quarter]: [] }
                }));
            },

            getRowsByQuarter: quarter => {
                return get().data[quarter];
            },

            resetToDefault: () => {
                set({
                    data: {
                        q1: [...lessonPlanMockByQuarter.q1],
                        q2: [...lessonPlanMockByQuarter.q2],
                        q3: [...lessonPlanMockByQuarter.q3],
                        q4: [...lessonPlanMockByQuarter.q4]
                    },
                    selectedRows: initialSelection
                });
            }
        }),
        {
            name: 'lesson-plan-storage'
        }
    )
);
