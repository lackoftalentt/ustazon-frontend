import { ADVANTAGES_DATA } from '@/shared/config/advantages'
import { AdvantageItem } from '@/shared/ui/advantage-item'
import { Container } from '@/shared/ui/container'
import { SectionTitle } from '@/shared/ui/section-title'
import s from './AdvantagesSection.module.scss'

export const AdvantagesSection = () => {
	return (
		<section className={s.advantagesSection}>
			<Container>
				<SectionTitle
					className={s.title}
					title="UstazOn платформасының артықшылықтары"
				/>
				<div className={s.advantagesBlock}>
					{ADVANTAGES_DATA.map((adv, index) => (
						<AdvantageItem
							title={adv.title}
							key={adv.id}
							icon={adv.icon}
							subtitle={adv.subtitle}
							index={index}
						/>
					))}
				</div>
			</Container>
		</section>
	)
}
