import s from './QuickCommandsCompact.module.scss';

interface QuickCommandsCompactProps {
    onSelectCommand: (command: string) => void;
}

const quickActions = [
    {
        id: 'lesson_plan',
        icon: '📝',
        title: 'Сабақ жоспары',
        description: 'Толық сабақ жоспарын жасау',
        prompt: 'Сабақ жоспарын жасаңыз'
    },
    {
        id: 'test',
        icon: '📋',
        title: 'Тест / СОР',
        description: 'Тест немесе тексеру жұмысын жасау',
        prompt: 'Тест жасаңыз'
    },
    {
        id: 'homework',
        icon: '✏️',
        title: 'Үй тапсырмасы',
        description: 'Қызықты үй тапсырмасын жасау',
        prompt: 'Үй тапсырмасын жасаңыз'
    },
    {
        id: 'presentation',
        icon: '📊',
        title: 'Презентация',
        description: 'PowerPoint презентация жасау',
        prompt: 'Презентация жасаңыз'
    },
    {
        id: 'rubric',
        icon: '⭐',
        title: 'Бағалау критерийлері',
        description: 'Бағалау критерийлерін жасау',
        prompt: 'Бағалау критерийлерін жасаңыз'
    },
    {
        id: 'explain',
        icon: '💡',
        title: 'Тақырыпты түсіндіру',
        description: 'Күрделі тақырыпты түсіндіруге көмектесу',
        prompt: 'Оқушыларға күрделі тақырыпты түсіндіруге көмектесіңіз'
    }
];

export const QuickCommandsCompact = ({ onSelectCommand }: QuickCommandsCompactProps) => {
    return (
        <div className={s.quickCommands}>
            <div className={s.welcome}>
                <h2 className={s.welcomeTitle}>Бүгін сізге қалай көмектесе аламын?</h2>
                <p className={s.welcomeSubtitle}>
                    Әрекетті таңдаңыз немесе өз сұрағыңызды жазыңыз
                </p>
            </div>

            <div className={s.actionsGrid}>
                {quickActions.map(action => (
                    <button
                        key={action.id}
                        className={s.actionCard}
                        onClick={() => onSelectCommand(action.prompt)}
                    >
                        <div className={s.actionIcon}>{action.icon}</div>
                        <div className={s.actionContent}>
                            <div className={s.actionTitle}>{action.title}</div>
                            <div className={s.actionDescription}>{action.description}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className={s.examples}>
                <div className={s.examplesTitle}>Немесе мынаны байқап көріңіз:</div>
                <div className={s.examplesList}>
                    <button
                        className={s.exampleChip}
                        onClick={() =>
                            onSelectCommand('Оқушыларды математиканы оқуға қалай ынталандыруға болады?')
                        }
                    >
                        Оқушыларды қалай ынталандыруға болады?
                    </button>
                    <button
                        className={s.exampleChip}
                        onClick={() =>
                            onSelectCommand(
                                'Тарих сабағына интерактивті белсенділік жасаңыз'
                            )
                        }
                    >
                        Интерактивті белсенділік
                    </button>
                    <button
                        className={s.exampleChip}
                        onClick={() =>
                            onSelectCommand('Қазақ тілі бойынша деңгейлік тапсырмалар')
                        }
                    >
                        Деңгейлік тапсырмалар
                    </button>
                </div>
            </div>
        </div>
    );
};
