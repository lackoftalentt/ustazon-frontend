import { AboutSection } from '@/widgets/about-section';
import { AdvantagesSection } from '@/widgets/advantages-section';
import { HeroSection } from '@/widgets/hero-section';
import { OrientationSection } from '@/widgets/orientation-section';
import { ReviewSection } from '@/widgets/review-section/ui/ReviewSection';

export const HomePage = () => {
    return (
        <main>
            <HeroSection /> <AboutSection /> <AdvantagesSection />
            <OrientationSection /> <ReviewSection />
        </main>
    );
};

export default HomePage;
