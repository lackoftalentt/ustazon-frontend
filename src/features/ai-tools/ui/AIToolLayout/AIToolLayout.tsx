import type { ReactNode } from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare, Presentation, FileCheck, Video } from 'lucide-react';
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
        name: 'AI Chat'
    },
    {
        id: 'preza',
        path: '/ai-preza',
        icon: Presentation,
        name: 'Презентации'
    },
    {
        id: 'test',
        path: '/ai-test',
        icon: FileCheck,
        name: 'Тесты/СОР'
    },
    {
        id: 'manim',
        path: '/ai-manim',
        icon: Video,
        name: 'Manim Visualizer'
    }
];

export const AIToolLayout = ({ children, actions }: AIToolLayoutProps) => {
    const location = useLocation();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className={s.layout}>
            {/* Mobile Overlay */}
            <div
                className={`${s.overlay} ${isMobileOpen ? s.visible : ''}`}
                onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar */}
            <aside className={`${s.sidebar} ${isMobileOpen ? s.open : ''}`}>
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
                                title={tool.name}
                            >
                                <Icon size={24} strokeWidth={2} />
                                <span>{tool.name}</span>
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
                        {isMobileOpen ? <X /> : <Menu />}
                    </button>

                    <div className={s.actions}>
                        {actions}
                    </div>
                </div>

                <main className={s.content}>
                    {children}
                </main>
            </div>
        </div>
    );
};
