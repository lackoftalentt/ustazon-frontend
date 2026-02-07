import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Presentation, FileCheck, Video, BookOpen, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import s from './AIToolLayout.module.scss';

interface AIToolLayoutProps {
    children: ReactNode;
    actions?: ReactNode;
}

const tools = [
    {
        id: 'chat',
        path: '/ai-chat',
        icon: MessageSquare,
        name: 'AI Чат'
    },
    {
        id: 'lesson',
        path: '/ai-lesson',
        icon: BookOpen,
        name: 'Сабақ жоспары'
    },
    {
        id: 'qmj',
        path: '/ai-qmj',
        icon: FileText,
        name: 'ҚМЖ'
    },
    {
        id: 'preza',
        path: '/ai-preza',
        icon: Presentation,
        name: 'Презентация'
    },
    {
        id: 'test',
        path: '/ai-test',
        icon: FileCheck,
        name: 'Тест / СОР'
    },
    {
        id: 'manim',
        path: '/ai-manim',
        icon: Video,
        name: 'Manim видео'
    }
];

export const AIToolLayout = ({ children, actions }: AIToolLayoutProps) => {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className={s.layout}>
            {/* Mobile Overlay */}
            <div
                className={`${s.overlay} ${isMobileOpen ? s.visible : ''}`}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${s.sidebar} ${isMobileOpen ? s.mobileOpen : ''} ${isExpanded ? s.expanded : s.collapsed}`}>
                <div className={s.sidebarHeader}>
                    {isExpanded && <span className={s.sidebarTitle}>AI құралдар</span>}
                    <button
                        className={s.collapseBtn}
                        onClick={() => setIsExpanded(!isExpanded)}
                        title={isExpanded ? "Свернуть" : "Развернуть"}
                    >
                        {isExpanded ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>

                <nav className={s.nav}>
                    {tools.map(tool => {
                        const Icon = tool.icon;
                        const isActive = location.pathname === tool.path;
                        return (
                            <Link
                                key={tool.id}
                                to={tool.path}
                                className={`${s.navItem} ${isActive ? s.active : ''}`}
                                onClick={() => setIsMobileOpen(false)}
                                title={!isExpanded ? tool.name : undefined}
                            >
                                <Icon size={20} strokeWidth={2} />
                                {isExpanded && <span>{tool.name}</span>}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <div className={s.main}>
                <div className={s.topBar}>
                    <button
                        className={s.mobileToggle}
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                    >
                        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {actions && (
                        <div className={s.actions}>
                            {actions}
                        </div>
                    )}
                </div>

                <main className={s.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};
