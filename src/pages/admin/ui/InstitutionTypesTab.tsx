import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import {
    subjectApi,
    type InstitutionType,
    type InstitutionTypeCreate,
    type InstitutionTypeUpdate,
} from '@/entities/subject/api/subjectApi';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { SearchInput } from '@/shared/ui/search-input';
import { Loader } from '@/shared/ui/loader';
import s from './AdminPage.module.scss';

export const InstitutionTypesTab = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [editItem, setEditItem] = useState<InstitutionType | null>(null);
    const [deleteItem, setDeleteItem] = useState<InstitutionType | null>(null);

    const [form, setForm] = useState<InstitutionTypeCreate>({
        name: '',
        code: '',
    });

    const { data: types = [], isLoading } = useQuery({
        queryKey: ['admin-institution-types'],
        queryFn: () => subjectApi.getInstitutionTypes({ limit: 1000 }),
    });

    const createMutation = useMutation({
        mutationFn: (data: InstitutionTypeCreate) => subjectApi.createInstitutionType(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-institution-types'] });
            toast.success(t('admin.created'));
            closeModal();
        },
        onError: () => toast.error(t('admin.createError')),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: InstitutionTypeUpdate }) =>
            subjectApi.updateInstitutionType(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-institution-types'] });
            toast.success(t('admin.updated'));
            closeModal();
        },
        onError: () => toast.error(t('admin.updateError')),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => subjectApi.deleteInstitutionType(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-institution-types'] });
            toast.success(t('admin.deleted'));
            setDeleteItem(null);
        },
        onError: () => toast.error(t('admin.deleteError')),
    });

    const filtered = useMemo(() => {
        if (!search) return types;
        const q = search.toLowerCase();
        return types.filter(
            t =>
                t.name.toLowerCase().includes(q) ||
                (t.code && t.code.toLowerCase().includes(q))
        );
    }, [types, search]);

    const openCreate = () => {
        setEditItem(null);
        setForm({ name: '', code: '' });
        setModalOpen(true);
    };

    const openEdit = (item: InstitutionType) => {
        setEditItem(item);
        setForm({ name: item.name, code: item.code || '' });
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
        if (editItem) {
            updateMutation.mutate({ id: editItem.id, data: form });
        } else {
            createMutation.mutate(form);
        }
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
                            <th>{t('admin.fields.createdAt')}</th>
                            <th>{t('admin.fields.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.name}</td>
                                <td>{item.code || '—'}</td>
                                <td>{new Date(item.created_at).toLocaleDateString()}</td>
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
                title={
                    editItem
                        ? t('admin.editInstitutionType')
                        : t('admin.addInstitutionType')
                }>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.name')} *</label>
                    <input
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.code')}</label>
                    <input
                        value={form.code || ''}
                        onChange={e => setForm({ ...form, code: e.target.value })}
                    />
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
