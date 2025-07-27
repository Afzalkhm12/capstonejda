"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// Impor tipe langsung dari paket utama, ini lebih stabil dan modern.
import { type ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

export default ThemeProvider