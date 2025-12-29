import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/entities/user';
import defaultAvatar from '@/shared/assets/images/profile-image.jpg';
import s from './UserMenu.module.scss';

export const UserMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

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
        return () => document.removeEventListener('mousedown', handleClickOutside);
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

    return (
        <div
            className={s.userMenu}
            ref={menuRef}>
            <button
                className={s.avatarButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Меню пользователя">
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
                        <button
                            className={s.menuItem}
                            onClick={handleProfileClick}>
                            Мой профиль
                        </button>
                        <button
                            className={`${s.menuItem} ${s.danger}`}
                            onClick={handleLogout}>
                            Выйти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
