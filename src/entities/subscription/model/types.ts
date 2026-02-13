export interface InstitutionType {
	id: number
	name: string
	code: string | null
	created_at: string
	updated_at: string
}

export interface Subject {
	id: number
	name: string
	code: string
	image_url: string | null
	hero_image_url: string | null
	created_at: string
	updated_at: string
	institution_types: InstitutionType[]
}

export interface SubscriptionUser {
	id: number
	name: string
	iin: string
	phone: string
}

export interface Subscription {
	id: number
	user_id: number
	subject_id: number
	institution_type_id: number
	end_date: string
	is_active: boolean
	created_at: string
	updated_at: string
	user?: SubscriptionUser
	subject?: Subject
	institution_type?: InstitutionType
}

export interface SubscriptionCreate {
	user_id: number
	subject_id: number
	institution_type_id: number
	end_date: string
}

export interface SubscriptionUpdate {
	end_date?: string
	subject_id?: number
	institution_type_id?: number
}

export interface SubscriptionListParams {
	skip?: number
	limit?: number
	active_only?: boolean
}

export interface UserSubscriptionsParams {
	active_only?: boolean
	skip?: number
	limit?: number
}
