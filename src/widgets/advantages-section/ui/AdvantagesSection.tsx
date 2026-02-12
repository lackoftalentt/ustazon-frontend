import { ADVANTAGES_DATA } from '@/shared/config/advantages'
import { AdvantageItem } from '@/shared/ui/advantage-item'
import { Container } from '@/shared/ui/container'
import { SectionTitle } from '@/shared/ui/section-title'
import { useTranslation } from 'react-i18next'
import s from './AdvantagesSection.module.scss'

export const AdvantagesSection = () => {
	const { t } = useTranslation()

	return (
		<section className={s.advantagesSection}>
			<Container>
				<SectionTitle
					className={s.title}
					title={t('advantages.sectionTitle')}
				/>
				<div className={s.advantagesBlock}>
					{ADVANTAGES_DATA.map((adv, index) => (
						<AdvantageItem
							title={t(adv.titleKey)}
							key={adv.id}
							icon={adv.icon}
							subtitle={t(adv.subtitleKey)}
							index={index}
						/>
					))}
				</div>
			</Container>
		</section>
	)
}
