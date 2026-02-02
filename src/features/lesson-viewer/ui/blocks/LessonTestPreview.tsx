import { useQuery } from '@tanstack/react-query';
import { testApi } from '@/shared/api/testApi';
import type { TestBlock } from '@/shared/api/lessonApi';
import { Loader2 } from 'lucide-react';
import s from '../LessonPageLayout/LessonPageLayout.module.scss';

interface Props {
    block: TestBlock;
}

export const LessonTestPreview = ({ block }: Props) => {
    const { data: test, isLoading, error } = useQuery({
        queryKey: ['test-preview', block.test_id],
        queryFn: () => testApi.getTestById(block.test_id),
        refetchOnWindowFocus: false,
        staleTime: 30_000,
    });

    if (isLoading) {
        return (
            <div className={s.testLoading}>
                <Loader2 size={24} className="animate-spin" />
                <span>Тест жүктелуде...</span>
            </div>
        );
    }

    if (error || !test) {
        return (
            <div className={s.testError}>
                Тестті жүктеу мүмкін болмады
            </div>
        );
    }

    return (
        <div className={s.testBlock}>
            <h3 className={s.testTitle}>Тест: {test.title}</h3>
            <div className={s.testQuestions}>
                {test.questions.map((q, qi) => (
                    <div key={q.id} className={s.testQuestion}>
                        <p className={s.testQuestionText}>
                            {qi + 1}. {q.text}
                        </p>
                        <div className={s.testAnswers}>
                            {q.answers.map((a, ai) => (
                                <div key={a.id} className={s.testAnswer}>
                                    <span className={s.testAnswerLetter}>
                                        {String.fromCharCode(65 + ai)})
                                    </span>
                                    <span>{a.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
