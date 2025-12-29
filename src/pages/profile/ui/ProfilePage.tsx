import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { getCurrentUser, updateUserProfile } from '@/entities/user/api/userApi';
import { useAuthStore } from '@/entities/user/model/store/useAuthStore';
import s from './ProfilePage.module.scss';

const profileSchema = z.object({
    name: z
        .string()
        .min(2, 'Имя должно содержать минимум 2 символа')
        .max(50, 'Имя должно содержать максимум 50 символов')
        .regex(
            /^[а-яА-ЯёЁa-zA-Z\s\-]+$/,
            'Имя может содержать только буквы, пробелы и дефисы'
        ),
    phone: z
        .string()
        .regex(/^\+?7\d{10}$/, 'Неверный формат телефона')
        .transform(val => (val.startsWith('+') ? val : `+${val}`))
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { setUser, logout } = useAuthStore();
    const queryClient = useQueryClient();

    const { data: userData, isLoading } = useQuery({
        queryKey: ['currentUser'],
        queryFn: getCurrentUser
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty }
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        values: userData
            ? {
                  name: userData.name,
                  phone: userData.phone
              }
            : undefined
    });

    const updateMutation = useMutation({
        mutationFn: updateUserProfile,
        onSuccess: data => {
            queryClient.setQueryData(['currentUser'], data);
            setUser({
                iin: data.iin,
                name: data.name,
                phoneNumber: data.phone
            });
            setIsEditing(false);
            toast.success('Профиль успешно обновлен');
        },
        onError: (error: any) => {
            const message =
                error.response?.data?.detail || 'Ошибка при обновлении профиля';
            toast.error(message);
        }
    });

    const onSubmit = (data: ProfileFormData) => {
        updateMutation.mutate(data);
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    const handleLogout = () => {
        logout();
        toast.success('Вы успешно вышли из аккаунта');
        navigate('/login');
    };

    if (isLoading) {
        return (
            <div className={s.container}>
                <div className={s.card}>
                    <p>Загрузка...</p>
                </div>
            </div>
        );
    }

    if (!userData) {
        return (
            <div className={s.container}>
                <div className={s.card}>
                    <p>Не удалось загрузить данные профиля</p>
                </div>
            </div>
        );
    }

    return (
        <div className={s.container}>
            <div className={s.header}>
                <div className={s.headerContent}>
                    <div>
                        <h1 className={s.title}>Профиль</h1>
                        <p className={s.subtitle}>
                            Управляйте своими личными данными и настройками
                        </p>
                    </div>
                    <div className={s.avatarSection}>
                        <div className={s.avatarCircle}>
                            {userData?.name.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>
            </div>

            <div className={s.card}>
                <form
                    className={s.form}
                    onSubmit={handleSubmit(onSubmit)}>
                    <div className={s.formRow}>
                        <Input
                            {...register('name')}
                            id="name"
                            label="Имя"
                            error={errors.name?.message}
                            placeholder="Введите имя"
                            disabled={!isEditing}
                        />

                        <Input
                            {...register('phone')}
                            id="phone"
                            label="Телефон"
                            error={errors.phone?.message}
                            placeholder="+7XXXXXXXXXX"
                            disabled={!isEditing}
                        />
                    </div>

                    {!isEditing ? (
                        <Button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            fullWidth>
                            Редактировать профиль
                        </Button>
                    ) : (
                        <div className={s.buttonGroup}>
                            <Button
                                type="submit"
                                disabled={!isDirty || updateMutation.isPending}
                                loading={updateMutation.isPending}
                                fullWidth>
                                Сохранить изменения
                            </Button>
                            <Button
                                type="button"
                                onClick={handleCancel}
                                className={s.cancelButton}
                                fullWidth>
                                Отмена
                            </Button>
                        </div>
                    )}
                </form>

                <div className={s.infoSection}>
                    <h2 className={s.infoTitle}>Информация об аккаунте</h2>
                    <div className={s.infoGrid}>
                        <div className={s.infoItem}>
                            <span className={s.infoLabel}>ИИН</span>
                            <span className={s.infoValue}>{userData.iin}</span>
                        </div>
                        <div className={s.infoItem}>
                            <span className={s.infoLabel}>Статус телефона</span>
                            {userData.is_verified ? (
                                <span className={s.verifiedBadge}>
                                    ✓ Подтвержден
                                </span>
                            ) : (
                                <span className={s.unverifiedBadge}>
                                    ! Не подтвержден
                                </span>
                            )}
                        </div>
                        <div className={s.infoItem}>
                            <span className={s.infoLabel}>
                                Дата регистрации
                            </span>
                            <span className={s.infoValue}>
                                {new Date(
                                    userData.created_at
                                ).toLocaleDateString('ru-RU', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={s.dangerZone}>
                    <h2 className={s.dangerTitle}>Управление аккаунтом</h2>
                    <div className={s.dangerContent}>
                        <div>
                            <p className={s.dangerText}>Выйти из аккаунта</p>
                            <p className={s.dangerDescription}>
                                Вы будете перенаправлены на страницу входа
                            </p>
                        </div>
                        <Button
                            onClick={handleLogout}
                            className={s.logoutButton}
                            variant="outline">
                            Выйти
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
