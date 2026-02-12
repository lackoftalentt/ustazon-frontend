import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/entities/user';
import { useTranslation } from 'react-i18next';
import defaultAvatar from '@/shared/assets/images/profile-image.jpg';
import s from './UserMenu.module.scss';

export const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuthStore();
    const { t } = useTranslation();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        navigate('/login');
    };

    const handleProfileClick = () => {
        setIsOpen(false);
        navigate('/profile');
    };

    const handleNavigate = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    return (
        <div
            className={s.userMenu}
            ref={menuRef}>
            <button
                className={s.avatarButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={t('userMenu.userMenuLabel')}>
                <img
                    src={defaultAvatar}
                    alt="avatar"
                    className={s.avatar}
                />
            </button>

            {isOpen && (
                <div className={s.dropdown}>
                    <div className={s.userInfo}>
                        <span className={s.userName}>{user?.name}</span>
                        <span className={s.userPhone}>{user?.phoneNumber}</span>
                    </div>

                    <div className={s.menuItems}>
                        {isAdmin() && (
                            <>
                                <div className={s.menuLabel}>{t('userMenu.adminPanel')}</div>
                                <button className={s.menuItem} onClick={() => handleNavigate('/subjects')}>
                                    {t('admin.tabs.subjects')}
                                </button>
                                <button className={s.menuItem} onClick={() => handleNavigate('/templates')}>
                                    {t('admin.tabs.templates')}
                                </button>
                                <button className={s.menuItem} onClick={() => handleNavigate('/institution-types')}>
                                    {t('admin.tabs.institutionTypes')}
                                </button>
                                <button className={s.menuItem} onClick={() => handleNavigate('/subscriptions')}>
                                    {t('admin.tabs.subscriptions')}
                                </button>
                                <button className={s.menuItem} onClick={() => handleNavigate('/materials')}>
                                    {t('admin.tabs.materials')}
                                </button>
                                <div className={s.menuDivider} />
                            </>
                        )}
                        <button
                            className={s.menuItem}
                            onClick={handleProfileClick}>
                            {t('userMenu.myProfile')}
                        </button>
                        <button
                            className={`${s.menuItem} ${s.danger}`}
                            onClick={handleLogout}>
                            {t('userMenu.logout')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
