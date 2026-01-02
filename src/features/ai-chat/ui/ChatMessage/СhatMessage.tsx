import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import s from './ChatMessage.module.scss';
import { aiApi } from '@/shared/api/ai';

interface ChatMessageProps {
    text: string;
    sender: 'ai' | 'user';
    timestamp: Date;
    images?: string[];
}

export const ChatMessage = ({ text, sender, images }: ChatMessageProps) => {
    const [isGenerating, setIsGenerating] = useState(false);

    // Parse material links
    const parseMaterialLink = (text: string): {
        cleanText: string;
        type: 'presentation' | 'lesson_plan' | 'test' | 'homework' | 'rubric' | null;
        params: any | null;
    } => {
        // Check for presentation link
        const presentationPattern = /\[PRESENTATION_LINK:([^\]]+)\]/;
        const presentationMatch = text.match(presentationPattern);
        if (presentationMatch) {
            const [subject, grade, topic, slidesCount] = presentationMatch[1].split('|');
            return {
                cleanText: text.replace(presentationMatch[0], '').trim(),
                type: 'presentation',
                params: { subject, grade, topic, slidesCount: parseInt(slidesCount || '12') }
            };
        }

        // Check for lesson plan link
        const lessonPlanPattern = /\[LESSON_PLAN_LINK:([^\]]+)\]/;
        const lessonPlanMatch = text.match(lessonPlanPattern);
        if (lessonPlanMatch) {
            const [subject, grade, topic, duration] = lessonPlanMatch[1].split('|');
            return {
                cleanText: text.replace(lessonPlanMatch[0], '').trim(),
                type: 'lesson_plan',
                params: { subject, grade, topic, duration: parseInt(duration || '45') }
            };
        }

        // Check for test link
        const testPattern = /\[TEST_LINK:([^\]]+)\]/;
        const testMatch = text.match(testPattern);
        if (testMatch) {
            const [subject, grade, topic, questionCount, difficulty] = testMatch[1].split('|');
            return {
                cleanText: text.replace(testMatch[0], '').trim(),
                type: 'test',
                params: {
                    subject,
                    grade,
                    topic,
                    questionCount: parseInt(questionCount || '15'),
                    difficulty: difficulty || 'medium'
                }
            };
        }

        // Check for homework link
        const homeworkPattern = /\[HOMEWORK_LINK:([^\]]+)\]/;
        const homeworkMatch = text.match(homeworkPattern);
        if (homeworkMatch) {
            const [subject, grade, topic, duration, difficulty] = homeworkMatch[1].split('|');
            return {
                cleanText: text.replace(homeworkMatch[0], '').trim(),
                type: 'homework',
                params: {
                    subject,
                    grade,
                    topic,
                    duration: parseInt(duration || '30'),
                    difficulty: difficulty || 'medium'
                }
            };
        }

        // Check for rubric link
        const rubricPattern = /\[RUBRIC_LINK:([^\]]+)\]/;
        const rubricMatch = text.match(rubricPattern);
        if (rubricMatch) {
            const [subject, grade, workType, description] = rubricMatch[1].split('|');
            return {
                cleanText: text.replace(rubricMatch[0], '').trim(),
                type: 'rubric',
                params: { subject, grade, workType, description }
            };
        }

        return { cleanText: text, type: null, params: null };
    };

    const handleGenerateMaterial = async (type: string, params: any) => {
        try {
            setIsGenerating(true);
            let blob: Blob;
            let filename: string;

            switch (type) {
                case 'presentation':
                    blob = await aiApi.generatePresentation(
                        params.subject,
                        params.grade,
                        params.topic,
                        params.slidesCount
                    );
                    filename = `${params.topic.replace(/\s+/g, '_')}_${params.grade.replace(/\s+/g, '_')}.pptx`;
                    break;

                case 'lesson_plan':
                    blob = await aiApi.generateLessonPlan(
                        params.subject,
                        params.grade,
                        params.topic,
                        params.duration
                    );
                    filename = `План_урока_${params.topic.replace(/\s+/g, '_')}.docx`;
                    break;

                case 'test':
                    blob = await aiApi.generateTest(
                        params.subject,
                        params.grade,
                        params.topic,
                        params.questionCount,
                        params.difficulty
                    );
                    filename = `Тест_${params.topic.replace(/\s+/g, '_')}.docx`;
                    break;

                case 'homework':
                    blob = await aiApi.generateHomework(
                        params.subject,
                        params.grade,
                        params.topic,
                        params.duration,
                        params.difficulty
                    );
                    filename = `ДЗ_${params.topic.replace(/\s+/g, '_')}.docx`;
                    break;

                case 'rubric':
                    blob = await aiApi.generateRubric(
                        params.subject,
                        params.grade,
                        params.workType,
                        params.description
                    );
                    filename = `Рубрика_${params.workType.replace(/\s+/g, '_')}.docx`;
                    break;

                default:
                    throw new Error('Unknown material type');
            }

            // Download file
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error generating material:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (sender === 'ai') {
        const { cleanText, type, params } = parseMaterialLink(text);

        // Determine button text and icon based on material type
        let buttonText = '';
        let buttonIcon = '';
        if (type === 'presentation') {
            buttonIcon = '📊';
            buttonText = 'Скачать презентацию';
        } else if (type === 'lesson_plan') {
            buttonIcon = '📝';
            buttonText = 'Скачать план урока';
        } else if (type === 'test') {
            buttonIcon = '📋';
            buttonText = 'Скачать тест';
        } else if (type === 'homework') {
            buttonIcon = '✏️';
            buttonText = 'Скачать домашнее задание';
        } else if (type === 'rubric') {
            buttonIcon = '⭐';
            buttonText = 'Скачать рубрику';
        }

        return (
            <div className={s.row}>
                <div className={s.aiMessage}>
                    <div className={`${s.aiText} ${s.markdown}`}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {cleanText}
                        </ReactMarkdown>
                    </div>
                    {type && params && (
                        <button
                            className={s.presentationButton}
                            onClick={() => handleGenerateMaterial(type, params)}
                            disabled={isGenerating}
                        >
                            {isGenerating ? `${buttonIcon} Генерация...` : `${buttonIcon} ${buttonText}`}
                        </button>
                    )}
                    {images && images.length > 0 && (
                        <div className={s.imageGallery}>
                            {images.map((img, idx) => (
                                <img
                                    key={`ai-img-${img}-${idx}`}
                                    src={img}
                                    alt={`AI response ${idx + 1}`}
                                    className={s.messageImage}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`${s.row} ${s.rowRight}`}>
            <div className={s.userMessage}>
                {images && images.length > 0 && (
                    <div className={s.imageGallery}>
                        {images.map((img, idx) => (
                            <img
                                key={`user-img-${img}-${idx}`}
                                src={img}
                                alt={`Attachment ${idx + 1}`}
                                className={s.messageImage}
                            />
                        ))}
                    </div>
                )}
                {text && <div className={s.userMessageContent}>{text}</div>}
            </div>
        </div>
    );
};
