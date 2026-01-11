import { AuthLayout } from '@/app/layouts/AuthLayout'
import { MainLayout } from '@/app/layouts/MainLayout'
import LessonPlanQuarterPage from '@/pages/lesson-plan'
import { LoaderPage } from '@/pages/loader-page/ui/LoaderPage'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

const LoginPage = lazy(() => import('@/pages/login'))
const RegisterPage = lazy(() => import('@/pages/register'))
const ResetPasswordPage = lazy(() => import('@/pages/reset-password'))
const HomePage = lazy(() => import('@/pages/home'))
const SubjectsMaterialsPage = lazy(() => import('@/pages/subjects-materials'))
const SubjectsPage = lazy(() => import('@/pages/subjects'))
const SubjectDetailPage = lazy(() => import('@/pages/subject-detail'))
const SubjectWindowsPage = lazy(() => import('@/pages/subject-windows'))
const AIChatPage = lazy(() => import('@/pages/ai-chat'))
const KmzhPage = lazy(() => import('@/pages/kmzh'))
const SubjectPresentationDetailPage = lazy(
	() => import('@/pages/subject-presentation-detail')
)
const ProfilePage = lazy(() => import('@/pages/profile'))
const ProfileSettingsPage = lazy(() => import('@/pages/profile-settings'))
const TestsPage = lazy(() => import('@/pages/tests'))
const TakeTestPage = lazy(() => import('@/pages/take-test'))

export const AppRouter = () => {
	return (
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
						element={<SubjectsPage />}
					/>
					<Route
						path="subjects-materials/:subjectCode"
						element={<SubjectsMaterialsPage />}
					/>
					<Route
						path="/subjects-materials/:subjectCode/detail/:cardId"
						element={<SubjectDetailPage />}
					/>
					<Route
						path="/subject-windows/:subjectCode"
						element={<SubjectWindowsPage />}
					/>
					<Route
						path="ai-chat"
						element={<AIChatPage />}
					/>
					<Route
						path="kmzh"
						element={<KmzhPage />}
					/>
					<Route
						path="subject-presentation-detail"
						element={<SubjectPresentationDetailPage />}
					/>
					<Route
						path="profile"
						element={<ProfilePage />}
					/>
					<Route
						path="profile-settings"
						element={<ProfileSettingsPage />}
					/>
					<Route
						path="tests"
						element={<TestsPage />}
					/>
					<Route
						path="take-test"
						element={<TakeTestPage />}
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
	)
}
