import { useCreateKMZHStore } from '@/features/create-kmzh'
import { useCreateMaterialStore } from '@/features/create-material'
import { useCreateTestStore } from '@/features/create-test'
import { Book, Brain, CheckCircle, FileText, Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './SpeedDial.module.scss'

interface SpeedDialAction {
	icon: React.ReactNode
	label: string
	onClick: () => void
}

export function SpeedDial() {
	const [open, setOpen] = useState(false)
	const navigate = useNavigate()
	const ref = useRef<HTMLDivElement>(null)
	const { openModal: openMaterialModal } = useCreateMaterialStore()
	const { openModal: openKMZHModal } = useCreateKMZHStore()
	const { openModal: openTestModal } = useCreateTestStore()

	useEffect(() => {
		function handler(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false)
			}
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [])

	const handleAction = (action: () => void) => {
		action()
		setOpen(false)
	}

	const actions: SpeedDialAction[] = [
		{
			icon: <FileText size={20} />,
			label: 'ҚМЖ құру',
			onClick: () => openKMZHModal()
		},
		{
			icon: <Book size={20} />,
			label: 'Материал құру',
			onClick: () => openMaterialModal()
		},
		{
			icon: <CheckCircle size={20} />,
			label: 'Тест құру',
			onClick: () => openTestModal()
		},
		{
			icon: <Brain size={20} />,
			label: 'AI чат',
			onClick: () => navigate('/ai-chat')
		}
	]

	return (
		<div
			className={s.wrapper}
			ref={ref}
		>
			{open && (
				<div
					className={s.backdrop}
					onClick={() => setOpen(false)}
				/>
			)}

			<div className={`${s.actions} ${open ? s.open : ''}`}>
				{actions.map((action, i) => (
					<div
						key={i}
						className={s.actionItem}
						style={{ transitionDelay: `${i * 50}ms` }}
					>
						<span
							className={s.label}
							style={{ transitionDelay: `${i * 50 + 30}ms` }}
						>
							{action.label}
						</span>
						<button
							className={s.action}
							style={{ transitionDelay: `${i * 50}ms` }}
							onClick={() => handleAction(action.onClick)}
						>
							{action.icon}
						</button>
					</div>
				))}
			</div>

			<button
				className={s.fab}
				onClick={() => setOpen(v => !v)}
			>
				<Plus
					size={28}
					className={`${s.plus} ${open ? s.rot : ''}`}
				/>
			</button>
		</div>
	)
}
