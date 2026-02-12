import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/entities/user';
import { Container } from '@/shared/ui/container';

import { SubjectsTab } from './SubjectsTab';
import { TemplatesTab } from './TemplatesTab';
import { WindowsTab } from './WindowsTab';
import { InstitutionTypesTab } from './InstitutionTypesTab';
import { SubscriptionsTab } from './SubscriptionsTab';
import s from './AdminPage.module.scss';

const TABS = [
    'subjects',
    'templates',
    'windows',
    'institutionTypes',
    'subscriptions',
] as const;

type TabKey = (typeof TABS)[number];

export const AdminPage = () => {
    const { t } = useTranslation();
    const { isAdmin } = useAuthStore();
    const [activeTab, setActiveTab] = useState<TabKey>('subjects');

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    const tabComponents: Record<TabKey, React.ReactNode> = {
        subjects: <SubjectsTab />,
        templates: <TemplatesTab />,
        windows: <WindowsTab />,
        institutionTypes: <InstitutionTypesTab />,
        subscriptions: <SubscriptionsTab />,
    };

    return (
        <Container>
            <div className={s.adminPage}>
                <div className={s.header}>
                    <h1 className={s.title}>{t('admin.title')}</h1>
                    <p className={s.subtitle}>{t('admin.subtitle')}</p>
                </div>

                <div className={s.tabs}>
                    {TABS.map(tab => (
                        <button
                            key={tab}
                            className={`${s.tab} ${activeTab === tab ? s.tabActive : ''}`}
                            onClick={() => setActiveTab(tab)}>
                            {t(`admin.tabs.${tab}`)}
                        </button>
                    ))}
                </div>

                <div className={s.tabContent}>{tabComponents[activeTab]}</div>
            </div>
        </Container>
    );
};

export default AdminPage;
