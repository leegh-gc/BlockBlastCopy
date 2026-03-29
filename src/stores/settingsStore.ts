import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark' | 'system'
export type AnimationSpeed = 'fast' | 'normal' | 'slow'

interface SettingsStore {
  isSoundEnabled: boolean
  isHapticEnabled: boolean
  theme: Theme
  animationSpeed: AnimationSpeed
  toggleSound: () => void
  toggleHaptic: () => void
  setTheme: (theme: Theme) => void
  setAnimationSpeed: (speed: AnimationSpeed) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      isSoundEnabled: true,
      isHapticEnabled: true,
      theme: 'system',
      animationSpeed: 'normal',
      toggleSound: () => set((s) => ({ isSoundEnabled: !s.isSoundEnabled })),
      toggleHaptic: () => set((s) => ({ isHapticEnabled: !s.isHapticEnabled })),
      setTheme: (theme) => set({ theme }),
      setAnimationSpeed: (animationSpeed) => set({ animationSpeed }),
    }),
    { name: 'block-blast-settings' }
  )
)
