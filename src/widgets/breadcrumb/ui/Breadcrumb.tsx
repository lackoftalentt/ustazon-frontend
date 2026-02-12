import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import s from './Breadcrumb.module.scss'

interface BreadcrumbItem {
	label: string
	path: string
}

interface RouteConfig {
	labelKey: string
	navigable: boolean
}

const routeConfig: Record<string, RouteConfig> = {
	subjects: { labelKey: 'breadcrumb.subjectsCatalog', navigable: true },
	'subjects-materials': { labelKey: 'breadcrumb.materials', navigable: true },
	'subject-windows': { labelKey: 'breadcrumb.windows', navigable: true },
	detail: { labelKey: 'breadcrumb.fullInfo', navigable: false },
	'ai-chat': { labelKey: 'breadcrumb.aiChat', navigable: true },
	kmzh: { labelKey: 'breadcrumb.kmzh', navigable: true },
	'subject-presentation-detail': { labelKey: 'breadcrumb.presentation', navigable: true },
	profile: { labelKey: 'breadcrumb.profile', navigable: true },
	'profile-settings': { labelKey: 'breadcrumb.profileSettings', navigable: true },
	tests: { labelKey: 'breadcrumb.tests', navigable: true },
	'take-test': { labelKey: 'breadcrumb.takeTest', navigable: true },
	'lesson-plan': { labelKey: 'breadcrumb.lessonPlan', navigable: true }
}

const isNavigableRoute = (path: string, segments: string[]): boolean => {
	const lastSegment = segments[segments.length - 1]

	if (path === '/') return true

	if (routeConfig[lastSegment]) {
		return routeConfig[lastSegment].navigable
	}

	const pathParts = path.split('/').filter(Boolean)

	if (pathParts[0] === 'subjects-materials' && pathParts.length === 2) {
		return true
	}
	if (pathParts[0] === 'subject-windows' && pathParts.length === 2) {
		return true
	}
	if (pathParts[0] === 'lesson-plan' && pathParts.length === 3) {
		return true
	}

	return false
}

const getRouteLabel = (
	segment: string,
	_fullPath: string,
	allSegments: string[],
	t: (key: string) => string
): string | null => {
	if (routeConfig[segment]) {
		return t(routeConfig[segment].labelKey)
	}

	const segmentIndex = allSegments.indexOf(segment)
	if (segmentIndex > 0) {
		const prevSegment = allSegments[segmentIndex - 1]

		if (
			prevSegment === 'subjects-materials' ||
			prevSegment === 'subject-windows'
		) {
			return null
		}
		if (prevSegment === 'detail') {
			return null
		}
		if (prevSegment === 'lesson-plan') {
			return null
		}
		if (allSegments[0] === 'lesson-plan' && segmentIndex === 2) {
			return null
		}
	}

	return null
}

export const Breadcrumb = () => {
	const location = useLocation()
	const navigate = useNavigate()
	const { t } = useTranslation()

	if (location.pathname === '/') {
		return null
	}

	const pathSegments = location.pathname.split('/').filter(Boolean)

	const breadcrumbs: BreadcrumbItem[] = [{ label: t('breadcrumb.home'), path: '/' }]

	let currentPath = ''
	pathSegments.forEach((segment, index) => {
		currentPath += `/${segment}`

		const segmentsUpToHere = pathSegments.slice(0, index + 1)

		if (!isNavigableRoute(currentPath, segmentsUpToHere)) {
			return
		}

		const label = getRouteLabel(segment, currentPath, pathSegments, t)

		if (label === null) {
			return
		}

		breadcrumbs.push({
			label,
			path: currentPath
		})
	})

	const handleBack = () => {
		navigate(-1)
	}

	return (
		<nav className={s.breadcrumb}>
			<li
				className={s.backButton}
				onClick={handleBack}
			>
				<ChevronLeft size={18} />
				<span>{t('breadcrumb.back')}</span>
			</li>

			<div className={s.separator} />

			<ol className={s.list}>
				{breadcrumbs.map((item, index) => {
					const isLast = index === breadcrumbs.length - 1

					return (
						<li
							key={item.path}
							className={s.item}
						>
							{!isLast ? (
								<>
									<Link
										to={item.path}
										className={s.link}
									>
										{item.label}
									</Link>
									<ChevronRight
										size={14}
										className={s.chevron}
									/>
								</>
							) : (
								<span className={s.current}>{item.label}</span>
							)}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}
