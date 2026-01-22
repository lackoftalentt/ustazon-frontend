import { apiClient } from './apiClient'

export interface CreateAnswerRequest {
	text: string
	is_correct: boolean
	order: number
}

export interface CreateQuestionRequest {
	text: string
	photo?: string
	video?: string
	order: number
	answers: CreateAnswerRequest[]
}

export interface CreateTestRequest {
	title: string
	subject: string
	duration: number
	difficulty: 'easy' | 'medium' | 'hard'
	questions: CreateQuestionRequest[]
}

export interface AnswerResponse {
	id: number
	text: string
	is_correct: boolean
	order: number
	question_id: number
	created_at: string
	updated_at: string
}

export interface QuestionResponse {
	id: number
	text: string
	photo?: string
	video?: string
	order: number
	test_id: number
	answers: AnswerResponse[]
	created_at: string
	updated_at: string
}

export interface TestResponse {
	id: number
	title: string
	subject: string
	duration: number
	difficulty: string
	author_id: number
	questions: QuestionResponse[]
	created_at: string
	updated_at: string
}

export const testApi = {
	async createTest(data: CreateTestRequest): Promise<TestResponse> {
		const response = await apiClient.post<TestResponse>('/tests/', data)
		return response.data
	},

	async addQuestionToTest(
		testId: number,
		question: CreateQuestionRequest
	): Promise<QuestionResponse> {
		const response = await apiClient.post<QuestionResponse>(
			`/tests/${testId}/questions`,
			question
		)
		return response.data
	},

	async addAnswerToQuestion(
		questionId: number,
		answer: CreateAnswerRequest
	): Promise<AnswerResponse> {
		const response = await apiClient.post<AnswerResponse>(
			`/tests/questions/${questionId}/answers`,
			answer
		)
		return response.data
	}
}
