import { AIToolLayout } from '@/features/ai-tools/ui/AIToolLayout/AIToolLayout';
import { PrezaGenerator } from '@/features/ai-tools/ui/PrezaGenerator/PrezaGenerator';

export const AIPrezaPage = () => {
    return (
        <AIToolLayout>
            <PrezaGenerator />
        </AIToolLayout>
    );
};
