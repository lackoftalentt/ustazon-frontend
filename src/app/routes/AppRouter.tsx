import { Loader } from '@/shared/ui/Loader/ui/Loader';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { MainLayout } from '@/app/layouts/MainLayout';

const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'));
const HomePage = lazy(() => import('@/pages/home'));
// const DashboardPage = lazy(() => import('@/pages/dashboard'));

export const AppRouter = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route element={<AuthLayout />}>
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
                </Route>

                <Route element={<MainLayout />}>
                    <Route
                        path="/"
                        element={<HomePage />}
                    />
                    {/* <Route
                        path="/dashboard"
                        element={<DashboardPage />}
                    /> */}
                </Route>
            </Routes>
        </Suspense>
    );
};
