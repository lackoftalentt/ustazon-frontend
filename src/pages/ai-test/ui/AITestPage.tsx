import { AIToolLayout } from '@/features/ai-tools/ui/AIToolLayout/AIToolLayout';
import { TestGenerator } from '@/features/ai-tools/ui/TestGenerator/TestGenerator';

export const AITestPage = () => {
    return (
        <AIToolLayout>
            <TestGenerator />
        </AIToolLayout>
    );
};
