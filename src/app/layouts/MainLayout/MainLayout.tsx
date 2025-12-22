import { Header } from '@/widgets/header';
import s from './MainLayout.module.scss';
import { Outlet } from 'react-router';

export const MainLayout = () => {
    return (
        <>
            {' '}
            <Header />
            <main className={s.mainLayout}>
                {' '}
                <Outlet />
            </main>
        </>
    );
};
