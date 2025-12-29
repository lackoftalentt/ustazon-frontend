import { Loader } from '@/shared/ui/loader/ui/Loader';
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/app/layouts/AuthLayout';
import { MainLayout } from '@/app/layouts/MainLayout';
import LessonPlanQuarterPage from '@/pages/lesson-plan';

const LoginPage = lazy(() => import('@/pages/login'));
const RegisterPage = lazy(() => import('@/pages/register'));
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'));
const HomePage = lazy(() => import('@/pages/home'));
const SubjectsMaterialPage = lazy(() => import('@/pages/subjects-materials'));
const SubjectPage = lazy(() => import('@/pages/subject'));
const SubjectDetailPage = lazy(() => import('@/pages/subject-detail'));
const AIChatPage = lazy(() => import('@/pages/ai-chat'));
const SubjectWorkSheetsPage = lazy(() => import('@/pages/subject-work-sheets'));
const SubjectKmzhPage = lazy(() => import('@/pages/subject-kmzh'));
const SubjectPresentationsPage = lazy(
    () => import('@/pages/subject-presentations')
);
const KmzhPage = lazy(() => import('@/pages/kmzh'));
const SubjectPresentationDetailPage = lazy(
    () => import('@/pages/subject-presentation-detail')
);

export const AppRouter = () => {
    return (
        <Suspense fallback={<Loader />}>
            <Routes>
                <Route element={<AuthLayout />}>
                    <Route
                        path="login"
                        element={<LoginPage />}
                    />
                    <Route
                        path="register"
                        element={<RegisterPage />}
                    />
                    <Route
                        path="reset-password"
                        element={<ResetPasswordPage />}
                    />
                </Route>

                <Route
                    path="/"
                    element={<MainLayout />}>
                    <Route
                        index
                        element={<HomePage />}
                    />

                    <Route
                        path="subjects-material"
                        element={<SubjectsMaterialPage />}
                    />
                    <Route
                        path="subject"
                        element={<SubjectPage />}
                    />
                    <Route
                        path="subject-detail"
                        element={<SubjectDetailPage />}
                    />
                    <Route
                        path="ai-chat"
                        element={<AIChatPage />}
                    />
                    <Route
                        path="subject/kmzh"
                        element={<SubjectKmzhPage />}
                    />
                    <Route
                        path="subject/work-sheets"
                        element={<SubjectWorkSheetsPage />}
                    />
                    <Route
                        path="subject/presentations"
                        element={<SubjectPresentationsPage />}
                    />
                    <Route
                        path="kmzh"
                        element={<KmzhPage />}
                    />
                    <Route
                        path="subject-presentation-detail"
                        element={<SubjectPresentationDetailPage />}
                    />

                    <Route path="lesson-plan">
                        <Route
                            index
                            element={
                                <Navigate
                                    to="5/q1"
                                    replace
                                />
                            }
                        />
                        <Route
                            path=":grade/:quarter"
                            element={<LessonPlanQuarterPage />}
                        />
                    </Route>
                </Route>
            </Routes>
        </Suspense>
    );
};
