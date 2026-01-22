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

export interface UpdateTestRequest {
	title?: string
	subject?: string
	duration?: number
	difficulty?: 'easy' | 'medium' | 'hard'
}

export interface UpdateQuestionRequest {
	text?: string
	photo?: string
	video?: string
	order?: number
}

export interface UpdateAnswerRequest {
	text?: string
	is_correct?: boolean
	order?: number
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
	},

	async updateTest(
		testId: number,
		data: UpdateTestRequest
	): Promise<TestResponse> {
		const response = await apiClient.put<TestResponse>(
			`/tests/${testId}`,
			data
		)
		return response.data
	},

	async deleteTest(testId: number): Promise<void> {
		await apiClient.delete(`/tests/${testId}`)
	},

	async getTestById(testId: number): Promise<TestResponse> {
		const response = await apiClient.get<TestResponse>(`/tests/${testId}`)
		return response.data
	},

	async updateQuestion(
		questionId: number,
		data: UpdateQuestionRequest
	): Promise<QuestionResponse> {
		const response = await apiClient.put<QuestionResponse>(
			`/tests/questions/${questionId}`,
			data
		)
		return response.data
	},

	async updateAnswer(
		answerId: number,
		data: UpdateAnswerRequest
	): Promise<AnswerResponse> {
		const response = await apiClient.put<AnswerResponse>(
			`/tests/answers/${answerId}`,
			data
		)
		return response.data
	}
}
