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
	// Subjects & Materials
	subjects: { labelKey: 'breadcrumb.subjectsCatalog', navigable: true },
	'subjects-materials': { labelKey: 'breadcrumb.materials', navigable: true },
	'subject-windows': { labelKey: 'breadcrumb.windows', navigable: true },
	detail: { labelKey: 'breadcrumb.fullInfo', navigable: false },

	// AI Tools
	'ai-chat': { labelKey: 'breadcrumb.aiChat', navigable: true },
	'ai-lesson': { labelKey: 'breadcrumb.aiLesson', navigable: true },
	'ai-qmj': { labelKey: 'breadcrumb.aiQMJ', navigable: true },
	'ai-preza': { labelKey: 'breadcrumb.aiPresentation', navigable: true },
	'ai-test': { labelKey: 'breadcrumb.aiTest', navigable: true },
	'ai-manim': { labelKey: 'breadcrumb.aiManim', navigable: true },

	// Lesson Plans
	'lesson-plans': { labelKey: 'breadcrumb.lessonPlan', navigable: true },
	'lesson-plans-list': { labelKey: 'breadcrumb.lessonPlanList', navigable: true },

	// KMZH
	kmzh: { labelKey: 'breadcrumb.kmzh', navigable: true },

	// Profile
	profile: { labelKey: 'breadcrumb.profile', navigable: true },
	'profile-settings': { labelKey: 'breadcrumb.profileSettings', navigable: true },

	// Tests
	tests: { labelKey: 'breadcrumb.tests', navigable: true },
	'take-test': { labelKey: 'breadcrumb.takeTest', navigable: true },

	// Admin
	admin: { labelKey: 'breadcrumb.admin', navigable: true },
	templates: { labelKey: 'breadcrumb.templates', navigable: true },
	'institution-types': { labelKey: 'breadcrumb.institutionTypes', navigable: true },
	subscriptions: { labelKey: 'breadcrumb.subscriptions', navigable: true },
	materials: { labelKey: 'breadcrumb.materialsAdmin', navigable: true },

	// Legacy
	'subject-presentation-detail': { labelKey: 'breadcrumb.presentation', navigable: true },
}

// Segments that are dynamic params (IDs, codes) — should be hidden
const isDynamicSegment = (_segment: string, index: number, allSegments: string[]): boolean => {
	if (index === 0) return false

	const prevSegment = allSegments[index - 1]

	// /subjects-materials/:subjectCode
	if (prevSegment === 'subjects-materials') return true
	// /subject-windows/:subjectCode
	if (prevSegment === 'subject-windows') return true
	// /subjects-materials/:code/detail/:cardId
	if (prevSegment === 'detail') return true
	// /take-test/:testId
	if (prevSegment === 'take-test') return true
	// /ai-lesson/:id, /ai-qmj/:id
	if (prevSegment === 'ai-lesson' || prevSegment === 'ai-qmj') return true
	// /lesson-plans/:code/:quarter/:grade — all params after lesson-plans
	if (allSegments[0] === 'lesson-plans' && index >= 1) return true
	// /lesson-plans-list/:grade/:quarter
	if (allSegments[0] === 'lesson-plans-list' && index >= 1) return true

	return false
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

		// Skip dynamic segments (IDs, codes)
		if (isDynamicSegment(segment, index, pathSegments)) {
			return
		}

		const config = routeConfig[segment]
		if (!config) return

		breadcrumbs.push({
			label: t(config.labelKey),
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
