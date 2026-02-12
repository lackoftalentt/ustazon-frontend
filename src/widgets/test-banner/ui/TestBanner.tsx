import { ClipboardCheck, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

import s from './TestBanner.module.scss'

interface Props {
	subjectCode: string
}

export const TestBanner = ({ subjectCode }: Props) => {
	return (
		<Link to={`/tests?code=${subjectCode}`} className={s.card}>
			<div className={s.iconWrap}>
				<ClipboardCheck className={s.icon} />
			</div>
			<div className={s.text}>
				<h3 className={s.title}>Тест</h3>
				<p className={s.subtitle}>Бақылау жұмыстары</p>
			</div>
			<ArrowRight className={s.arrow} />
		</Link>
	)
}
