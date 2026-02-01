import { AuthLayout } from '@/app/layouts/AuthLayout'
import { MainLayout } from '@/app/layouts/MainLayout'
import LessonPlansPage from '@/pages/lesson-plans'
import { LoaderPage } from '@/pages/loader-page/ui/LoaderPage'
import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'

const ScrollToTop = () => {
	const { pathname } = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [pathname])

	return null
}

const LoginPage = lazy(() => import('@/pages/login'))
const RegisterPage = lazy(() => import('@/pages/register'))
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'))
const HomePage = lazy(() => import('@/pages/home'))
const SubjectsMaterialsPage = lazy(() => import('@/pages/subjects-materials'))
const SubjectsPage = lazy(() => import('@/pages/subjects'))
const SubjectDetailPage = lazy(() => import('@/pages/subject-detail'))
const SubjectWindowsPage = lazy(() => import('@/pages/subject-windows'))
const AIChatPage = lazy(() => import('@/pages/ai-chat'))
const AIPrezaPage = lazy(() => import('@/pages/ai-preza'))
const AITestPage = lazy(() => import('@/pages/ai-test'))
const AIManimPage = lazy(() => import('@/pages/ai-manim'))
const LessonPlansListPage = lazy(() => import('@/pages/lesson-plans-list'))
const ProfilePage = lazy(() => import('@/pages/profile'))
const ProfileSettingsPage = lazy(() => import('@/pages/profile-settings'))
const TestsPage = lazy(() => import('@/pages/tests'))
const TakeTestPage = lazy(() => import('@/pages/take-test'))
const NotFoundPage = lazy(() => import('@/pages/not-found'))

export const AppRouter = () => {
	return (
		<>
			<ScrollToTop />
			<Suspense fallback={<LoaderPage />}>
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
						element={<MainLayout />}
					>
						<Route
							index
							element={<HomePage />}
						/>
						<Route
							path="/subjects"
							element={
								<PrivateRoute>
									<SubjectsPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="subjects-materials/:subjectCode"
							element={
								<PrivateRoute>
									<SubjectsMaterialsPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/subjects-materials/:subjectCode/detail/:cardId"
							element={
								<PrivateRoute>
									<SubjectDetailPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="/subject-windows/:subjectCode"
							element={
								<PrivateRoute>
									<SubjectWindowsPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="ai-chat"
							element={
								<PrivateRoute>
									<AIChatPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="ai-preza"
							element={
								<PrivateRoute>
									<AIPrezaPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="ai-test"
							element={
								<PrivateRoute>
									<AITestPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="ai-manim"
							element={
								<PrivateRoute>
									<AIManimPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="profile"
							element={
								<PrivateRoute>
									<ProfilePage />
								</PrivateRoute>
							}
						/>
						<Route
							path="profile-settings"
							element={
								<PrivateRoute>
									<ProfileSettingsPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="tests"
							element={
								<PrivateRoute>
									<TestsPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="take-test/:testId"
							element={
								<PrivateRoute>
									<TakeTestPage />
								</PrivateRoute>
							}
						/>
						<Route
							path="lesson-plans/:code/:quarter?/:grade?"
							element={
								<PrivateRoute>
									<LessonPlansPage />
								</PrivateRoute>
							}
						/>
						<Route path="lesson-plans-list">
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
								element={
									<PrivateRoute>
										<LessonPlansListPage />
									</PrivateRoute>
								}
							/>
						</Route>
					</Route>

					<Route
						path="*"
						element={<NotFoundPage />}
					/>
				</Routes>
			</Suspense>
		</>
	)
}
