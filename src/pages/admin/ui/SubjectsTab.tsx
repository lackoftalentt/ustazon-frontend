import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import {
    subjectApi,
    type Subject,
    type SubjectCreate,
    type SubjectUpdate,
    type InstitutionType,
    type Window,
} from '@/entities/subject/api/subjectApi';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { SearchInput } from '@/shared/ui/search-input';
import { Loader } from '@/shared/ui/loader';
import s from './AdminPage.module.scss';

export const SubjectsTab = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<Subject | null>(null);
    const [deleteItem, setDeleteItem] = useState<Subject | null>(null);

    const [form, setForm] = useState<SubjectCreate>({
        name: '',
        code: '',
        image_url: '',
        hero_image_url: '',
        image_file: '',
        hero_image_file: '',
        institution_type_ids: [],
        window_ids: [],
    });

    const { data: subjects = [], isLoading } = useQuery({
        queryKey: ['admin-subjects'],
        queryFn: () => subjectApi.getSubjects({ limit: 1000 }),
    });

    const { data: institutionTypes = [] } = useQuery({
        queryKey: ['admin-institution-types'],
        queryFn: () => subjectApi.getInstitutionTypes({ limit: 1000 }),
    });

    const { data: windows = [] } = useQuery({
        queryKey: ['admin-windows'],
        queryFn: () => subjectApi.getWindows({ limit: 1000 }),
    });

    const createMutation = useMutation({
        mutationFn: (data: SubjectCreate) => subjectApi.createSubject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
            toast.success(t('admin.created'));
            closeModal();
        },
        onError: () => toast.error(t('admin.createError')),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: SubjectUpdate }) =>
            subjectApi.updateSubject(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
            toast.success(t('admin.updated'));
            closeModal();
        },
        onError: () => toast.error(t('admin.updateError')),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => subjectApi.deleteSubject(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
            toast.success(t('admin.deleted'));
            setDeleteItem(null);
        },
        onError: () => toast.error(t('admin.deleteError')),
    });

    const filtered = useMemo(() => {
        if (!search) return subjects;
        const q = search.toLowerCase();
        return subjects.filter(
            s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
        );
    }, [subjects, search]);

    const openCreate = () => {
        setEditItem(null);
        setForm({
            name: '',
            code: '',
            image_url: '',
            hero_image_url: '',
            image_file: '',
            hero_image_file: '',
            institution_type_ids: [],
            window_ids: [],
        });
        setModalOpen(true);
    };

    const openEdit = (item: Subject) => {
        setEditItem(item);
        setForm({
            name: item.name,
            code: item.code,
            image_url: item.image_url || '',
            hero_image_url: item.hero_image_url || '',
            image_file: item.image_file || '',
            hero_image_file: item.hero_image_file || '',
            institution_type_ids: item.institution_types.map(it => it.id),
            window_ids: item.windows.map(w => w.id),
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditItem(null);
    };

    const handleSubmit = () => {
        if (!form.name || !form.code) {
            toast.error(t('admin.fillRequired'));
            return;
        }
        if (editItem) {
            updateMutation.mutate({ id: editItem.id, data: form });
        } else {
            createMutation.mutate(form);
        }
    };

    const toggleMultiSelect = (
        field: 'institution_type_ids' | 'window_ids',
        id: number
    ) => {
        setForm(prev => {
            const arr = prev[field] || [];
            return {
                ...prev,
                [field]: arr.includes(id) ? arr.filter(x => x !== id) : [...arr, id],
            };
        });
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
                            <th>{t('admin.fields.code')}</th>
                            <th>{t('admin.fields.image')}</th>
                            <th>{t('admin.fields.institutionTypes')}</th>
                            <th>{t('admin.fields.windows')}</th>
                            <th>{t('admin.fields.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.code}</td>
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
                                    {item.institution_types.map(it => (
                                        <span key={it.id} className={`${s.badge} ${s.badgeGray}`}>
                                            {it.name}
                                        </span>
                                    ))}
                                </td>
                                <td>{item.windows.length}</td>
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
                title={editItem ? t('admin.editSubject') : t('admin.addSubject')}>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.name')} *</label>
                    <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.code')} *</label>
                    <input
                        value={form.code}
                        onChange={e => setForm({ ...form, code: e.target.value })}
                    />
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.imageUrl')}</label>
                    <input
                        value={form.image_url || ''}
                        onChange={e => setForm({ ...form, image_url: e.target.value })}
                    />
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.heroImageUrl')}</label>
                    <input
                        value={form.hero_image_url || ''}
                        onChange={e => setForm({ ...form, hero_image_url: e.target.value })}
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
                    <label>{t('admin.fields.heroImageFile')}</label>
                    <input
                        value={form.hero_image_file || ''}
                        onChange={e => setForm({ ...form, hero_image_file: e.target.value })}
                    />
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.institutionTypes')}</label>
                    <div className={s.multiSelect}>
                        {institutionTypes.map((it: InstitutionType) => (
                            <button
                                key={it.id}
                                type="button"
                                className={`${s.multiSelectItem} ${
                                    form.institution_type_ids?.includes(it.id)
                                        ? s.multiSelectItemSelected
                                        : ''
                                }`}
                                onClick={() =>
                                    toggleMultiSelect('institution_type_ids', it.id)
                                }>
                                {it.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.windows')}</label>
                    <div className={s.multiSelect}>
                        {windows.map((w: Window) => (
                            <button
                                key={w.id}
                                type="button"
                                className={`${s.multiSelectItem} ${
                                    form.window_ids?.includes(w.id)
                                        ? s.multiSelectItemSelected
                                        : ''
                                }`}
                                onClick={() => toggleMultiSelect('window_ids', w.id)}>
                                {w.name}
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
