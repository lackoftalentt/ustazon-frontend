import { clsx } from 'clsx'
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import s from './Button.module.scss'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'primary' | 'dark' | 'outline'
	size?: 'sm' | 'md' | 'lg'
	fullWidth?: boolean
	loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			children,
			variant = 'primary',
			size = 'md',
			fullWidth = false,
			loading = false,
			disabled,
			className,
			...props
		},
		ref
	) => {
		return (
			<button
				{...props}
				ref={ref}
				disabled={disabled || loading}
				className={clsx(
					s.button,
					s[variant],
					s[size],
					fullWidth && s.fullWidth,
					(disabled || loading) && s.disabled,
					className
				)}
			>
				{loading ? 'Жүктеу...' : children}
			</button>
		)
	}
)

Button.displayName = 'Button'
