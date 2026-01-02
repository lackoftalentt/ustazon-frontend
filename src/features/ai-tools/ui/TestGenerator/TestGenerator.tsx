import { useState } from 'react';
import { aiApi } from '@/shared/api/ai';
import { FileCheck, CheckCircle, ListChecks, HelpCircle, Calculator, Brain } from 'lucide-react';
import { AIGeneratorLayout } from '@/features/ai-tools/ui/components/AIGeneratorLayout/AIGeneratorLayout';
import { AIInput } from '@/features/ai-tools/ui/components/AIInput/AIInput';
import { AISelect } from '@/features/ai-tools/ui/components/AISelect/AISelect';
import { AIButton } from '@/features/ai-tools/ui/components/AIButton/AIButton';
import { AICard } from '@/features/ai-tools/ui/components/AICard/AICard';

export const TestGenerator = () => {
    const [subject, setSubject] = useState('');
    const [grade, setGrade] = useState('');
    const [topic, setTopic] = useState('');
    const [questionCount, setQuestionCount] = useState(15);
    const [difficulty, setDifficulty] = useState('medium');
    const [model, setModel] = useState('gemini-2.5-flash');
    const [isGenerating, setIsGenerating] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleGenerate = async () => {
        if (!subject || !grade || !topic) return;

        try {
            setIsGenerating(true);
            setIsSuccess(false);

            const blob = await aiApi.generateTest(
                subject,
                grade,
                topic,
                questionCount,
                difficulty,
                model
            );

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Тест_${topic.replace(/\s+/g, '_')}_${grade.replace(/\s+/g, '_')}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setIsSuccess(true);
            setSubject('');
            setTopic('');
            setQuestionCount(15);
        } catch (err) {
            console.error('Error generating test:', err);
        } finally {
            setIsGenerating(false);
        }
    };

    const form = (
        <>
            <AIInput
                label="Предмет"
                placeholder="Например: Физика"
                value={subject}
                onChange={e => setSubject(e.target.value)}
            />

            <AISelect
                label="Класс"
                value={grade}
                onChange={e => setGrade(e.target.value)}
            >
                <option value="">Выберите класс</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(n => (
                    <option key={n} value={`${n} класс`}>{n} класс</option>
                ))}
            </AISelect>

            <AIInput
                label="Тема теста"
                placeholder="Например: Законы Ньютона"
                value={topic}
                onChange={e => setTopic(e.target.value)}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <AIInput
                    label="Количество вопросов"
                    type="number"
                    min={5}
                    max={50}
                    value={questionCount}
                    onChange={e => setQuestionCount(parseInt(e.target.value))}
                />
                <AISelect
                    label="Сложность"
                    value={difficulty}
                    onChange={e => setDifficulty(e.target.value)}
                >
                    <option value="easy">Базовый</option>
                    <option value="medium">Средний</option>
                    <option value="hard">Высокий</option>
                    <option value="mixed">Смешанный</option>
                </AISelect>
            </div>

            <AISelect
                label="AI Модель"
                value={model}
                onChange={e => setModel(e.target.value)}
            >
                <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                <option value="gpt-4o-mini">GPT-4o Mini</option>
                <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
            </AISelect>

            <AIButton
                onClick={handleGenerate}
                disabled={isGenerating || !subject || !grade || !topic}
                style={{ marginTop: '1rem' }}
                icon={isGenerating ? <FileCheck className="animate-pulse" /> : <FileCheck />}
            >
                {isGenerating ? 'Создаем тест...' : 'Сгенерировать тест'}
            </AIButton>
        </>
    );

    const successPreview = isSuccess ? (
        <div style={{ textAlign: 'center', animation: 'fadeIn 0.5s ease' }}>
            <CheckCircle size={64} color="#16a34a" style={{ marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.5rem', fontWeight: 600, color: '#1b5a42', marginBottom: '1rem' }}>
                Тест успешно создан!
            </h3>
            <p style={{ color: '#737373', marginBottom: '2rem' }}>
                Файл с заданиями и ответами скачан на ваше устройство.
            </p>
            <AIButton variant="secondary" onClick={() => setIsSuccess(false)}>
                Создать еще один
            </AIButton>
        </div>
    ) : null;

    const featuresPreview = !isSuccess ? (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1b5a42' }}>
                Структура теста:
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <AICard hoverable className="flex flex-col gap-3 items-start">
                    <ListChecks size={24} color="#2f8450" />
                    <span className="font-medium">Тесты</span>
                    <span className="text-sm text-slate-500">Вопросы с выбором</span>
                </AICard>
                <AICard hoverable className="flex flex-col gap-3 items-start">
                    <HelpCircle size={24} color="#2f8450" />
                    <span className="font-medium">Открытые</span>
                    <span className="text-sm text-slate-500">Вопросы на размышление</span>
                </AICard>
                <AICard hoverable className="flex flex-col gap-3 items-start">
                    <Calculator size={24} color="#2f8450" />
                    <span className="font-medium">Задачи</span>
                    <span className="text-sm text-slate-500">Практическое применение</span>
                </AICard>
                <AICard hoverable className="flex flex-col gap-3 items-start">
                    <Brain size={24} color="#2f8450" />
                    <span className="font-medium">Ответы</span>
                    <span className="text-sm text-slate-500">Ключи ко всем заданиям</span>
                </AICard>
            </div>
        </div>
    ) : null;

    return (
        <AIGeneratorLayout
            title="Генератор тестов"
            description="СОР, СОЧ и проверочные работы за пару кликов"
            icon={<FileCheck color="#2f8450" size={28} />}
            form={form}
            preview={isSuccess ? successPreview : featuresPreview}
            isGenerating={isGenerating}
        />
    );
};
