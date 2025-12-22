import { Loader } from '@/shared/ui/Loader/ui/Loader';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { MainLayout } from '@/app/layouts/MainLayout';
import { CoursePage } from '@/pages/course';
import { CourseDetailPage } from '@/pages/course-detail';

const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'));
const HomePage = lazy(() => import('@/pages/home'));
const CoursesCatalogPage = lazy(() => import('@/pages/courses-catalog'));

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
                    <Route
                        path="/courses-catalog"
                        element={<CoursesCatalogPage />}
                    />
                    <Route
                        path="/course"
                        element={<CoursePage />}
                    />
                    <Route
                        path="course-detail"
                        element={<CourseDetailPage />}
                    />
                </Route>
            </Routes>
        </Suspense>
    );
};
