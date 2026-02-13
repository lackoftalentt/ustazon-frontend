import { useCallback, useEffect, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

import { subscriptionApi } from '@/entities/subscription/api/subscriptionApi';
import type { Subscription, SubscriptionCreate, SubscriptionUpdate } from '@/entities/subscription/model/types';
import { subjectApi, type Subject, type InstitutionType } from '@/entities/subject/api/subjectApi';
import { searchUsers, type UserResponse } from '@/entities/user/api/userApi';
import { Button } from '@/shared/ui/button';
import { Modal } from '@/shared/ui/modal';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { Loader } from '@/shared/ui/loader';
import s from './AdminPage.module.scss';

type FilterMode = 'all' | 'active' | 'expired' | 'expiring';

export const SubscriptionsTab = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();

    // --- Filter & search state ---
    const [filter, setFilter] = useState<FilterMode>('all');
    const [userSearch, setUserSearch] = useState('');
    const [userSearchDebounced, setUserSearchDebounced] = useState('');
    const [usersPage, setUsersPage] = useState(0);
    const USERS_PER_PAGE = 15;

    // --- Modals ---
    const [grantModal, setGrantModal] = useState<UserResponse | null>(null);
    const [editModal, setEditModal] = useState<Subscription | null>(null);
    const [deleteItem, setDeleteItem] = useState<Subscription | null>(null);

    // --- Grant form ---
    const [grantForm, setGrantForm] = useState<SubscriptionCreate>({
        user_id: 0,
        subject_id: 0,
        institution_type_id: 0,
        end_date: '',
    });

    // --- Edit form ---
    const [editForm, setEditForm] = useState<SubscriptionUpdate>({});

    // Debounce user search
    useEffect(() => {
        const timer = setTimeout(() => {
            setUserSearchDebounced(userSearch);
            setUsersPage(0);
        }, 300);
        return () => clearTimeout(timer);
    }, [userSearch]);

    // --- Queries ---
    const { data: usersData, isLoading: loadingUsers } = useQuery({
        queryKey: ['admin-users', userSearchDebounced, usersPage],
        queryFn: () =>
            searchUsers({
                search: userSearchDebounced || undefined,
                skip: usersPage * USERS_PER_PAGE,
                limit: USERS_PER_PAGE,
            }),
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

    // --- Mutations ---
    const invalidateSubs = useCallback(() => {
        queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
        queryClient.invalidateQueries({ queryKey: ['admin-subscriptions-expired'] });
        queryClient.invalidateQueries({ queryKey: ['admin-subscriptions-expiring'] });
    }, [queryClient]);

    const createMutation = useMutation({
        mutationFn: (data: SubscriptionCreate) => subscriptionApi.createSubscription(data),
        onSuccess: () => {
            invalidateSubs();
            toast.success(t('admin.created'));
            setGrantModal(null);
        },
        onError: () => toast.error(t('admin.createError')),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: SubscriptionUpdate }) =>
            subscriptionApi.updateSubscription(id, data),
        onSuccess: () => {
            invalidateSubs();
            toast.success(t('admin.updated'));
            setEditModal(null);
        },
        onError: () => toast.error(t('admin.updateError')),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => subscriptionApi.deleteSubscription(id),
        onSuccess: () => {
            invalidateSubs();
            toast.success(t('admin.deleted'));
            setDeleteItem(null);
        },
        onError: () => toast.error(t('admin.deleteError')),
    });

    // --- Displayed subscriptions ---
    const displayed = useMemo(() => {
        switch (filter) {
            case 'active':
                return allSubs.filter(sub => sub.is_active);
            case 'expired':
                return expiredSubs;
            case 'expiring':
                return expiringSubs;
            default:
                return allSubs;
        }
    }, [filter, allSubs, expiredSubs, expiringSubs]);

    // --- Stats ---
    const stats = useMemo(() => {
        const activeSubs = allSubs.filter(sub => sub.is_active);
        const uniqueUsers = new Set(allSubs.map(sub => sub.user_id)).size;
        const uniqueSubjects = new Set(allSubs.map(sub => sub.subject_id)).size;
        return {
            totalUsers: usersData?.total ?? 0,
            activeSubs: activeSubs.length,
            totalSubs: allSubs.length,
            uniqueUsers,
            uniqueSubjects,
        };
    }, [allSubs, usersData]);

    // --- Handlers ---
    const openGrant = (user: UserResponse) => {
        setGrantForm({
            user_id: user.id,
            subject_id: subjects[0]?.id || 0,
            institution_type_id: institutionTypes[0]?.id || 0,
            end_date: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
        });
        setGrantModal(user);
    };

    const handleGrant = () => {
        if (!grantForm.subject_id || !grantForm.institution_type_id || !grantForm.end_date) {
            toast.error(t('admin.fillRequired'));
            return;
        }
        createMutation.mutate(grantForm);
    };

    const openEdit = (sub: Subscription) => {
        setEditForm({
            subject_id: sub.subject_id,
            institution_type_id: sub.institution_type_id,
            end_date: sub.end_date.split('T')[0],
        });
        setEditModal(sub);
    };

    const handleEdit = () => {
        if (!editModal) return;
        updateMutation.mutate({ id: editModal.id, data: editForm });
    };

    const users = usersData?.items ?? [];
    const totalUsers = usersData?.total ?? 0;
    const totalPages = Math.ceil(totalUsers / USERS_PER_PAGE);

    const isLoading =
        loadingAll || (filter === 'expired' && loadingExpired) || (filter === 'expiring' && loadingExpiring);

    return (
        <div>
            {/* Stats cards */}
            <div className={s.statsRow}>
                <div className={s.statCard}>
                    <div className={s.statValue}>{stats.totalUsers}</div>
                    <div className={s.statLabel}>{t('admin.sub.totalUsers')}</div>
                </div>
                <div className={s.statCard}>
                    <div className={s.statValue}>{stats.activeSubs}</div>
                    <div className={s.statLabel}>{t('admin.sub.activeSubs')}</div>
                </div>
                <div className={s.statCard}>
                    <div className={s.statValue}>{stats.uniqueSubjects}</div>
                    <div className={s.statLabel}>{t('admin.sub.subjectsCount')}</div>
                </div>
            </div>

            {/* Two-column layout */}
            <div className={s.twoCol}>
                {/* Left: Users list with search */}
                <div className={s.colLeft}>
                    <h3 className={s.colTitle}>{t('admin.sub.usersList')}</h3>
                    <input
                        className={s.searchInput}
                        type="text"
                        placeholder={t('admin.sub.searchUsers')}
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                    />
                    {loadingUsers ? (
                        <Loader />
                    ) : users.length === 0 ? (
                        <div className={s.emptyState}>{t('admin.noData')}</div>
                    ) : (
                        <>
                            <div className={s.usersList}>
                                {users.map(user => (
                                    <div key={user.id} className={s.userCard}>
                                        <div className={s.userInfo}>
                                            <div className={s.userName}>{user.name}</div>
                                            <div className={s.userMeta}>
                                                ЖСН: {user.iin} &middot; {user.phone}
                                            </div>
                                        </div>
                                        <Button size="sm" onClick={() => openGrant(user)}>
                                            {t('admin.sub.grantAccess')}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <div className={s.pagination}>
                                    <button
                                        className={s.filterBtn}
                                        disabled={usersPage === 0}
                                        onClick={() => setUsersPage(p => p - 1)}>
                                        &laquo;
                                    </button>
                                    <span className={s.pageInfo}>
                                        {usersPage + 1} / {totalPages}
                                    </span>
                                    <button
                                        className={s.filterBtn}
                                        disabled={usersPage >= totalPages - 1}
                                        onClick={() => setUsersPage(p => p + 1)}>
                                        &raquo;
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Right: Active subscriptions */}
                <div className={s.colRight}>
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
                    </div>

                    {isLoading ? (
                        <Loader />
                    ) : displayed.length === 0 ? (
                        <div className={s.emptyState}>{t('admin.noData')}</div>
                    ) : (
                        <div className={s.subsTableWrap}>
                            <table className={s.table}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>{t('admin.fields.userId')}</th>
                                        <th>{t('admin.fields.subject')}</th>
                                        <th>{t('admin.fields.institutionType')}</th>
                                        <th>{t('admin.fields.endDate')}</th>
                                        <th>{t('admin.fields.status')}</th>
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
                                                {item.institution_type?.name ||
                                                    `#${item.institution_type_id}`}
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
                        </div>
                    )}
                </div>
            </div>

            {/* Grant access modal */}
            <Modal
                open={!!grantModal}
                onClose={() => setGrantModal(null)}
                title={`${t('admin.sub.grantAccess')} — ${grantModal?.name || ''}`}>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.subject')} *</label>
                    <select
                        value={grantForm.subject_id}
                        onChange={e =>
                            setGrantForm({ ...grantForm, subject_id: Number(e.target.value) })
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
                        value={grantForm.institution_type_id}
                        onChange={e =>
                            setGrantForm({
                                ...grantForm,
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
                        value={grantForm.end_date}
                        onChange={e => setGrantForm({ ...grantForm, end_date: e.target.value })}
                    />
                </div>
                <div className={s.formActions}>
                    <Button variant="outline" size="sm" onClick={() => setGrantModal(null)}>
                        {t('admin.cancel')}
                    </Button>
                    <Button size="sm" onClick={handleGrant} loading={createMutation.isPending}>
                        {t('admin.sub.grantAccess')}
                    </Button>
                </div>
            </Modal>

            {/* Edit subscription modal */}
            <Modal
                open={!!editModal}
                onClose={() => setEditModal(null)}
                title={`${t('admin.edit')} #${editModal?.id || ''}`}>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.subject')}</label>
                    <select
                        value={editForm.subject_id ?? ''}
                        onChange={e =>
                            setEditForm({ ...editForm, subject_id: Number(e.target.value) })
                        }>
                        {subjects.map((subj: Subject) => (
                            <option key={subj.id} value={subj.id}>
                                {subj.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={s.formGroup}>
                    <label>{t('admin.fields.institutionType')}</label>
                    <select
                        value={editForm.institution_type_id ?? ''}
                        onChange={e =>
                            setEditForm({
                                ...editForm,
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
                    <label>{t('admin.fields.endDate')}</label>
                    <input
                        type="date"
                        value={editForm.end_date ?? ''}
                        onChange={e => setEditForm({ ...editForm, end_date: e.target.value })}
                    />
                </div>
                <div className={s.formActions}>
                    <Button variant="outline" size="sm" onClick={() => setEditModal(null)}>
                        {t('admin.cancel')}
                    </Button>
                    <Button size="sm" onClick={handleEdit} loading={updateMutation.isPending}>
                        {t('admin.save')}
                    </Button>
                </div>
            </Modal>

            {/* Delete confirmation */}
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
