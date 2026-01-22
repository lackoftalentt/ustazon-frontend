import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
	favoriteIds: Set<number>
	toggleFavorite: (id: number) => boolean
	isFavorite: (id: number) => boolean
}

export const useFavoritesStore = create<FavoritesState>()(
	persist(
		(set, get) => ({
			favoriteIds: new Set<number>(),
			toggleFavorite: (id: number) => {
				const current = get().favoriteIds
				const newSet = new Set(current)
				const wasFavorite = newSet.has(id)

				if (wasFavorite) {
					newSet.delete(id)
				} else {
					newSet.add(id)
				}

				set({ favoriteIds: newSet })
				return !wasFavorite
			},
			isFavorite: (id: number) => get().favoriteIds.has(id)
		}),
		{
			name: 'favorites-storage',
			storage: {
				getItem: name => {
					const str = localStorage.getItem(name)
					if (!str) return null
					const parsed = JSON.parse(str)
					return {
						...parsed,
						state: {
							...parsed.state,
							favoriteIds: new Set(parsed.state.favoriteIds || [])
						}
					}
				},
				setItem: (name, value) => {
					const toStore = {
						...value,
						state: {
							...value.state,
							favoriteIds: Array.from(value.state.favoriteIds)
						}
					}
					localStorage.setItem(name, JSON.stringify(toStore))
				},
				removeItem: name => localStorage.removeItem(name)
			}
		}
	)
)
