import { Header } from '@/widgets/header';
import { Breadcrumb } from '@/shared/ui/breadcrumb';
import s from './MainLayout.module.scss';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <>
            <Header />
            <main className={s.mainLayout}>
                <Breadcrumb />
                <Outlet />
            </main>
        </>
    );
};
