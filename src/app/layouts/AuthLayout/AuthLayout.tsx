import { Outlet } from 'react-router';
import s from './AuthLayout.module.scss';

export const AuthLayout = () => {
    return (
        <main className={s.authWrapper}>
            <Outlet />
        </main>
    );
};
