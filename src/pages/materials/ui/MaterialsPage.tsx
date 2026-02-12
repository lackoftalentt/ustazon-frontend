import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Navigate } from 'react-router-dom'

import { useAuthStore } from '@/entities/user'
import {
  teachingMaterialsApi,
  type TeachingMaterial,
} from '@/shared/api/teachingMaterialsApi'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import { SearchInput } from '@/shared/ui/search-input'
import { SectionTitle } from '@/shared/ui/section-title'
import { ConfirmModal } from '@/shared/ui/confirm-modal'
import { Loader } from '@/shared/ui/loader'
import { EmptyState } from '@/shared/ui/empty-state/ui/EmptyState'

import s from './MaterialsPage.module.scss'

const MATERIAL_TYPE_LABELS: Record<string, { kk: string; ru: string }> = {
  lesson_plan: { kk: 'Сабақ жоспары', ru: 'План урока' },
  test: { kk: 'Тест', ru: 'Тест' },
  homework: { kk: 'Үй тапсырмасы', ru: 'Домашнее задание' },
  rubric: { kk: 'Рубрика', ru: 'Рубрика' },
  presentation: { kk: 'Презентация', ru: 'Презентация' },
  lesson: { kk: 'Сабақ', ru: 'Урок' },
  qmj: { kk: 'ҚМЖ', ru: 'КСП' },
}

const DIFFICULTY_LABELS: Record<string, { kk: string; ru: string }> = {
  easy: { kk: 'Жеңіл', ru: 'Лёгкий' },
  medium: { kk: 'Орташа', ru: 'Средний' },
  hard: { kk: 'Қиын', ru: 'Сложный' },
  mixed: { kk: 'Аралас', ru: 'Смешанный' },
}

const PAGE_SIZE = 20

export const MaterialsPage = () => {
  const { t, i18n } = useTranslation()
  const { isAdmin } = useAuthStore()
  const queryClient = useQueryClient()
  const lang = i18n.language === 'ru' ? 'ru' : 'kk'

  if (!isAdmin()) {
    return <Navigate to="/" replace />
  }

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('')
  const [page, setPage] = useState(0)
  const [deleteItem, setDeleteItem] = useState<TeachingMaterial | null>(null)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-materials', typeFilter, page],
    queryFn: () =>
      teachingMaterialsApi.getAll({
        material_type: typeFilter || undefined,
        skip: page * PAGE_SIZE,
        limit: PAGE_SIZE,
      }),
  })

  const materials = data?.items || []
  const total = data?.total || 0
  const totalPages = Math.ceil(total / PAGE_SIZE)

  const deleteMutation = useMutation({
    mutationFn: (id: number) => teachingMaterialsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-materials'] })
      toast.success(t('admin.deleted'))
      setDeleteItem(null)
    },
    onError: () => toast.error(t('admin.deleteError')),
  })

  const filtered = useMemo(() => {
    if (!search) return materials
    const q = search.toLowerCase()
    return materials.filter(
      m =>
        m.title.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.topic.toLowerCase().includes(q) ||
        m.grade.toLowerCase().includes(q)
    )
  }, [materials, search])

  const getTypeLabel = (type: string) =>
    MATERIAL_TYPE_LABELS[type]?.[lang] || type

  const getDifficultyLabel = (d: string | null) =>
    d ? DIFFICULTY_LABELS[d]?.[lang] || d : '—'

  const formatDate = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString(lang === 'kk' ? 'kk-KZ' : 'ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  return (
    <main className={s.page}>
      <Container>
        <div className={s.header}>
          <SectionTitle
            title={lang === 'kk' ? `Оқу материалдары (${total})` : `Учебные материалы (${total})`}
          />
        </div>

        <div className={s.toolbar}>
          <SearchInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t('admin.searchPlaceholder')}
          />
          <select
            className={s.typeFilter}
            value={typeFilter}
            onChange={e => {
              setTypeFilter(e.target.value)
              setPage(0)
            }}>
            <option value="">{lang === 'kk' ? 'Барлық түрлер' : 'Все типы'}</option>
            {Object.entries(MATERIAL_TYPE_LABELS).map(([key, labels]) => (
              <option key={key} value={key}>
                {labels[lang]}
              </option>
            ))}
          </select>
        </div>

        {isLoading && <Loader />}

        {isError && (
          <EmptyState
            search={lang === 'kk' ? 'Қате орын алды' : 'Произошла ошибка'}
            handleClearSearch={() => { refetch() }}
          />
        )}

        {!isLoading && !isError && filtered.length === 0 && (
          <EmptyState
            search={search}
            handleClearSearch={() => setSearch('')}
          />
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <div className={s.tableWrapper}>
              <table className={s.table}>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>{lang === 'kk' ? 'Түрі' : 'Тип'}</th>
                    <th>{t('admin.fields.name')}</th>
                    <th>{lang === 'kk' ? 'Пән' : 'Предмет'}</th>
                    <th>{lang === 'kk' ? 'Сынып' : 'Класс'}</th>
                    <th>{lang === 'kk' ? 'Тақырып' : 'Тема'}</th>
                    <th>{lang === 'kk' ? 'Күрделілік' : 'Сложность'}</th>
                    <th>{lang === 'kk' ? 'AI модель' : 'AI модель'}</th>
                    <th>User ID</th>
                    <th>{lang === 'kk' ? 'Файл' : 'Файл'}</th>
                    <th>{t('admin.fields.createdAt')}</th>
                    <th>{t('admin.fields.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(m => (
                    <tr key={m.id}>
                      <td>{m.id}</td>
                      <td>
                        <span className={s.typeBadge}>{getTypeLabel(m.material_type)}</span>
                      </td>
                      <td className={s.titleCell}>{m.title}</td>
                      <td>{m.subject}</td>
                      <td>{m.grade}</td>
                      <td className={s.topicCell}>{m.topic}</td>
                      <td>{getDifficultyLabel(m.difficulty_level)}</td>
                      <td>{m.ai_model || '—'}</td>
                      <td>{m.user_id}</td>
                      <td>
                        {m.file_url ? (
                          <a href={m.file_url} target="_blank" rel="noreferrer" className={s.fileLink}>
                            {lang === 'kk' ? 'Жүктеу' : 'Скачать'}
                          </a>
                        ) : m.gamma_url ? (
                          <a href={m.gamma_url} target="_blank" rel="noreferrer" className={s.fileLink}>
                            Gamma
                          </a>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td>{formatDate(m.created_at)}</td>
                      <td>
                        <button
                          className={s.deleteBtn}
                          onClick={() => setDeleteItem(m)}>
                          {t('admin.delete')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className={s.pagination}>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}>
                  &larr;
                </Button>
                <span className={s.pageInfo}>
                  {page + 1} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}>
                  &rarr;
                </Button>
              </div>
            )}
          </>
        )}

        <ConfirmModal
          open={!!deleteItem}
          onClose={() => setDeleteItem(null)}
          onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
          title={t('admin.confirmDelete')}
          message={t('admin.confirmDeleteMessage', { name: deleteItem?.title })}
          confirmText={t('admin.delete')}
          cancelText={t('admin.cancel')}
          loading={deleteMutation.isPending}
        />
      </Container>
    </main>
  )
}

export default MaterialsPage
