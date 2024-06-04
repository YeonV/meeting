import { produce } from 'immer'
import type { IStore } from './useStore'
import { LanguageCode } from '@/lib/translations'

const storeUI = (set: any) => ({
  language: 'en' as LanguageCode,
  setLanguage: (to: LanguageCode): void =>
    set(
      produce((state: IStore) => {
        state.language = to
      }),
      false,
      'ui/setLanguage'
    ),
  dialogs: {
    deleteChat: false,
    chatDetail: false
  },
  setDialogs: (dialog: 'deleteChat' | 'chatDetail', to: boolean): void =>
    set(
      produce((state: IStore) => {
        state.dialogs[dialog] = to
      }),
      false,
      'ui/setDialogs'
    ),
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
