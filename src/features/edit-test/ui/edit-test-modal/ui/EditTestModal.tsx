import { useState, useCallback, useRef } from 'react';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Modal } from '@/shared/ui/modal';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { ConfirmModal } from '@/shared/ui/confirm-modal';
import { Loader } from '@/shared/ui/loader';
import { testApi } from '@/shared/api/testApi';
import { uploadApi } from '@/shared/api/uploadApi';
import { useEditTestForm } from '../../../model/useEditTestForm';
import { useEditTestStore } from '../../../model/useEditTestStore';
import {
    DIFFICULTY_OPTIONS,
    type EditTestFormData,
    type DifficultyLevel
} from '../../../model/types';
import {
    FileText,
    Clock,
    BarChart2,
    BookOpen,
    ListChecks,
    Plus,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ImagePlus,
    X
} from 'lucide-react';
import s from './EditTestModal.module.scss';

export const EditTestModal = () => {
    const { isOpen, testData, fullTestData, isLoadingFullData, closeModal } = useEditTestStore();
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [dragOverQuestion, setDragOverQuestion] = useState<number | null>(null);
    const imageInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
    const queryClient = useQueryClient();

    const handleClose = useCallback(() => {
        resetForm();
        setCurrentQuestionIndex(0);
        closeModal();
    }, [closeModal]);

    const {
        register,
        watch,
        formState: { errors, isSubmitting },
        questions,
        handleDurationChange,
        handleDifficultyChange,
        addQuestion,
        removeQuestion,
        updateQuestionText,
        updateQuestionImage,
        removeQuestionImage,
        updateAnswerText,
        setCorrectAnswer,
        resetForm,
        onSubmit
    } = useEditTestForm(fullTestData, async (data: EditTestFormData) => {
        if (!testData || !fullTestData) return;

        try {
            // Update test basic info
            await testApi.updateTest(testData.id, {
                title: data.title,
                subject: data.subject,
                duration: data.duration,
                difficulty: data.difficulty
            });

            // Update questions and answers
            for (const question of data.questions) {
                let photoUrl = question.photo;

                // Upload new image if provided
                if (question.newImage) {
                    const uploadResult = await uploadApi.uploadImage(question.newImage);
                    photoUrl = uploadResult.file_path;
                }

                if (question.id > 0) {
                    // Update existing question
                    await testApi.updateQuestion(question.id, {
                        text: question.text,
                        photo: photoUrl,
                        order: question.order
                    });

                    // Update answers
                    for (const answer of question.answers) {
                        if (answer.id > 0) {
                            await testApi.updateAnswer(answer.id, {
                                text: answer.text,
                                is_correct: answer.isCorrect,
                                order: answer.order
                            });
                        } else {
                            // Add new answer to existing question
                            await testApi.addAnswerToQuestion(question.id, {
                                text: answer.text,
                                is_correct: answer.isCorrect,
                                order: answer.order
                            });
                        }
                    }
                } else {
                    // Add new question
                    await testApi.addQuestionToTest(testData.id, {
                        text: question.text,
                        photo: photoUrl,
                        order: question.order,
                        answers: question.answers
                            .filter(a => a.text.trim() !== '')
                            .map((a, i) => ({
                                text: a.text,
                                is_correct: a.isCorrect,
                                order: i
                            }))
                    });
                }
            }

            queryClient.invalidateQueries({ queryKey: ['tests'] });
            toast.success('Тест сәтті сақталды!');
            handleClose();
        } catch {
            toast.error('Тесті сақтау кезінде қате орын алды');
        }
    });

    const handleDeleteClick = () => {
        setIsDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!testData) return;

        setIsDeleting(true);
        try {
            await testApi.deleteTest(testData.id);
            queryClient.invalidateQueries({ queryKey: ['tests'] });
            toast.success('Тест сәтті жойылды!');
            setIsDeleteConfirmOpen(false);
            handleClose();
        } catch {
            toast.error('Тесті жою кезінде қате орын алды');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setIsDeleteConfirmOpen(false);
    };

    const handleAddQuestion = () => {
        addQuestion();
        setCurrentQuestionIndex(questions.length);
    };

    const handleRemoveQuestion = (index: number) => {
        removeQuestion(index);
        if (currentQuestionIndex >= questions.length - 1) {
            setCurrentQuestionIndex(Math.max(0, questions.length - 2));
        }
    };

    const handleQuestionFile = (questionIndex: number, file?: File) => {
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error('Тек сурет файлдарын жүктеуге болады');
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Сурет өлшемі 5MB-дан аспауы керек');
            return;
        }

        updateQuestionImage(questionIndex, file);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverQuestion(index);
    };

    const handleDragLeave = () => {
        setDragOverQuestion(null);
    };

    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        setDragOverQuestion(null);
        const file = e.dataTransfer.files?.[0];
        handleQuestionFile(index, file);
    };

    const hasQuestionError = (index: number) => {
        return !!errors.questions?.[index];
    };

    if (!testData) return null;

    const currentQuestion = questions[currentQuestionIndex];
    const difficulty = watch('difficulty');

    return (
        <Modal open={isOpen} onClose={handleClose} title="Тестті өңдеу">
            <div className={s.header}>
                <div className={s.headerIcon}>
                    <FileText size={28} />
                </div>
                <div className={s.headerContent}>
                    <h2 className={s.headerTitle}>{testData.title}</h2>
                    <p className={s.headerSubtitle}>
                        {testData.questionsCount} сұрақ • {testData.duration} минут
                    </p>
                </div>
            </div>

            {isLoadingFullData ? (
                <div className={s.loadingContainer}>
                    <Loader />
                    <p>Тест деректері жүктелуде...</p>
                </div>
            ) : (
                <form onSubmit={onSubmit} className={s.form}>
                    <div className={s.field}>
                        <label className={s.label}>
                            <FileText size={18} />
                            Тест атауы *
                        </label>
                        <Input
                            {...register('title')}
                            placeholder="Тест атауын енгізіңіз"
                            error={errors.title?.message}
                        />
                    </div>

                    <div className={s.field}>
                        <label className={s.label}>
                            <BookOpen size={18} />
                            Пән *
                        </label>
                        <Input
                            {...register('subject')}
                            placeholder="Пән атауын енгізіңіз"
                            error={errors.subject?.message}
                        />
                    </div>

                    <div className={s.row}>
                        <div className={s.field}>
                            <label className={s.label}>
                                <Clock size={18} />
                                Ұзақтығы (минут) *
                            </label>
                            <div className={s.durationInput}>
                                <button
                                    type="button"
                                    className={s.durationBtn}
                                    onClick={() => handleDurationChange((watch('duration') || 1) - 5)}>
                                    −
                                </button>
                                <input
                                    type="number"
                                    className={s.durationValue}
                                    value={watch('duration') || 30}
                                    onChange={(e) => handleDurationChange(parseInt(e.target.value) || 1)}
                                    min={1}
                                    max={180}
                                />
                                <button
                                    type="button"
                                    className={s.durationBtn}
                                    onClick={() => handleDurationChange((watch('duration') || 1) + 5)}>
                                    +
                                </button>
                            </div>
                            <span className={s.hint}>1-180 минут аралығында</span>
                            {errors.duration && (
                                <span className={s.error}>{errors.duration.message}</span>
                            )}
                        </div>

                        <div className={s.field}>
                            <label className={s.label}>
                                <BarChart2 size={18} />
                                Қиындық деңгейі *
                            </label>
                            <div className={s.difficultyOptions}>
                                {DIFFICULTY_OPTIONS.map((option) => (
                                    <div
                                        key={option.value}
                                        className={clsx(
                                            s.difficultyOption,
                                            difficulty === option.value && s.selected
                                        )}
                                        onClick={() => handleDifficultyChange(option.value as DifficultyLevel)}>
                                        <span>{option.label}</span>
                                    </div>
                                ))}
                            </div>
                            {errors.difficulty && (
                                <span className={s.error}>{errors.difficulty.message}</span>
                            )}
                        </div>
                    </div>

                    {/* Questions Section */}
                    <div className={s.questionsSection}>
                        <div className={s.sectionHeader}>
                            <span className={s.sectionTitle}>
                                <ListChecks size={20} />
                                Сұрақтар ({questions.length})
                            </span>
                            <button
                                type="button"
                                className={s.addQuestionBtn}
                                onClick={handleAddQuestion}
                            >
                                <Plus size={18} />
                                Сұрақ қосу
                            </button>
                        </div>

                        {/* Question Pagination */}
                        {questions.length > 0 && (
                            <div className={s.questionPagination}>
                                <button
                                    type="button"
                                    className={s.paginationArrow}
                                    onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                    disabled={currentQuestionIndex === 0}
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className={s.paginationNav}>
                                    {questions.map((_, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            className={clsx(
                                                s.questionPageBtn,
                                                index === currentQuestionIndex && s.active,
                                                hasQuestionError(index) && s.hasError
                                            )}
                                            onClick={() => setCurrentQuestionIndex(index)}
                                        >
                                            {index + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    className={s.paginationArrow}
                                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                                    disabled={currentQuestionIndex === questions.length - 1}
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}

                        {/* Current Question Card */}
                        {currentQuestion && (
                            <div key={currentQuestion.localId} className={s.questionCard}>
                                <div className={s.questionHeader}>
                                    <div className={s.questionNumber}>
                                        <span className={s.badge}>{currentQuestionIndex + 1}</span>
                                        Сұрақ {currentQuestionIndex + 1}
                                    </div>
                                    <button
                                        type="button"
                                        className={s.removeQuestionBtn}
                                        onClick={() => handleRemoveQuestion(currentQuestionIndex)}
                                        disabled={questions.length <= 1}
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <div className={s.field}>
                                    <label className={s.label}>Сұрақ мәтіні *</label>
                                    <textarea
                                        className={clsx(
                                            s.textarea,
                                            errors.questions?.[currentQuestionIndex]?.text && s.textareaError
                                        )}
                                        placeholder="Сұрақ мәтінін енгізіңіз..."
                                        value={currentQuestion.text}
                                        onChange={(e) => updateQuestionText(currentQuestionIndex, e.target.value)}
                                    />
                                    {errors.questions?.[currentQuestionIndex]?.text && (
                                        <span className={s.error}>
                                            {errors.questions[currentQuestionIndex]?.text?.message}
                                        </span>
                                    )}
                                </div>

                                <div className={s.field}>
                                    <label className={s.label}>Сұрақ суреті (міндетті емес)</label>

                                    <input
                                        ref={el => {
                                            imageInputRefs.current[currentQuestion.localId] = el;
                                        }}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleQuestionFile(currentQuestionIndex, e.target.files?.[0])}
                                    />

                                    {currentQuestion.newImage ? (
                                        <div className={s.fileSelected}>
                                            <div className={s.fileSelectedIcon}>
                                                <ImagePlus size={20} />
                                            </div>
                                            <span className={s.fileName}>
                                                {currentQuestion.newImage.name}
                                            </span>
                                            <button
                                                type="button"
                                                className={s.fileRemove}
                                                onClick={() => removeQuestionImage(currentQuestionIndex)}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : currentQuestion.photo ? (
                                        <div className={s.fileSelected}>
                                            <div className={s.fileSelectedIcon}>
                                                <ImagePlus size={20} />
                                            </div>
                                            <span className={s.fileName}>
                                                Бар сурет
                                            </span>
                                            <button
                                                type="button"
                                                className={s.fileRemove}
                                                onClick={() => removeQuestionImage(currentQuestionIndex)}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className={clsx(
                                                s.fileDropzone,
                                                dragOverQuestion === currentQuestionIndex && s.dragOver
                                            )}
                                            onDragOver={(e) => handleDragOver(e, currentQuestionIndex)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, currentQuestionIndex)}
                                            onClick={() => imageInputRefs.current[currentQuestion.localId]?.click()}
                                        >
                                            <ImagePlus className={s.fileIcon} />
                                            <div className={s.fileText}>
                                                <span className={s.fileTitle}>
                                                    Суретті осында сүйреңіз немесе таңдаңыз
                                                </span>
                                                <span className={s.fileHint}>Жүктеу үшін басыңыз</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={s.answersSection}>
                                    <div className={s.answersHeader}>
                                        Жауап нұсқалары
                                        <span className={s.answersHint}>
                                            Дұрыс жауапты белгілеңіз
                                        </span>
                                    </div>
                                    <div className={s.answersList}>
                                        {currentQuestion.answers.map((answer, aIndex) => (
                                            <div
                                                key={answer.localId}
                                                className={clsx(
                                                    s.answerItem,
                                                    answer.isCorrect && s.correct
                                                )}
                                            >
                                                <div
                                                    className={clsx(
                                                        s.answerRadio,
                                                        answer.isCorrect && s.selected
                                                    )}
                                                    onClick={() => setCorrectAnswer(currentQuestionIndex, aIndex)}
                                                />
                                                <span className={s.answerLabel}>Жауап {aIndex + 1}</span>
                                                <input
                                                    className={s.answerInput}
                                                    placeholder="Жауап мәтінін енгізіңіз..."
                                                    value={answer.text}
                                                    onChange={(e) =>
                                                        updateAnswerText(currentQuestionIndex, aIndex, e.target.value)
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {errors.questions?.[currentQuestionIndex]?.answers && (
                                        <span className={s.error}>
                                            {typeof errors.questions[currentQuestionIndex]?.answers?.message === 'string'
                                                ? errors.questions[currentQuestionIndex]?.answers?.message
                                                : 'Жауап нұсқаларын тексеріңіз'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={s.actions}>
                        <div className={s.actionsLeft}>
                            <Button
                                type="button"
                                variant="outline"
                                className={s.deleteBtn}
                                onClick={handleDeleteClick}>
                                Жою
                            </Button>
                        </div>
                        <div className={s.actionsRight}>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleClose}>
                                Бас тарту
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={isSubmitting}>
                                Сақтау
                            </Button>
                        </div>
                    </div>
                </form>
            )}

            <ConfirmModal
                open={isDeleteConfirmOpen}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Тестті жою"
                message="Бұл тестті жойғыңыз келетініне сенімдісіз бе? Бұл әрекетті қайтару мүмкін емес."
                confirmText="Жою"
                cancelText="Бас тарту"
                variant="danger"
                loading={isDeleting}
            />
        </Modal>
    );
};
