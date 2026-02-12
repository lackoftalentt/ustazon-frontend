import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import { subscriptionApi } from '@/entities/subscription/api/subscriptionApi';
import type { Subscription, SubscriptionCreate } from '@/entities/subscription/model/types';
import { subjectApi, type Subject, type InstitutionType } from '@/entities/subject/api/subjectApi';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { Loader } from '@/shared/ui/loader';
import s from './AdminPage.module.scss';

type FilterMode = 'all' | 'active' | 'expired' | 'expiring';

export const SubscriptionsTab = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<FilterMode>('all');
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState<Subscription | null>(null);

    const [form, setForm] = useState<SubscriptionCreate>({
        user_id: 0,
        subject_id: 0,
        institution_type_id: 0,
        end_date: '',
    });

    const { data: allSubs = [], isLoading: loadingAll } = useQuery({
        queryKey: ['admin-subscriptions'],
        queryFn: () => subscriptionApi.getSubscriptions({ limit: 1000 }),
    });

    const { data: expiredSubs = [], isLoading: loadingExpired } = useQuery({
        queryKey: ['admin-subscriptions-expired'],
        queryFn: () => subscriptionApi.getExpiredSubscriptions({ limit: 1000 }),
        enabled: filter === 'expired',
    });

    const { data: expiringSubs = [], isLoading: loadingExpiring } = useQuery({
        queryKey: ['admin-subscriptions-expiring'],
        queryFn: () => subscriptionApi.getExpiringSoonSubscriptions({ days: 7, limit: 1000 }),
        enabled: filter === 'expiring',
    });

    const { data: subjects = [] } = useQuery({
        queryKey: ['admin-subjects'],
        queryFn: () => subjectApi.getSubjects({ limit: 1000 }),
    });

    const { data: institutionTypes = [] } = useQuery({
        queryKey: ['admin-institution-types'],
        queryFn: () => subjectApi.getInstitutionTypes({ limit: 1000 }),
    });

    const createMutation = useMutation({
        mutationFn: (data: SubscriptionCreate) => subscriptionApi.createSubscription(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
            toast.success(t('admin.created'));
            closeModal();
        },
        onError: () => toast.error(t('admin.createError')),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => subscriptionApi.deleteSubscription(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subscriptions-expired'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subscriptions-expiring'] });
            toast.success(t('admin.deleted'));
            setDeleteItem(null);
        },
        onError: () => toast.error(t('admin.deleteError')),
    });

    const displayed = useMemo(() => {
        switch (filter) {
            case 'active':
                return allSubs.filter(s => s.is_active);
            case 'expired':
                return expiredSubs;
            case 'expiring':
                return expiringSubs;
            default:
                return allSubs;
        }
    }, [filter, allSubs, expiredSubs, expiringSubs]);

    const openCreate = () => {
        setForm({
            user_id: 0,
            subject_id: subjects[0]?.id || 0,
            institution_type_id: institutionTypes[0]?.id || 0,
            end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleSubmit = () => {
        if (!form.user_id || !form.subject_id || !form.institution_type_id || !form.end_date) {
            toast.error(t('admin.fillRequired'));
            return;
        }
        createMutation.mutate(form);
    };

    const isLoading = loadingAll || (filter === 'expired' && loadingExpired) || (filter === 'expiring' && loadingExpiring);

    if (isLoading) return <Loader />;

    return (
        <div>
            <div className={s.toolbar}>
                <div className={s.filterGroup}>
                    {(['all', 'active', 'expired', 'expiring'] as FilterMode[]).map(mode => (
                        <button
                            key={mode}
                            className={`${s.filterBtn} ${filter === mode ? s.filterBtnActive : ''}`}
                            onClick={() => setFilter(mode)}>
                            {t(`admin.subFilters.${mode}`)}
                        </button>
                    ))}
                </div>
                <Button size="sm" onClick={openCreate}>
                    + {t('admin.add')}
                </Button>
            </div>

            {displayed.length === 0 ? (
                <div className={s.emptyState}>{t('admin.noData')}</div>
            ) : (
                <table className={s.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>{t('admin.fields.userId')}</th>
                            <th>{t('admin.fields.subject')}</th>
                            <th>{t('admin.fields.institutionType')}</th>
                            <th>{t('admin.fields.endDate')}</th>
                            <th>{t('admin.fields.status')}</th>
                            <th>{t('admin.fields.createdAt')}</th>
                            <th>{t('admin.fields.actions')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayed.map(item => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>{item.user_id}</td>
                                <td>{item.subject?.name || `#${item.subject_id}`}</td>
                                <td>
                                    {item.institution_type?.name || `#${item.institution_type_id}`}
                                </td>
                                <td>{new Date(item.end_date).toLocaleDateString()}</td>
                                <td>
                                    <span
                                        className={`${s.badge} ${
                                            item.is_active ? s.badgeGreen : s.badgeRed
                                        }`}>
                                        {item.is_active
                                            ? t('admin.active')
                                            : t('admin.inactive')}
                                    </span>
                                </td>
                                <td>{new Date(item.created_at).toLocaleDateString()}</td>
                                <td>
                                    <div className={s.actions}>
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
                title={t('admin.addSubscription')}>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.userId')} *</label>
                    <input
                        type="number"
                        value={form.user_id || ''}
                        onChange={e =>
                            setForm({ ...form, user_id: Number(e.target.value) })
                        }
                        placeholder="ID"
                    />
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.subject')} *</label>
                    <select
                        value={form.subject_id}
                        onChange={e =>
                            setForm({ ...form, subject_id: Number(e.target.value) })
                        }>
                        {subjects.map((subj: Subject) => (
                            <option key={subj.id} value={subj.id}>
                                {subj.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.institutionType')} *</label>
                    <select
                        value={form.institution_type_id}
                        onChange={e =>
                            setForm({
                                ...form,
                                institution_type_id: Number(e.target.value),
                            })
                        }>
                        {institutionTypes.map((it: InstitutionType) => (
                            <option key={it.id} value={it.id}>
                                {it.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.endDate')} *</label>
                    <input
                        type="date"
                        value={form.end_date}
                        onChange={e => setForm({ ...form, end_date: e.target.value })}
                    />
                </div>
                <div className={s.formActions}>
                    <Button variant="outline" size="sm" onClick={closeModal}>
                        {t('admin.cancel')}
                    </Button>
                    <Button
                        size="sm"
                        onClick={handleSubmit}
                        loading={createMutation.isPending}>
                        {t('admin.add')}
                    </Button>
                </div>
            </Modal>

            <ConfirmModal
                open={!!deleteItem}
                onClose={() => setDeleteItem(null)}
                onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
                title={t('admin.confirmDelete')}
                message={t('admin.confirmDeleteSubMessage', { id: deleteItem?.id })}
                confirmText={t('admin.delete')}
                cancelText={t('admin.cancel')}
                loading={deleteMutation.isPending}
            />
        </div>
    );
};
