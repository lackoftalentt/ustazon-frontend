import {
	Zap,
	MessageCircle,
	FileText,
	Presentation,
	ClipboardCheck,
	Video,
	X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/entities/user'
import s from './SpeedDial.module.scss'


const AI_ACTIONS = [
	{ icon: <MessageCircle size={20} />, label: 'AI Чат', path: '/ai-chat' },
	{ icon: <FileText size={20} />, label: 'AI Сабақ', path: '/ai-lesson' },
	{ icon: <FileText size={20} />, label: 'AI ҚМЖ', path: '/ai-qmj' },
	{ icon: <Presentation size={20} />, label: 'AI Презентация', path: '/ai-preza' },
	{ icon: <ClipboardCheck size={20} />, label: 'AI Тест', path: '/ai-test' },
	{ icon: <Video size={20} />, label: 'AI Видео', path: '/ai-manim' },
]

export function SpeedDial() {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const { isAuthenticated } = useAuthStore()
	const isAuth = isAuthenticated()
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		function handler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [])

	const handleAction = (path: string) => {
		setOpen(false)
		if (!isAuth) {
			navigate('/login')
			return
		}
		navigate(path)
	}

	return (
		<>
			<div className={s.wrapper} ref={ref}>
				{open && (
					<div className={s.backdrop} onClick={() => setOpen(false)} />
				)}

				<div className={`${s.actions} ${open ? s.open : ''}`}>
					{AI_ACTIONS.map((action, i) => (
						<div key={i} className={s.actionItem}>
							<span className={s.label}>{action.label}</span>
							<button className={s.action} onClick={() => handleAction(action.path)}>
								{action.icon}
							</button>
						</div>
					))}
				</div>

				<button className={s.fab} onClick={() => setOpen(v => !v)}>
					{open ? <X size={24} /> : <Zap size={24} />}
				</button>
			</div>

		</>
	)
}
