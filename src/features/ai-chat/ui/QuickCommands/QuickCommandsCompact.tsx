import s from './QuickCommandsCompact.module.scss';

interface QuickCommandsCompactProps {
    onSelectCommand: (command: string) => void;
}

const quickActions = [
    {
        id: 'lesson_plan',
        icon: '📝',
        title: 'План урока',
        description: 'Создать подробный план урока',
        prompt: 'Создать план урока'
    },
    {
        id: 'test',
        icon: '📋',
        title: 'Тест / СОР',
        description: 'Сгенерировать тест или проверочную работу',
        prompt: 'Создать тест'
    },
    {
        id: 'homework',
        icon: '✏️',
        title: 'Домашнее задание',
        description: 'Создать интересное домашнее задание',
        prompt: 'Создать домашнее задание'
    },
    {
        id: 'presentation',
        icon: '📊',
        title: 'Презентация',
        description: 'Создать презентацию PowerPoint',
        prompt: 'Создать презентацию'
    },
    {
        id: 'rubric',
        icon: '⭐',
        title: 'Критерии оценивания',
        description: 'Разработать критерии оценивания',
        prompt: 'Создать критерии оценивания'
    },
    {
        id: 'explain',
        icon: '💡',
        title: 'Объяснить тему',
        description: 'Помочь объяснить сложную тему',
        prompt: 'Помоги объяснить сложную тему ученикам'
    }
];

export const QuickCommandsCompact = ({ onSelectCommand }: QuickCommandsCompactProps) => {
    return (
        <div className={s.quickCommands}>
            <div className={s.welcome}>
                <h2 className={s.welcomeTitle}>Чем могу помочь сегодня?</h2>
                <p className={s.welcomeSubtitle}>
                    Выберите действие или напишите свой запрос
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
                <div className={s.examplesTitle}>Или попробуйте:</div>
                <div className={s.examplesList}>
                    <button
                        className={s.exampleChip}
                        onClick={() =>
                            onSelectCommand('Как мотивировать учеников к изучению математики?')
                        }
                    >
                        Как мотивировать учеников?
                    </button>
                    <button
                        className={s.exampleChip}
                        onClick={() =>
                            onSelectCommand(
                                'Создай интерактивную активность для урока истории'
                            )
                        }
                    >
                        Интерактивная активность
                    </button>
                    <button
                        className={s.exampleChip}
                        onClick={() =>
                            onSelectCommand('Дифференцированные задания по русскому языку')
                        }
                    >
                        Дифференциация заданий
                    </button>
                </div>
            </div>
        </div>
    );
};
