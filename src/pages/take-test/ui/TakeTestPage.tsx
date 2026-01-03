import { useEffect, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { Progress } from '@/shared/ui/progress';
import {
    Timer,
    ChevronRight,
    ChevronLeft,
    CheckCircle,
    XCircle,
    RotateCcw,
    Trophy,
    Clock,
    Target,
    AlertCircle,
    Flag
} from 'lucide-react';
import { useTestStore, type Question } from '@/features/take-test';
import s from './TakeTestPage.module.scss';

const mockQuestions: Question[] = [
    {
        id: 1,
        question: 'Алгебралық теңдеуді шешу дегеніміз не?',
        options: [
            'Теңдеудің белгісіз мәнін табу',
            'Теңдеуді жазу',
            'Теңдеуді сызу',
            'Теңдеуді оқу',
            'Теңдеуді есептеу'
        ],
        correctAnswer: 0
    },
    {
        id: 2,
        question: '2x + 5 = 15 теңдеуіндегі x-тің мәні қандай?',
        options: ['x = 5', 'x = 10', 'x = 15', 'x = 20', 'x = 25'],
        correctAnswer: 0
    },
    {
        id: 3,
        question: 'Квадрат теңдеудің дискриминанты қалай есептеледі?',
        options: [
            'D = b² - 4ac',
            'D = a² + b²',
            'D = √(b² - 4ac)',
            'D = b² + 4ac',
            'D = 2b - ac'
        ],
        correctAnswer: 0
    },
    {
        id: 4,
        question: 'Қандай сан 3-ке де, 4-ке де қалдықсыз бөлінеді?',
        options: ['12', '8', '15', '9', '20'],
        correctAnswer: 0
    },
    {
        id: 5,
        question: 'Пифагор теоремасы қалай жазылады?',
        options: [
            'a² + b² = c²',
            'a + b = c',
            'a × b = c',
            'a² - b² = c²',
            'a/b = c'
        ],
        correctAnswer: 0
    }
];

const TIME_LIMIT = 300;

export const TakeTestPage = () => {
    const navigate = useNavigate();
    const [isHydrated, setIsHydrated] = useState(false);

    const {
        questions,
        currentQuestionIndex,
        answers,
        timeLimit,
        startTime,
        isTestStarted,
        isTestCompleted,
        startTest,
        selectAnswer,
        nextQuestion,
        previousQuestion,
        goToQuestion,
        finishTest,
        resetTest,
        getScore,
        getElapsedTime,
        isQuestionAnswered
    } = useTestStore();

    // Wait for zustand to hydrate from localStorage
    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // Start test only if not already started (after hydration)
    useEffect(() => {
        if (isHydrated && !isTestStarted) {
            startTest(mockQuestions, TIME_LIMIT);
        }
    }, [isHydrated, isTestStarted, startTest]);

    // Check if time expired on page load (after hydration)
    useEffect(() => {
        if (isHydrated && isTestStarted && !isTestCompleted && startTime) {
            const elapsed = getElapsedTime();
            if (elapsed >= timeLimit) {
                finishTest();
            }
        }
    }, [isHydrated, isTestStarted, isTestCompleted, startTime, timeLimit, getElapsedTime, finishTest]);

    useEffect(() => {
        if (!isTestStarted || isTestCompleted || !startTime) return;

        const interval = setInterval(() => {
            const elapsed = getElapsedTime();
            if (elapsed >= timeLimit) {
                finishTest();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [
        isTestStarted,
        isTestCompleted,
        startTime,
        timeLimit,
        getElapsedTime,
        finishTest
    ]);

    const currentQuestion = questions[currentQuestionIndex];
    const totalQuestions = questions.length;
    const answeredCount = answers.filter(a => a !== null).length;
    const progress = (answeredCount / totalQuestions) * 100;
    const allQuestionsAnswered = answeredCount === totalQuestions;

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs
            .toString()
            .padStart(2, '0')}`;
    }, []);

    const remainingTime = useMemo(() => {
        if (!startTime) return timeLimit;
        return Math.max(0, timeLimit - getElapsedTime());
    }, [startTime, timeLimit, getElapsedTime]);

    const elapsedTime = getElapsedTime();

    const getTimeColor = useCallback(() => {
        if (remainingTime > 120) return 'safe';
        if (remainingTime > 60) return 'warning';
        return 'danger';
    }, [remainingTime]);

    const handleSelectAnswer = (optionIndex: number) => {
        if (isTestCompleted) return;
        selectAnswer(currentQuestionIndex, optionIndex);
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            nextQuestion();
        }
    };

    const handleFinishTest = () => {
        if (allQuestionsAnswered) {
            finishTest();
        }
    };

    const handleRestart = () => {
        resetTest();
        startTest(mockQuestions, TIME_LIMIT);
    };

    const score = getScore();
    const scorePercentage = Math.round((score / totalQuestions) * 100);

    const getScoreGrade = () => {
        if (scorePercentage >= 90)
            return { label: 'Өте жақсы!', color: 'excellent' };
        if (scorePercentage >= 70) return { label: 'Жақсы', color: 'good' };
        if (scorePercentage >= 50)
            return { label: 'Қанағаттанарлық', color: 'average' };
        return { label: 'Қайта оқу қажет', color: 'poor' };
    };

    if (isTestCompleted) {
        const grade = getScoreGrade();

        return (
            <main className={s.takeTestPage}>
                <Container className={s.container}>
                    <div className={s.resultsContainer}>
                        <div className={s.resultsHeader}>
                            <div className={s.trophyIcon}>
                                <Trophy size={48} />
                            </div>
                            <h1 className={s.resultsTitle}>Тест аяқталды!</h1>
                            <p className={s.resultsSubtitle}>
                                Нәтижелеріңіз төменде көрсетілген
                            </p>
                        </div>

                        <div className={s.resultsCard}>
                            <div className={s.scoreSection}>
                                <div
                                    className={`${s.scoreCircle} ${
                                        s[grade.color]
                                    }`}
                                    style={
                                        {
                                            '--score-percentage':
                                                scorePercentage
                                        } as React.CSSProperties
                                    }>
                                    <div className={s.scoreInner}>
                                        <div className={s.scoreValue}>
                                            {score}
                                            <span>/{totalQuestions}</span>
                                        </div>
                                        <div className={s.scorePercentage}>
                                            {scorePercentage}%
                                        </div>
                                    </div>
                                </div>
                                <div
                                    className={`${s.gradeLabel} ${
                                        s[grade.color]
                                    }`}>
                                    {grade.label}
                                </div>
                            </div>

                            <div className={s.statsGrid}>
                                <div className={s.statCard}>
                                    <div className={s.statIcon}>
                                        <CheckCircle size={24} />
                                    </div>
                                    <div className={s.statInfo}>
                                        <div className={s.statLabel}>
                                            Дұрыс жауаптар
                                        </div>
                                        <div className={s.statValue}>
                                            {score}
                                        </div>
                                    </div>
                                </div>
                                <div className={s.statCard}>
                                    <div className={`${s.statIcon} ${s.error}`}>
                                        <XCircle size={24} />
                                    </div>
                                    <div className={s.statInfo}>
                                        <div className={s.statLabel}>
                                            Қате жауаптар
                                        </div>
                                        <div className={s.statValue}>
                                            {totalQuestions - score}
                                        </div>
                                    </div>
                                </div>
                                <div className={s.statCard}>
                                    <div className={`${s.statIcon} ${s.time}`}>
                                        <Clock size={24} />
                                    </div>
                                    <div className={s.statInfo}>
                                        <div className={s.statLabel}>
                                            Жұмсалған уақыт
                                        </div>
                                        <div className={s.statValue}>
                                            {formatTime(elapsedTime)}
                                        </div>
                                    </div>
                                </div>
                                <div className={s.statCard}>
                                    <div
                                        className={`${s.statIcon} ${s.target}`}>
                                        <Target size={24} />
                                    </div>
                                    <div className={s.statInfo}>
                                        <div className={s.statLabel}>
                                            Дәлдік
                                        </div>
                                        <div className={s.statValue}>
                                            {scorePercentage}%
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={s.resultsButtons}>
                                <Button
                                    className={s.primaryButton}
                                    onClick={handleRestart}>
                                    <RotateCcw size={18} />
                                    Тестті қайта бастау
                                </Button>
                                <Button
                                    className={s.secondaryButton}
                                    onClick={() => navigate('/tests')}>
                                    Тесттер тізіміне оралу
                                </Button>
                            </div>
                        </div>

                        <div className={s.questionsReview}>
                            <h3 className={s.reviewTitle}>
                                Жауаптарыңызды қарау
                            </h3>
                            <div className={s.reviewList}>
                                {questions.map((question, index) => {
                                    const userAnswer = answers[index];
                                    const isCorrect =
                                        userAnswer === question.correctAnswer;

                                    return (
                                        <div
                                            key={question.id}
                                            className={`${s.reviewItem} ${
                                                isCorrect
                                                    ? s.correct
                                                    : s.incorrect
                                            }`}>
                                            <div className={s.reviewHeader}>
                                                <div
                                                    className={
                                                        s.reviewQuestionNumber
                                                    }>
                                                    Сұрақ {index + 1}
                                                </div>
                                                <div
                                                    className={`${
                                                        s.reviewBadge
                                                    } ${
                                                        isCorrect
                                                            ? s.correct
                                                            : s.incorrect
                                                    }`}>
                                                    {isCorrect ? (
                                                        <>
                                                            <CheckCircle
                                                                size={16}
                                                            />
                                                            Дұрыс
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle
                                                                size={16}
                                                            />
                                                            Қате
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={
                                                    s.reviewQuestionText
                                                }>
                                                {question.question}
                                            </div>
                                            <div className={s.reviewAnswers}>
                                                <div
                                                    className={`${
                                                        s.reviewAnswer
                                                    } ${
                                                        isCorrect
                                                            ? s.correct
                                                            : s.incorrect
                                                    }`}>
                                                    <span
                                                        className={
                                                            s.answerLabel
                                                        }>
                                                        Сіздің жауабыңыз:
                                                    </span>
                                                    <span
                                                        className={
                                                            s.answerText
                                                        }>
                                                        {userAnswer !== null
                                                            ? question.options[
                                                                  userAnswer
                                                              ]
                                                            : 'Жауап берілмеді'}
                                                    </span>
                                                </div>
                                                {!isCorrect && (
                                                    <div
                                                        className={`${s.reviewAnswer} ${s.correctAnswer}`}>
                                                        <span
                                                            className={
                                                                s.answerLabel
                                                            }>
                                                            Дұрыс жауап:
                                                        </span>
                                                        <span
                                                            className={
                                                                s.answerText
                                                            }>
                                                            {
                                                                question
                                                                    .options[
                                                                    question
                                                                        .correctAnswer
                                                                ]
                                                            }
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Container>
            </main>
        );
    }

    if (!currentQuestion) {
        return (
            <main className={s.takeTestPage}>
                <Container className={s.container}>
                    <div className={s.loading}>Жүктелуде...</div>
                </Container>
            </main>
        );
    }

    const currentAnswer = answers[currentQuestionIndex];

    return (
        <main className={s.takeTestPage}>
            <Container className={s.container}>
                <div className={s.testContainer}>
                    <div className={s.testHeader}>
                        <div className={s.headerLeft}>
                            <h1 className={s.testTitle}>Математика тесті</h1>
                            <div className={s.questionBadge}>
                                <span className={s.current}>
                                    {currentQuestionIndex + 1}
                                </span>
                                <span className={s.separator}>/</span>
                                <span className={s.total}>
                                    {totalQuestions}
                                </span>
                            </div>
                        </div>

                        <div
                            className={`${s.timerContainer} ${
                                s[getTimeColor()]
                            }`}>
                            <Timer size={20} />
                            <span className={s.timer}>
                                {formatTime(remainingTime)}
                            </span>
                        </div>
                    </div>

                    <div className={s.progressSection}>
                        <Progress
                            value={progress}
                            size="md"
                            animated={true}
                        />
                        <div className={s.progressInfo}>
                            <span className={s.progressText}>
                                Жауап берілген: <strong>{answeredCount}</strong>{' '}
                                / {totalQuestions}
                            </span>
                            <span className={s.progressPercentage}>
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>

                    <div className={s.questionNavigation}>
                        {questions.map((_, index) => (
                            <button
                                key={index}
                                className={`${s.navDot}
                                    ${
                                        index === currentQuestionIndex
                                            ? s.active
                                            : ''
                                    }
                                    ${
                                        isQuestionAnswered(index)
                                            ? s.answered
                                            : ''
                                    }`}
                                onClick={() => goToQuestion(index)}
                                aria-label={`Go to question ${index + 1}`}>
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <div className={s.questionCard}>
                        <div className={s.questionHeader}>
                            <div className={s.questionNumber}>
                                Сұрақ №{currentQuestion.id}
                            </div>
                            {currentAnswer === null && (
                                <div className={s.unansweredHint}>
                                    <AlertCircle size={16} />
                                    Жауап таңдаңыз
                                </div>
                            )}
                        </div>
                        <h2 className={s.questionText}>
                            {currentQuestion.question}
                        </h2>

                        <div className={s.optionsGrid}>
                            {currentQuestion.options.map((option, index) => {
                                const isSelected = currentAnswer === index;

                                return (
                                    <button
                                        key={index}
                                        className={`${s.option} ${
                                            isSelected ? s.selected : ''
                                        }`}
                                        onClick={() =>
                                            handleSelectAnswer(index)
                                        }>
                                        <div className={s.optionContent}>
                                            <span
                                                className={`${s.optionLetter} ${
                                                    isSelected ? s.selected : ''
                                                }`}>
                                                {String.fromCharCode(
                                                    65 + index
                                                )}
                                            </span>
                                            <span className={s.optionText}>
                                                {option}
                                            </span>
                                        </div>
                                        {isSelected && (
                                            <div
                                                className={s.selectedIndicator}>
                                                <CheckCircle size={20} />
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={s.navigation}>
                        <Button
                            className={s.prevButton}
                            onClick={previousQuestion}
                            disabled={currentQuestionIndex === 0}>
                            <ChevronLeft size={20} />
                            Алдыңғы
                        </Button>

                        <div className={s.navInfo}>
                            Сұрақ {currentQuestionIndex + 1} / {totalQuestions}
                        </div>

                        <Button
                            className={s.nextButton}
                            onClick={handleNext}
                            disabled={
                                currentQuestionIndex === totalQuestions - 1
                            }>
                            Келесі
                            <ChevronRight size={20} />
                        </Button>
                    </div>

                    <div className={s.finishSection}>
                        <Button
                            className={`${s.finishButton} ${
                                !allQuestionsAnswered ? s.disabled : ''
                            }`}
                            onClick={handleFinishTest}
                            disabled={!allQuestionsAnswered}>
                            <Flag size={20} />
                            Тестті аяқтау
                        </Button>
                        {/* {!allQuestionsAnswered && (
                            <div className={s.finishHint}>
                                <AlertCircle size={16} />
                                Тестті аяқтау үшін барлық сұрақтарға жауап беріңіз
                                ({answeredCount}/{totalQuestions})
                            </div>
                        )} */}
                    </div>
                </div>
            </Container>
        </main>
    );
};

export default TakeTestPage;
