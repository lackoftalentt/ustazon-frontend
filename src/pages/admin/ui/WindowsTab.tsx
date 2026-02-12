import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import {
    subjectApi,
    type Window,
    type WindowCreate,
    type WindowUpdate,
    type Template,
    type Subject,
} from '@/entities/subject/api/subjectApi';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { SearchInput } from '@/shared/ui/search-input';
import { Loader } from '@/shared/ui/loader';
import s from './AdminPage.module.scss';

export const WindowsTab = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<Window | null>(null);
    const [deleteItem, setDeleteItem] = useState<Window | null>(null);

    const [form, setForm] = useState<WindowCreate>({
        name: '',
        template_id: null,
        link: '',
        nsub: false,
        image_url: '',
        image_file: '',
        subject_ids: [],
    });

    const { data: windows = [], isLoading } = useQuery({
        queryKey: ['admin-windows'],
        queryFn: () => subjectApi.getWindows({ limit: 1000 }),
    });

    const { data: templates = [] } = useQuery({
        queryKey: ['admin-templates'],
        queryFn: () => subjectApi.getTemplates({ limit: 1000 }),
    });

    const { data: subjects = [] } = useQuery({
        queryKey: ['admin-subjects'],
        queryFn: () => subjectApi.getSubjects({ limit: 1000 }),
    });

    const createMutation = useMutation({
        mutationFn: (data: WindowCreate) => subjectApi.createWindow(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-windows'] });
            toast.success(t('admin.created'));
            closeModal();
        },
        onError: () => toast.error(t('admin.createError')),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: WindowUpdate }) =>
            subjectApi.updateWindow(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-windows'] });
            toast.success(t('admin.updated'));
            closeModal();
        },
        onError: () => toast.error(t('admin.updateError')),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => subjectApi.deleteWindow(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-windows'] });
            toast.success(t('admin.deleted'));
            setDeleteItem(null);
        },
        onError: () => toast.error(t('admin.deleteError')),
    });

    const filtered = useMemo(() => {
        if (!search) return windows;
        const q = search.toLowerCase();
        return windows.filter(w => w.name.toLowerCase().includes(q));
    }, [windows, search]);

    const openCreate = () => {
        setEditItem(null);
        setForm({
            name: '',
            template_id: null,
            link: '',
            nsub: false,
            image_url: '',
            image_file: '',
            subject_ids: [],
        });
        setModalOpen(true);
    };

    const openEdit = (item: Window) => {
        setEditItem(item);
        setForm({
            name: item.name,
            template_id: item.template_id,
            link: item.link || '',
            nsub: item.nsub,
            image_url: item.image_url || '',
            image_file: item.image_file || '',
            subject_ids: [],
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditItem(null);
    };

    const handleSubmit = () => {
        if (!form.name) {
            toast.error(t('admin.fillRequired'));
            return;
        }
        const data = {
            ...form,
            template_id: form.template_id || null,
        };
        if (editItem) {
            updateMutation.mutate({ id: editItem.id, data });
        } else {
            createMutation.mutate(data);
        }
    };

    const toggleSubject = (id: number) => {
        setForm(prev => {
            const arr = prev.subject_ids || [];
            return {
                ...prev,
                subject_ids: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
            };
        });
    };

    const getTemplateName = (templateId: number | null) => {
        if (!templateId) return '—';
        const tmpl = templates.find((t: Template) => t.id === templateId);
        return tmpl?.name || `#${templateId}`;
    };

    if (isLoading) return <Loader />;

    return (
        <div>
            <div className={s.toolbar}>
                <div className={s.searchWrapper}>
                    <SearchInput
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder={t('admin.searchPlaceholder')}
                    />
                </div>
                <Button size="sm" onClick={openCreate}>
                    + {t('admin.add')}
                </Button>
            </div>

            {filtered.length === 0 ? (
                <div className={s.emptyState}>{t('admin.noData')}</div>
            ) : (
                <table className={s.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t('admin.fields.name')}</th>
                            <th>{t('admin.fields.template')}</th>
                            <th>{t('admin.fields.link')}</th>
                            <th>{t('admin.fields.requiresSub')}</th>
                            <th>{t('admin.fields.image')}</th>
                            <th>{t('admin.fields.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{getTemplateName(item.template_id)}</td>
                                <td>
                                    {item.link ? (
                                        <a href={item.link} target="_blank" rel="noreferrer">
                                            {t('admin.fields.link')}
                                        </a>
                                    ) : (
                                        '—'
                                    )}
                                </td>
                                <td>
                                    <span
                                        className={`${s.badge} ${
                                            item.nsub ? s.badgeRed : s.badgeGreen
                                        }`}>
                                        {item.nsub ? t('admin.yes') : t('admin.no')}
                                    </span>
                                </td>
                                <td>
                                    {(item.image_url || item.image_file) && (
                                        <img
                                            src={item.image_url || item.image_file || ''}
                                            alt=""
                                            className={s.thumbnail}
                                        />
                                    )}
                                </td>
                                <td>
                                    <div className={s.actions}>
                                        <button
                                            className={s.iconBtn}
                                            onClick={() => openEdit(item)}>
                                            {t('admin.edit')}
                                        </button>
                                        <button
                                            className={`${s.iconBtn} ${s.iconBtnDanger}`}
                                            onClick={() => setDeleteItem(item)}>
                                            {t('admin.delete')}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <Modal
                open={modalOpen}
                onClose={closeModal}
                title={editItem ? t('admin.editWindow') : t('admin.addWindow')}>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.name')} *</label>
                    <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.template')}</label>
                    <select
                        value={form.template_id || ''}
                        onChange={e =>
                            setForm({
                                ...form,
                                template_id: e.target.value ? Number(e.target.value) : null,
                            })
                        }>
                        <option value="">{t('admin.selectNone')}</option>
                        {templates.map((tmpl: Template) => (
                            <option key={tmpl.id} value={tmpl.id}>
                                {tmpl.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.link')}</label>
                    <input
                        value={form.link || ''}
                        onChange={e => setForm({ ...form, link: e.target.value })}
                    />
                </div>
                <div className={s.checkboxGroup}>
                    <input
                        type="checkbox"
                        id="nsub"
                        checked={form.nsub || false}
                        onChange={e => setForm({ ...form, nsub: e.target.checked })}
                    />
                    <label htmlFor="nsub">{t('admin.fields.requiresSub')}</label>
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.imageUrl')}</label>
                    <input
                        value={form.image_url || ''}
                        onChange={e => setForm({ ...form, image_url: e.target.value })}
                    />
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.imageFile')}</label>
                    <input
                        value={form.image_file || ''}
                        onChange={e => setForm({ ...form, image_file: e.target.value })}
                    />
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.subjects')}</label>
                    <div className={s.multiSelect}>
                        {subjects.map((subj: Subject) => (
                            <button
                                key={subj.id}
                                type="button"
                                className={`${s.multiSelectItem} ${
                                    form.subject_ids?.includes(subj.id)
                                        ? s.multiSelectItemSelected
                                        : ''
                                }`}
                                onClick={() => toggleSubject(subj.id)}>
                                {subj.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={s.formActions}>
                    <Button variant="outline" size="sm" onClick={closeModal}>
                        {t('admin.cancel')}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        loading={createMutation.isPending || updateMutation.isPending}>
                        {editItem ? t('admin.save') : t('admin.add')}
                    </Button>
                </div>
            </Modal>

            <ConfirmModal
                open={!!deleteItem}
                onClose={() => setDeleteItem(null)}
                onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
                title={t('admin.confirmDelete')}
                message={t('admin.confirmDeleteMessage', { name: deleteItem?.name })}
                confirmText={t('admin.delete')}
                cancelText={t('admin.cancel')}
                loading={deleteMutation.isPending}
            />
        </div>
    );
};
