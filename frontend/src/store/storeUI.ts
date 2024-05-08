import { produce } from 'immer'
import type { IStore } from './useStore'

const storeUI = (set: any) => ({
  darkMode: true,
  setDarkMode: (to: boolean): void =>
    set(
      produce((state: IStore) => {
        state.darkMode = to
      }),
      false,
      'ui/setDarkMode'
    ),
  currentTab: 1,
  setCurrentTab: (to: number): void =>
    set(
      produce((state: IStore) => {
        state.currentTab = to
      }),
      false,
      'ui/setTab'
    ),
  dev: false,
  setDev: (to: boolean): void =>
    set(
      produce((state: IStore) => {
        state.dev = to
      }),
      false,
      'ui/setDev'
    )
})

export default storeUI
