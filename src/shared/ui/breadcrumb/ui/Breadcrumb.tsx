import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import s from './Breadcrumb.module.scss';
import clsx from 'clsx';

interface BreadcrumbItem {
    label: string;
    path: string;
}

const routeLabels: Record<string, string> = {
    subjects: 'Каталог курсов',
    'subjects-materials': 'Материалы',
    detail: 'Детали',
    'ai-chat': 'ИИ чат',
    kmzh: 'КМЖБ',
    'subject-presentation-detail': 'Презентация',
    profile: 'Профиль',
    'profile-settings': 'Настройки профиля',
    tests: 'Тесты',
    'take-test': 'Пройти тест',
    'lesson-plan': 'План урока'
};

export const Breadcrumb = () => {
    const location = useLocation();
    const navigate = useNavigate();

    if (location.pathname === '/') {
        return null;
    }

    const pathSegments = location.pathname.split('/').filter(Boolean);

    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Главная', path: '/' }];

    let currentPath = '';
    pathSegments.forEach(segment => {
        currentPath += `/${segment}`;

        const label = routeLabels[segment] || segment;

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
                className={clsx(s.backButton, s.item)}
                onClick={handleBack}>
                <ChevronLeft size={18} />
                <span>Назад</span>
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
