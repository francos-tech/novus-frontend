import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem('theme')
      
      // Determine initial theme
      let shouldBeDark = false
      if (saved === 'dark') {
        shouldBeDark = true
      } else if (saved === 'light') {
        shouldBeDark = false
      } else {
        // No saved preference, check system preference
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        shouldBeDark = systemPrefersDark
        // Save the detected preference
        localStorage.setItem('theme', shouldBeDark ? 'dark' : 'light')
      }
      
      setIsDarkMode(shouldBeDark)
      setIsInitialized(true)
      
      // Apply theme to document root
      if (shouldBeDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (error) {
      console.error('Error initializing theme:', error)
      setIsInitialized(true)
    }
  }, [])

  const toggleTheme = () => {
    if (typeof window === 'undefined') return
    
    try {
      const newTheme = !isDarkMode
      
      setIsDarkMode(newTheme)
      localStorage.setItem('theme', newTheme ? 'dark' : 'light')
      
      // Apply theme to document root
      if (newTheme) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (error) {
      console.error('Error toggling theme:', error)
    }
  }

  const setTheme = (theme: 'light' | 'dark') => {
    if (typeof window === 'undefined') return
    
    const isDark = theme === 'dark'
    setIsDarkMode(isDark)
    localStorage.setItem('theme', theme)
    
    // Apply theme to document root
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDarkMode,
    isInitialized,
    toggleTheme,
    setTheme
  }
} 