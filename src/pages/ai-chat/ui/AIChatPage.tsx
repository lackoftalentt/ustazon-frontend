import { Container } from '@/shared/ui/Container';
import { SectionTitle } from '@/shared/ui/SectionTitle';
import s from './AIChatPage.module.scss';
import { AIChat } from '@/features/ai-chat';

export const AIChatPage = () => {
    return (
        <main className={s.page}>
            <Container className={s.container}>
                <SectionTitle title="Чат с искуственным интелектом UstazOn" />
                <AIChat />
            </Container>
        </main>
    );
};

export default AIChatPage;
