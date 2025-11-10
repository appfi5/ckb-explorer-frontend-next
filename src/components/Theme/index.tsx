"use client"
import { isClient } from "@/utils/tool"
import Cookies from "js-cookie"
import { createContext, useContext, useEffect, useState, type Dispatch, type PropsWithChildren, type SetStateAction } from "react"


export const themes = ["light", "dark"] as const

export type Theme = (typeof themes)[number]

export const ThemeContext = createContext<[Theme, () => void]>([themes[0], () => { }])
export function ThemeProvider({ initTheme, children }: PropsWithChildren<{ initTheme: Theme }>) {
  const [theme, setTheme] = useState<Theme>(initTheme)

  useEffect(() => {
    if (!isClient) return
    document.documentElement.setAttribute("data-theme", theme)
    Cookies.set("NEXT_THEME", theme)
  }, [theme])
  
  return <ThemeContext value={[theme, () => {
    setTheme(prev => prev === "light" ? "dark" : "light")
  }]}>
    {children}
  </ThemeContext>
}

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeSwitcher() {
  const [theme, toggleTheme] = useTheme()
  return (
    <div>
      <button className="text-white" onClick={toggleTheme}>
        {theme === "light" ? "to Dark" : "to Light"}
      </button>
    </div>
  )
}