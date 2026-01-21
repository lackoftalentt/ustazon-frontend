interface IFrameEmbedProps {
	src: string
}

export const IFrameEmbed = ({ src }: IFrameEmbedProps) => {
	return (
		<iframe
			src={src}
			style={{ width: '100%', height: 600, border: 0 }}
			allowFullScreen
		/>
	)
}
