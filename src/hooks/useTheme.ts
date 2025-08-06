import { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '@/redux/theme/themeSlice'
import type { RootState } from '@/redux/store'

export function useTheme() {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.theme.theme)

  const setTheme = useCallback(
    (newTheme: 'light' | 'dark') => {
      if (newTheme !== theme) {
        dispatch(toggleTheme())
      }
    },
    [dispatch, theme]
  )

  const toggle = useCallback(() => {
    dispatch(toggleTheme())
  }, [dispatch])

  return {
    theme,
    setTheme,
    toggleTheme: toggle,
    isDark: theme === 'dark',
    isLight: theme === 'light',
  }
}
