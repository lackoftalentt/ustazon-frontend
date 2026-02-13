import { useCallback, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { searchUsers, type UserResponse } from '@/entities/user/api/userApi';
import { SearchInput } from '@/shared/ui/search-input';
import { Button } from '@/shared/ui/button';
import { Loader } from '@/shared/ui/loader';
import s from './AdminPage.module.scss';

const PAGE_SIZE = 20;

export const UsersTab = () => {
	const { t } = useTranslation();
	const [search, setSearch] = useState('');
	const [debouncedSearch, setDebouncedSearch] = useState('');
	const [page, setPage] = useState(0);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(search);
			setPage(0);
		}, 300);
		return () => clearTimeout(timer);
	}, [search]);

	const { data, isLoading } = useQuery({
		queryKey: ['admin-users', debouncedSearch, page],
		queryFn: () =>
			searchUsers({
				search: debouncedSearch || undefined,
				skip: page * PAGE_SIZE,
				limit: PAGE_SIZE,
			}),
	});

	const users = data?.items || [];
	const total = data?.total || 0;
	const totalPages = Math.ceil(total / PAGE_SIZE);

	const handlePrev = useCallback(() => setPage(p => Math.max(0, p - 1)), []);
	const handleNext = useCallback(() => setPage(p => p + 1), []);

	const formatDate = (dateStr: string) => {
		try {
			return new Date(dateStr).toLocaleString('ru-RU', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
			});
		} catch {
			return dateStr;
		}
	};

	const getRoleBadge = (user: UserResponse) => {
		if (user.is_superuser) return <span className={`${s.badge} ${s.badgeRed}`}>Superuser</span>;
		if (user.is_admin) return <span className={`${s.badge} ${s.badgeGreen}`}>Admin</span>;
		return <span className={`${s.badge} ${s.badgeGray}`}>User</span>;
	};

	return (
		<div>
			<div className={s.statsRow}>
				<div className={s.statCard}>
					<div className={s.statValue}>{total}</div>
					<div className={s.statLabel}>{t('admin.users.total', 'Барлық пайдаланушылар')}</div>
				</div>
			</div>

			<div className={s.toolbar}>
				<div className={s.searchWrapper}>
					<SearchInput
						value={search}
						onChange={e => setSearch(e.target.value)}
						placeholder={t('admin.users.searchPlaceholder', 'ИИН, аты, телефон бойынша іздеу...')}
					/>
				</div>
			</div>

			{isLoading ? (
				<Loader />
			) : users.length === 0 ? (
				<div className={s.emptyState}>{t('admin.noData')}</div>
			) : (
				<>
					<table className={s.table}>
						<thead>
							<tr>
								<th>ID</th>
								<th>{t('admin.fields.name')}</th>
								<th>ИИН</th>
								<th>{t('admin.users.phone', 'Телефон')}</th>
								<th>{t('admin.users.role', 'Рөлі')}</th>
								<th>{t('admin.users.status', 'Статус')}</th>
								<th>{t('admin.users.registered', 'Тіркелген')}</th>
							</tr>
						</thead>
						<tbody>
							{users.map(user => (
								<tr key={user.id}>
									<td>{user.id}</td>
									<td>{user.name}</td>
									<td>{user.iin}</td>
									<td>{user.phone}</td>
									<td>{getRoleBadge(user)}</td>
									<td>
										{user.is_verified ? (
											<span className={`${s.badge} ${s.badgeGreen}`}>
												{t('admin.users.verified', 'Расталған')}
											</span>
										) : (
											<span className={`${s.badge} ${s.badgeGray}`}>
												{t('admin.users.unverified', 'Расталмаған')}
											</span>
										)}
									</td>
									<td>{formatDate(user.created_at)}</td>
								</tr>
							))}
						</tbody>
					</table>

					{totalPages > 1 && (
						<div className={s.pagination}>
							<Button
								size="sm"
								variant="outline"
								onClick={handlePrev}
								disabled={page === 0}
							>
								←
							</Button>
							<span className={s.pageInfo}>
								{page + 1} / {totalPages}
							</span>
							<Button
								size="sm"
								variant="outline"
								onClick={handleNext}
								disabled={page >= totalPages - 1}
							>
								→
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
};
