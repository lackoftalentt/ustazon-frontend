import { ExternalLink, Info } from 'lucide-react'

import s from './TryEmbedUrl.module.scss'

interface Props {
	url: string
}

export const TryEmbedUrl = ({ url }: Props) => {
	const handleOpenExternal = () => {
		window.open(url, '_blank', 'noopener,noreferrer')
	}

	return (
		<div className={s.container}>
			<iframe
				src={url}
				className={s.iframe}
				allowFullScreen
				sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
			/>

			<div className={s.fallbackBar}>
				<div className={s.hintWrapper}>
					<div className={s.infoIcon}>
						<Info />
					</div>
					<span className={s.hint}>
						Егер материал көрінбесе, жаңа қойындыда ашыңыз
					</span>
				</div>
				<button className={s.button} onClick={handleOpenExternal}>
					<ExternalLink size={16} />
					Жаңа қойындыда ашу
				</button>
			</div>
		</div>
	)
}
