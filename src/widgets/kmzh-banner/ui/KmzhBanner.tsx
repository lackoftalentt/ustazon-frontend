import { FileText, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

import s from './KmzhBanner.module.scss'

interface Props {
	subjectCode: string
}

export const KmzhBanner = ({ subjectCode }: Props) => {
	return (
		<Link to={`/lesson-plans/${subjectCode}`} className={s.card}>
			<div className={s.iconWrap}>
				<FileText className={s.icon} />
			</div>
			<div className={s.text}>
				<h3 className={s.title}>КМЖ</h3>
				<p className={s.subtitle}>Жоспарлар құрастыру</p>
			</div>
			<ArrowRight className={s.arrow} />
		</Link>
	)
}
