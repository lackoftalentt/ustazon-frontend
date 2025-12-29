import { Header } from '@/widgets/header';
import s from './MainLayout.module.scss';
import { Outlet } from 'react-router-dom';

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
