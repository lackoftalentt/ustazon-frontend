import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    type RowSelectionState,
    useReactTable
} from '@tanstack/react-table';
import type { LessonPlanRow, QuarterId } from '@/entities/lesson-plan';
import { useLessonPlanStore } from '@/entities/lesson-plan';
import { LessonPlanFilesModal } from '@/widgets/lesson-plan-files-modal';

import {
    DndContext,
    closestCenter,
    type DragEndEvent,
    useSensor,
    useSensors,
    MouseSensor,
    TouchSensor,
    KeyboardSensor
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
    SortableContext,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import s from './LessonPlanTable.module.scss';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';

type LessonPlanTableProps = { grade: string; quarter: QuarterId };

const IndeterminateCheckbox = ({
    indeterminate,
    className,
    checked,
    ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {
    indeterminate?: boolean;
}) => {
    const ref = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!ref.current) return;
        ref.current.indeterminate = false;
    }, [indeterminate, checked]);

    return (
        <input
            ref={ref}
            className={className}
            type="checkbox"
            checked={checked}
            {...rest}
        />
    );
};

const DraggableRow = ({ row }: { row: any }) => {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({ id: row.original.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.85 : 1,
        position: 'relative',
        zIndex: isDragging ? 1 : 0
    };

    return (
        <tr
            ref={setNodeRef}
            style={style}
            className={s.tr}
            {...attributes}
            {...listeners}>
            {row.getVisibleCells().map((cell: any) => (
                <td
                    key={cell.id}
                    className={s.td}
                    style={{ width: cell.column.getSize() }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
            ))}
        </tr>
    );
};

export const LessonPlanTable = ({ grade, quarter }: LessonPlanTableProps) => {
    const { data: storeData, reorderRows } = useLessonPlanStore();
    const data = storeData[quarter];

    const [filesOpen, setFilesOpen] = useState(false);
    const [activeRow, setActiveRow] = useState<LessonPlanRow | null>(null);

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const openFiles = useCallback((row: LessonPlanRow) => {
        setActiveRow(row);
        setFilesOpen(true);
    }, []);

    const closeFiles = useCallback(() => {
        setFilesOpen(false);
        setActiveRow(null);
    }, []);

    void grade;

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
                header: 'Тема урока',
                cell: info => (
                    <div className={s.topic}>{info.getValue<string>()}</div>
                )
            },
            {
                id: 'objectives',
                header: 'Цели обучения',
                cell: ({ row }) => (
                    <div className={s.objectives}>
                        {row.original.objectives.map((o, i) => (
                            <div
                                key={`${row.original.id}-${o.code}-${i}`}
                                className={s.objectiveItem}>
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
                header: 'Часы',
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
                header: 'Файлы',
                cell: ({ row }) => (
                    <button
                        type="button"
                        className={s.viewBtn}
                        onPointerDown={e => e.stopPropagation()}
                        onClick={() => openFiles(row.original)}>
                        Смотреть ({row.original.filesCount})
                    </button>
                ),
                size: 180
            },
            {
                id: 'actions',
                header: 'Действия',
                cell: () => (
                    <div
                        className={s.actions}
                        onPointerDown={e => e.stopPropagation()}>
                        <button
                            type="button"
                            className={s.iconBtn}
                            aria-label="Добавить">
                            +
                        </button>
                        <button
                            type="button"
                            className={s.iconBtn}
                            aria-label="Редактировать">
                            ✎
                        </button>
                        <button
                            type="button"
                            className={s.iconBtn}
                            aria-label="Удалить">
                            🗑
                        </button>
                    </div>
                ),
                size: 180
            }
        ],
        [openFiles]
    );

    useEffect(() => {
        setRowSelection({});
    }, [quarter]);

    const dataIds = useMemo(() => data.map(x => x.id), [data]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getRowId: row => row.id,

        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        state: { rowSelection }
    });

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 150, tolerance: 5 }
        }),
        useSensor(KeyboardSensor)
    );

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = data.findIndex(x => x.id === active.id);
        const newIndex = data.findIndex(x => x.id === over.id);
        reorderRows(quarter, oldIndex, newIndex);
    };

    return (
        <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            sensors={sensors}
            onDragEnd={onDragEnd}>
            <div className={s.root}>
                <table className={s.table}>
                    <thead className={s.thead}>
                        {table.getHeaderGroups().map(hg => (
                            <tr key={hg.id}>
                                {hg.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className={s.th}
                                        style={{ width: header.getSize() }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                  header.column.columnDef
                                                      .header,
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
                            strategy={verticalListSortingStrategy}>
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

            <LessonPlanFilesModal
                open={filesOpen}
                onClose={closeFiles}
                lessonTitle={activeRow?.topic}
                files={
                    activeRow
                        ? Array.from(
                              { length: activeRow.filesCount },
                              (_, i) => ({
                                  id: `${activeRow.id}-f${i}`,
                                  name: `Файл ${i + 1}.pdf`
                              })
                          )
                        : []
                }
            />
        </DndContext>
    );
};
