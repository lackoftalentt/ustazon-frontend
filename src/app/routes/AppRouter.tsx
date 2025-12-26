import { Loader } from '@/shared/ui/Loader/ui/Loader';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { MainLayout } from '@/app/layouts/MainLayout';
import { GuestRoute } from './GuestRoute';
import { ProtectedRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'));
const HomePage = lazy(() => import('@/pages/home'));
const CoursesCatalogPage = lazy(() => import('@/pages/courses-catalog'));
const CoursePage = lazy(() => import('@/pages/course'));
const CourseDetailPage = lazy(() => import('@/pages/course-detail'));
const AIChatPage = lazy(() => import('@/pages/ai-chat'));
const CourseWorkSheetsPage = lazy(() => import('@/pages/course-work-sheets'));
const CourseKmzhPage = lazy(() => import('@/pages/course-kmzh'));
const CoursePresentationsPage = lazy(
    () => import('@/pages/course-presentations')
);

export const AppRouter = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                {/* Guest routes - только для неавторизованных пользователей */}
                <Route element={<GuestRoute />}>
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
                </Route>

                {/* Public routes - доступны всем */}
                <Route element={<MainLayout />}>
                    <Route
                        path="/"
                        element={<HomePage />}
                    />
                    <Route
                        path="/courses-catalog"
                        element={<CoursesCatalogPage />}
                    />
                </Route>

                {/* Protected routes - только для авторизованных пользователей */}
                <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                        <Route
                            path="/course"
                            element={<CoursePage />}
                        />
                        <Route
                            path="course-detail"
                            element={<CourseDetailPage />}
                        />
                        <Route
                            path="ai-chat"
                            element={<AIChatPage />}
                        />
                        <Route
                            path="course/kmzh"
                            element={<CourseKmzhPage />}
                        />
                        <Route
                            path="course/work-sheets"
                            element={<CourseWorkSheetsPage />}
                        />
                        <Route
                            path="course/presentations"
                            element={<CoursePresentationsPage />}
                        />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
};
