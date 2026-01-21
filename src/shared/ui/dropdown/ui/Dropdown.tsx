import UpIcon from '@/shared/assets/icons/up.svg?react'
import clsx from 'clsx'
import { useEffect, useMemo, useRef, useState } from 'react'
import s from './Dropdown.module.scss'

export type DropdownProps = {
	items: string[]
	value?: string
	placeholder?: string
	onChange?: (value: string) => void
	className?: string
}

export const Dropdown = ({
	items,
	value,
	placeholder = 'Выбрать',
	onChange,
	className
}: DropdownProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const label = value || placeholder

	const normalizedItems = useMemo(() => items.filter(Boolean), [items])

	const toggleOpen = () => setIsOpen(prev => !prev)
	const close = () => setIsOpen(false)

	const handleSelect = (nextValue: string) => {
		onChange?.(nextValue)
		close()
	}

	useEffect(() => {
		if (!isOpen) return

		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				close()
			}
		}

		const timeoutId = setTimeout(() => {
			document.addEventListener('mousedown', handleClickOutside)
		}, 0)

		return () => {
			clearTimeout(timeoutId)
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isOpen])

	return (
		<div
			ref={dropdownRef}
			className={clsx(s.dropdown, className)}
		>
			<button
				className={clsx(s.button, isOpen && s.buttonOpen)}
				onClick={toggleOpen}
				type="button"
				aria-expanded={isOpen}
				aria-haspopup="listbox"
			>
				<span className={s.buttonText}>{label}</span>
				<UpIcon className={clsx(s.chevron, isOpen && s.chevronOpen)} />
			</button>

			{isOpen && (
				<div
					className={s.content}
					role="listbox"
				>
					{normalizedItems.map(item => (
						<button
							key={item}
							type="button"
							className={clsx(s.item, value === item && s.itemActive)}
							onClick={() => handleSelect(item)}
							role="option"
							aria-selected={value === item}
						>
							{item}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
