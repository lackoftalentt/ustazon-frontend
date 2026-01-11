import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import s from './Breadcrumb.module.scss';

interface BreadcrumbItem {
    label: string;
    path: string;
}

interface RouteConfig {
    label: string;
    navigable: boolean;
}

const routeConfig: Record<string, RouteConfig> = {
    subjects: { label: 'Пәндер каталогы', navigable: true },
    'subjects-materials': { label: 'Материалдар', navigable: true },
    'subject-windows': { label: 'Терезелер', navigable: true },
    detail: { label: 'Толық ақпарат', navigable: false },
    'ai-chat': { label: 'AI чат', navigable: true },
    kmzh: { label: 'КМЖБ', navigable: true },
    'subject-presentation-detail': { label: 'Презентация', navigable: true },
    profile: { label: 'Профиль', navigable: true },
    'profile-settings': { label: 'Профиль баптаулары', navigable: true },
    tests: { label: 'Тесттер', navigable: true },
    'take-test': { label: 'Тест тапсыру', navigable: true },
    'lesson-plan': { label: 'Сабақ жоспары', navigable: true }
};

const isNavigableRoute = (path: string, segments: string[]): boolean => {
    const lastSegment = segments[segments.length - 1];

    if (path === '/') return true;

    if (routeConfig[lastSegment]) {
        return routeConfig[lastSegment].navigable;
    }

    const pathParts = path.split('/').filter(Boolean);

    if (pathParts[0] === 'subjects-materials' && pathParts.length === 2) {
        return true;
    }
    if (pathParts[0] === 'subject-windows' && pathParts.length === 2) {
        return true;
    }
    if (pathParts[0] === 'lesson-plan' && pathParts.length === 3) {
        return true;
    }

    return false;
};

const getRouteLabel = (segment: string, _fullPath: string, allSegments: string[]): string | null => {
    if (routeConfig[segment]) {
        return routeConfig[segment].label;
    }

    const segmentIndex = allSegments.indexOf(segment);
    if (segmentIndex > 0) {
        const prevSegment = allSegments[segmentIndex - 1];

        if (prevSegment === 'subjects-materials' || prevSegment === 'subject-windows') {
            return null;
        }
        if (prevSegment === 'detail') {
            return null;
        }
        if (prevSegment === 'lesson-plan') {
            return null;
        }
        if (allSegments[0] === 'lesson-plan' && segmentIndex === 2) {
            return null;
        }
    }

    return null;
};

export const Breadcrumb = () => {
    const location = useLocation();
    const navigate = useNavigate();

    if (location.pathname === '/') {
        return null;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Басты бет', path: '/' }];

    let currentPath = '';
    pathSegments.forEach((segment, index) => {
        currentPath += `/${segment}`;

        const segmentsUpToHere = pathSegments.slice(0, index + 1);

        if (!isNavigableRoute(currentPath, segmentsUpToHere)) {
            return;
        }

        const label = getRouteLabel(segment, currentPath, pathSegments);

        if (label === null) {
            return;
        }

        breadcrumbs.push({
            label,
            path: currentPath
        });
    });

    const handleBack = () => {
        if (breadcrumbs.length > 1) {
            navigate(breadcrumbs[breadcrumbs.length - 2].path);
        } else {
            navigate('/');
        }
    };

    return (
        <nav className={s.breadcrumb}>
            <li
                className={s.backButton}
                onClick={handleBack}>
                <ChevronLeft size={18} />
                <span>Артқа</span>
            </li>

            <div className={s.separator} />

            <ol className={s.list}>
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <li
                            key={item.path}
                            className={s.item}>
                            {!isLast ? (
                                <>
                                    <Link
                                        to={item.path}
                                        className={s.link}>
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
                    );
                })}
            </ol>
        </nav>
    );
};
