import { Link, useNavigate } from 'react-router-dom'
import styles from './NotFoundPage.module.scss'

export const NotFoundPage = () => {
	const navigate = useNavigate()

	const handleGoBack = () => {
		navigate(-1)
	}

	return (
		<div className={styles.container}>
			{/* Плавающие школьные элементы */}
			<div className={styles.floatingShapes}>
				<div className={`${styles.shape} ${styles.book}`}>📚</div>
				<div className={`${styles.shape} ${styles.pencil}`}>✏️</div>
				<div className={`${styles.shape} ${styles.ruler}`}>📐</div>
				<div className={`${styles.shape} ${styles.apple}`}>🍎</div>
				<div className={`${styles.shape} ${styles.globe}`}>🌍</div>
				<div className={`${styles.shape} ${styles.calculator}`}>🔢</div>
				<div className={`${styles.shape} ${styles.notebook}`}>📓</div>
				<div className={`${styles.shape} ${styles.lightbulb}`}>💡</div>
			</div>

			{/* Декоративные элементы */}
			<div className={styles.chalkboard}>
				<div className={styles.chalkLine} />
				<div className={styles.chalkLine} />
				<div className={styles.chalkLine} />
			</div>

			<div className={styles.content}>
				<div className={styles.illustration}>
					{/* Учитель */}
					<div className={styles.teacher}>👩‍🏫</div>

					{/* 404 на доске */}
					<div className={styles.board}>
						<div className={styles.boardTop} />
						<div className={styles.boardContent}>
							<div className={styles.errorCode}>404</div>
							<div className={styles.chalk}>?</div>
						</div>
					</div>

					{/* Ученики */}
					<div className={styles.students}>
						<span className={styles.student}>🙋</span>
						<span className={styles.student}>🙋‍♂️</span>
						<span className={styles.student}>🤔</span>
					</div>
				</div>

				<h1 className={styles.title}>Ой! Бұл бет табылмады</h1>

				<p className={styles.description}>
					Бұл сабақ кестеде жоқ сияқты. Мүмкін сіз қате бөлмеге кірдіңіз?
					Қайта бас бетке оралайық!
				</p>

				<div className={styles.actions}>
					<Link
						to="/"
						className={styles.primaryButton}
					>
						🏫 Бас бетке
					</Link>
					<button
						onClick={handleGoBack}
						className={styles.secondaryButton}
					>
						← Артқа
					</button>
				</div>

				<div className={styles.hint}>
					<span className={styles.hintIcon}>📝</span>
					<span>Кеңес: URL мекенжайын тексеріңіз</span>
				</div>
			</div>
		</div>
	)
}

export default NotFoundPage
