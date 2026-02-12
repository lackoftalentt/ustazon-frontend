import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import { Modal } from '@/shared/ui/modal'
import { Button } from '@/shared/ui/button'
import { useCreateCard, useUpdateCard, useCard } from '@/entities/card/model/useCards'
import { useSubjects } from '@/entities/subject/model/useSubjects'
import { subjectApi, type Window as SubjectWindow } from '@/entities/subject/api/subjectApi'
import type { CardCreate } from '@/entities/card/api/cardApi'
import { useQuery } from '@tanstack/react-query'

import s from './CardFormModal.module.scss'

interface CardFormModalProps {
  open: boolean
  onClose: () => void
  editCardId?: number | null
  defaultSubjectId?: number
  defaultWindowId?: number
}

const emptyForm: CardCreate = {
  name: '',
  description: '',
  grade: undefined,
  quarter: undefined,
  url: '',
  iframe: true,
  img1_url: '',
  window_id: undefined,
  subject_ids: [],
}

export const CardFormModal = ({
  open,
  onClose,
  editCardId,
  defaultSubjectId,
  defaultWindowId,
}: CardFormModalProps) => {
  const { t } = useTranslation()
  const [form, setForm] = useState<CardCreate>(emptyForm)

  const { data: editData } = useCard(editCardId || 0, !!editCardId && open)
  const { data: subjects = [] } = useSubjects()
  const { data: windows = [] } = useQuery({
    queryKey: ['all-windows-form'],
    queryFn: () => subjectApi.getWindows({ limit: 1000 }),
    enabled: open,
  })

  const createMutation = useCreateCard()
  const updateMutation = useUpdateCard()

  useEffect(() => {
    if (editCardId && editData) {
      setForm({
        name: editData.name,
        description: editData.description || '',
        grade: editData.grade || undefined,
        quarter: editData.quarter || undefined,
        url: editData.url || '',
        iframe: editData.iframe,
        img1_url: editData.img1_url || '',
        img2_url: editData.img2_url || '',
        img3_url: editData.img3_url || '',
        img4_url: editData.img4_url || '',
        img5_url: editData.img5_url || '',
        video1_url: editData.video1_url || '',
        window_id: editData.window_id || undefined,
        subject_ids: editData.subjects?.map(s => s.id) || [],
        topic_id: editData.topic_id || undefined,
      })
    } else if (!editCardId) {
      setForm({
        ...emptyForm,
        subject_ids: defaultSubjectId ? [defaultSubjectId] : [],
        window_id: defaultWindowId || undefined,
      })
    }
  }, [editCardId, editData, defaultSubjectId, defaultWindowId])

  const handleSubmit = () => {
    if (!form.name) {
      toast.error(t('admin.fillRequired'))
      return
    }

    const data = { ...form }
    // Clean empty strings
    if (!data.url) delete data.url
    if (!data.img1_url) delete data.img1_url
    if (!data.description) delete data.description

    if (editCardId) {
      updateMutation.mutate(
        { id: editCardId, data },
        {
          onSuccess: () => {
            toast.success(t('admin.updated'))
            onClose()
          },
          onError: () => toast.error(t('admin.updateError')),
        }
      )
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          toast.success(t('admin.created'))
          onClose()
        },
        onError: () => toast.error(t('admin.createError')),
      })
    }
  }

  const toggleSubject = (id: number) => {
    setForm(prev => {
      const arr = prev.subject_ids || []
      return {
        ...prev,
        subject_ids: arr.includes(id)
          ? arr.filter(x => x !== id)
          : [...arr, id],
      }
    })
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editCardId ? t('admin.edit') : t('admin.add')}>
      <div className={s.form}>
        <div className={s.formGroup}>
          <label>{t('admin.fields.name')} *</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className={s.formGroup}>
          <label>Сипаттама / Описание</label>
          <textarea
            rows={3}
            value={form.description || ''}
            onChange={e => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className={s.row}>
          <div className={s.formGroup}>
            <label>Сынып / Класс</label>
            <select
              value={form.grade || ''}
              onChange={e =>
                setForm({
                  ...form,
                  grade: e.target.value ? Number(e.target.value) : undefined,
                })
              }>
              <option value="">—</option>
              {Array.from({ length: 11 }, (_, i) => i + 1).map(g => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div className={s.formGroup}>
            <label>Тоқсан / Четверть</label>
            <select
              value={form.quarter || ''}
              onChange={e =>
                setForm({
                  ...form,
                  quarter: e.target.value ? Number(e.target.value) : undefined,
                })
              }>
              <option value="">—</option>
              {[1, 2, 3, 4].map(q => (
                <option key={q} value={q}>
                  {q}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={s.formGroup}>
          <label>Терезе / Окно</label>
          <select
            value={form.window_id || ''}
            onChange={e =>
              setForm({
                ...form,
                window_id: e.target.value ? Number(e.target.value) : undefined,
              })
            }>
            <option value="">—</option>
            {windows.map((w: SubjectWindow) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className={s.formGroup}>
          <label>URL (сілтеме)</label>
          <input
            value={form.url || ''}
            onChange={e => setForm({ ...form, url: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className={s.checkboxGroup}>
          <input
            type="checkbox"
            id="iframe-check"
            checked={form.iframe ?? true}
            onChange={e => setForm({ ...form, iframe: e.target.checked })}
          />
          <label htmlFor="iframe-check">Iframe</label>
        </div>

        <div className={s.formGroup}>
          <label>{t('admin.fields.imageUrl')} (img1)</label>
          <input
            value={form.img1_url || ''}
            onChange={e => setForm({ ...form, img1_url: e.target.value })}
            placeholder="https://..."
          />
        </div>

        <div className={s.formGroup}>
          <label>{t('admin.fields.subjects')}</label>
          <div className={s.multiSelect}>
            {subjects.map(subj => (
              <button
                key={subj.id}
                type="button"
                className={`${s.chip} ${
                  form.subject_ids?.includes(subj.id) ? s.chipSelected : ''
                }`}
                onClick={() => toggleSubject(subj.id)}>
                {subj.name}
              </button>
            ))}
          </div>
        </div>

        <div className={s.formActions}>
          <Button variant="outline" size="sm" onClick={onClose}>
            {t('admin.cancel')}
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={isLoading}>
            {editCardId ? t('admin.save') : t('admin.add')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
