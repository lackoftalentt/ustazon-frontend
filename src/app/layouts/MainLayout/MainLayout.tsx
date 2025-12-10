import { Header } from '@/widgets/Header/ui/Header';
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
