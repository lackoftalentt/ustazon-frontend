import { useEffect, useState } from 'react'
import { useTestStore } from './useTestStore'

export const useTestTimer = () => {
	const {
		timeLimit,
		startTime,
		isTestStarted,
		isTestCompleted,
		getElapsedTime,
		finishTest
	} = useTestStore()

	const [remainingTime, setRemainingTime] = useState(timeLimit)

	useEffect(() => {
		if (!isTestStarted || isTestCompleted || !startTime) {
			setRemainingTime(timeLimit)
			return
		}

		const updateTimer = () => {
			const elapsed = getElapsedTime()
			const remaining = Math.max(0, timeLimit - elapsed)
			setRemainingTime(remaining)

			if (remaining <= 0) {
				finishTest()
			}
		}

		updateTimer()
		const interval = setInterval(updateTimer, 1000)

		return () => clearInterval(interval)
	}, [isTestStarted, isTestCompleted, startTime, timeLimit, getElapsedTime, finishTest])

	return { remainingTime, setRemainingTime }
}
