import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsStore {
  isSoundEnabled: boolean
  isHapticEnabled: boolean
  toggleSound: () => void
  toggleHaptic: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      isSoundEnabled: true,
      isHapticEnabled: true,
      toggleSound: () => set((s) => ({ isSoundEnabled: !s.isSoundEnabled })),
      toggleHaptic: () => set((s) => ({ isHapticEnabled: !s.isHapticEnabled })),
    }),
    { name: 'block-blast-settings' }
  )
)
