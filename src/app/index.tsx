import { StrictMode } from 'react';
import { RouterProvider, ToastProvider } from './providers';
import { AppRouter } from './routes';
import '@/shared/styles/global.scss';

export const App = () => {
    return (
        <StrictMode>
            <RouterProvider>
                <AppRouter />
                <ToastProvider />
            </RouterProvider>
        </StrictMode>
    );
};
