import { AboutSection } from '@/widgets/AboutSection';
import { AdvantagesSection } from '@/widgets/AdvantagesSection';
import { HeroSection } from '@/widgets/HeroSection';
import { OrientationSection } from '@/widgets/OrientationSection';
import { ReviewSection } from '@/widgets/ReviewSection/ui/ReviewSection';

export const HomePage = () => {
    return (
        <main>
            <HeroSection /> <AboutSection /> <AdvantagesSection />
            <OrientationSection /> <ReviewSection />
        </main>
    );
};

export default HomePage;
