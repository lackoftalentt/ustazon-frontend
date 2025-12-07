import { Loader } from '@/shared/ui/Loader/Loader';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';

const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'));

export const AppRouter = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route
                    path="/login"
                    element={<LoginPage />}
                />
                <Route
                    path="/register"
                    element={<RegisterPage />}
                />
                <Route
                    path="/reset-password"
                    element={<ResetPasswordPage />}
                />
            </Routes>
        </Suspense>
    );
};
