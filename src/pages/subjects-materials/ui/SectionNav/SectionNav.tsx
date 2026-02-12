import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import s from './SectionNav.module.scss'

export interface SectionNavItem {
	id: string
	label: string
	icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

interface SectionNavProps {
	items: SectionNavItem[]
}

export const SectionNav = ({ items }: SectionNavProps) => {
	const [activeId, setActiveId] = useState<string>(items[0]?.id ?? '')
	const observerRef = useRef<IntersectionObserver | null>(null)

	useEffect(() => {
		observerRef.current = new IntersectionObserver(
			entries => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id)
					}
				}
			},
			{ rootMargin: '-120px 0px -60% 0px', threshold: 0 }
		)

		items.forEach(item => {
			const el = document.getElementById(item.id)
			if (el) observerRef.current?.observe(el)
		})

		return () => observerRef.current?.disconnect()
	}, [items])

	const handleClick = (id: string) => {
		const el = document.getElementById(id)
		if (el) {
			el.scrollIntoView({ behavior: 'smooth' })
			setActiveId(id)
		}
	}

	if (items.length === 0) return null

	return (
		<aside className={s.sidebar}>
			{items.map(item => (
				<button
					key={item.id}
					type="button"
					className={clsx(s.item, activeId === item.id && s.itemActive)}
					onClick={() => handleClick(item.id)}
				>
					{item.icon ? (
						<item.icon className={s.icon} />
					) : (
						<span className={s.icon}>{item.label[0]}</span>
					)}
					<span className={s.tooltip}>{item.label}</span>
				</button>
			))}
		</aside>
	)
}
