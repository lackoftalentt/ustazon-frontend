import type { TestToTake } from '@/entities/test'
import { getDifficultyLabel } from '@/shared/lib/getDifficultyLabel'
import { Button } from '@/shared/ui/button'
import { Container } from '@/shared/ui/container'
import {
	AlertCircle,
	ArrowLeft,
	BookOpen,
	Clock,
	Flag,
	PlayCircle,
	Target
} from 'lucide-react'
import s from './TestStartScreen.module.scss'

interface TestStartScreenProps {
	testData: TestToTake
	onStart: () => void
	onBack: () => void
}

export const TestStartScreen = ({
	testData,
	onStart,
	onBack
}: TestStartScreenProps) => {
	return (
		<main className={s.takeTestPage}>
			<Container className={s.container}>
				<div className={s.startContainer}>
					<div className={s.startCard}>
						<div className={s.header}>
							<div className={s.startIcon}>
								<BookOpen size={48} />
							</div>
							<h1 className={s.startTitle}>{testData.title}</h1>
						</div>

						<div className={s.startInfoGrid}>
							<div className={s.startInfoItem}>
								<Clock size={20} />
								<span>{testData.duration} минут</span>
							</div>

							<div className={s.startInfoItem}>
								<Target size={20} />
								<span>{testData.questions_count} сұрақ</span>
							</div>

							<div className={s.startInfoItem}>
								<BookOpen size={20} />
								<span>{testData.subject}</span>
							</div>

							<div className={`${s.startInfoItem} ${s[testData.difficulty]}`}>
								<Flag size={20} />
								<span>{getDifficultyLabel(testData.difficulty)}</span>
							</div>
						</div>

						<div className={s.startWarning}>
							<AlertCircle size={18} />
							<p>
								Тест басталғаннан кейін таймер іске қосылады. Барлық сұрақтарға
								жауап беруге тырысыңыз.
							</p>
						</div>

						<Button
							className={s.startButton}
							onClick={onStart}
						>
							<PlayCircle size={22} />
							Тестті бастау
						</Button>

						<Button
							className={s.backButton}
							onClick={onBack}
						>
							<ArrowLeft size={18} />
							Артқа қайту
						</Button>
					</div>
				</div>
			</Container>
		</main>
	)
}
