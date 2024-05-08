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
    ),
  snackbar: {
    isOpen: false,
    messageType: 'error' as 'error' | 'default' | 'success' | 'warning' | 'info',
    message: 'NO MESSAGE'
  },
  showSnackbar: (messageType: 'error' | 'default' | 'success' | 'warning' | 'info', message: string): void =>
    set(
      produce((state: IStore) => {
        state.snackbar = { isOpen: true, message, messageType }
      }),
      false,
      'ui/showSnackbar'
    ),
  clearSnackbar: (): void =>
    set(
      produce((state: IStore) => {
        state.snackbar.isOpen = false
      }),
      false,
      'ui/clearSnackbar'
    )
})

export default storeUI
