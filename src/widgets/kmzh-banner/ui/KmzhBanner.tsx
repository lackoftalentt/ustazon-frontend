import { FileText, ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import s from './KmzhBanner.module.scss'

interface Props {
	subjectCode: string
}

export const KmzhBanner = ({ subjectCode }: Props) => {
	const { t } = useTranslation()

	return (
		<Link to={`/lesson-plans/${subjectCode}`} className={s.card}>
			<div className={s.iconWrap}>
				<FileText className={s.icon} />
			</div>
			<div className={s.text}>
				<h3 className={s.title}>{t('kmzhBanner.title')}</h3>
				<p className={s.subtitle}>{t('kmzhBanner.subtitle')}</p>
			</div>
			<ArrowRight className={s.arrow} />
		</Link>
	)
}
