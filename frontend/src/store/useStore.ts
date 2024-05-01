import { create } from 'zustand'
import { devtools, combine, persist } from 'zustand/middleware'
import storeUI from './storeUI'
import storeGeneral from './storeGeneral'
import storeChat from './storeChat'

const useStore = create(
  devtools(
    persist(
      combine(
        {
          hackedBy: 'Blade'
        },
        (set: any, get: any) => ({
          ...storeUI(set),
          ...storeGeneral(set),
          ...storeChat(set, get)
        })
      ),
      {
        name: 'yeonic-store3',
        partialize: (state) => Object.fromEntries(Object.entries(state).filter(([key]) => !['ws'].includes(key)))
      }
    )
  )
)

const state = useStore.getState()
export type IStore = typeof state

export default useStore
