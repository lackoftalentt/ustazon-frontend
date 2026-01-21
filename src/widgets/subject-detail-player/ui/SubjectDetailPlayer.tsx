import { useState } from 'react'
import ReactPlayer from 'react-player'
import s from './SubjectDetailPlayer.module.scss'

interface SubjectDetailPlayerProps {
	url?: string | null
}

export const SubjectDetailPlayer = ({ url }: SubjectDetailPlayerProps) => {
	const [playing, setPlaying] = useState(false)

	return (
		<div className={s.player}>
			<div className={s.video}>
				<div className={s.playerWrapper}>
					<ReactPlayer
						src={url || undefined}
						playing={playing}
						volume={0.8}
						width="100%"
						height="100%"
						controls={true}
					/>
				</div>

				{!playing && (
					<button
						className={s.playBtn}
						onClick={() => setPlaying(!playing)}
					>
						<span className={s.playIcon} />
					</button>
				)}
			</div>
		</div>
	)
}
