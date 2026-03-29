import { useEffect } from 'react'
import { useSettingsStore } from '../stores/settingsStore'

/**
 * settingsStore의 theme을 구독하여 document.documentElement에 'dark' 클래스를 제어한다.
 * App.tsx 루트 레벨에서 한 번만 호출한다.
 */
export function useTheme() {
  const theme = useSettingsStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement

    const applyDark = (isDark: boolean) => {
      if (isDark) root.classList.add('dark')
      else root.classList.remove('dark')
    }

    if (theme === 'dark') {
      applyDark(true)
      return
    }
    if (theme === 'light') {
      applyDark(false)
      return
    }

    // 'system': 시스템 설정 감지 + 변경 이벤트 리스너
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    applyDark(mq.matches)
    const handler = (e: MediaQueryListEvent) => applyDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])
}
