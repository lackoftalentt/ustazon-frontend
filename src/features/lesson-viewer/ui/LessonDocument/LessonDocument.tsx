import type { LessonDocument as LessonDocumentType, LessonBlock } from '@/shared/api/lessonApi';
import { LessonPageLayout } from '../LessonPageLayout/LessonPageLayout';
import {
    LessonHeading,
    LessonTheory,
    LessonImage,
    LessonVocabulary,
    LessonTestPreview,
    LessonOpenQuestion,
} from '../blocks';

interface Props {
    document: LessonDocumentType;
}

export const LessonDocument = ({ document: doc }: Props) => {
    let openQuestionIndex = 0;

    const renderBlock = (block: LessonBlock, index: number) => {
        switch (block.type) {
            case 'heading':
                return <LessonHeading key={index} block={block} />;
            case 'theory':
                return <LessonTheory key={index} block={block} />;
            case 'image':
                return <LessonImage key={index} block={block} />;
            case 'vocabulary':
                return <LessonVocabulary key={index} block={block} />;
            case 'test':
                return <LessonTestPreview key={index} block={block} />;
            case 'open_question':
                openQuestionIndex += 1;
                return <LessonOpenQuestion key={index} block={block} index={openQuestionIndex} />;
            default:
                return null;
        }
    };

    return (
        <LessonPageLayout layout={doc.layout} meta={doc.meta}>
            {doc.blocks.map((block, i) => renderBlock(block, i))}
        </LessonPageLayout>
    );
};
