import { StrictMode } from 'react';
import { QueryProvider, RouterProvider, ToastProvider } from './providers';
import { AppRouter } from './routes';
import '@/shared/styles/global.scss';

export const App = () => {
    return (
        <StrictMode>
            <RouterProvider>
                {' '}
                <QueryProvider>
                    <AppRouter />
                </QueryProvider>
                <ToastProvider />
            </RouterProvider>
        </StrictMode>
    );
};
