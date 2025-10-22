"use client"

import * as React from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { ChevronDown, Monitor, Moon, Palette, Sun } from "lucide-react"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// Theme and Color controls moved into UI module as requested
export const PALETTES = [
  {
    id: 'violet',
    label: 'Violet',
    hue: 350,
    vars: {
      '--primary': 'hsl(270 90% 60%)',
      '--primary-foreground': 'hsl(0 0% 100%)',
      '--accent': 'hsl(270 95% 70%)',
      '--accent-foreground': 'hsl(0 0% 10%)',
      '--ring': 'hsl(270 90% 60%)',
    },
  },
  {
    id: 'emerald',
    label: 'Emerald',
    hue: 160,
    vars: {
      '--primary': 'oklch(0.7 0.16 160)',
      '--primary-foreground': 'oklch(0.205 0 0)',
      '--accent': 'oklch(0.74 0.13 160)',
      '--accent-foreground': 'oklch(0.205 0 0)',
      '--ring': 'oklch(0.7 0.16 160)',
    },
  },
  {
    id: 'rose',
    label: 'Rose',
    hue: 270,
    vars: {
      '--primary': 'hsl(350 85% 60%)',
      '--primary-foreground': 'hsl(0 0% 100%)',
      '--accent': 'hsl(350 92% 70%)',
      '--accent-foreground': 'hsl(0 0% 10%)',
      '--ring': 'hsl(350 85% 60%)',
    },
  },
  {
    id: 'amber',
    label: 'Amber',
    hue: 200,
    vars: {
      '--primary': 'hsl(45 95% 55%)',
      '--primary-foreground': 'hsl(0 0% 10%)',
      '--accent': 'hsl(45 100% 65%)',
      '--accent-foreground': 'hsl(0 0% 10%)',
      '--ring': 'hsl(45 95% 55%)',
    },
  },
  {
    id: 'sky',
    label: 'Sky',
    hue: 45,
    vars: {
      '--primary': 'hsl(200 90% 55%)',
      '--primary-foreground': 'hsl(0 0% 100%)',
      '--accent': 'hsl(200 95% 65%)',
      '--accent-foreground': 'hsl(0 0% 10%)',
      '--ring': 'hsl(200 90% 55%)',
    },
  },
] as const

export function applyPalette(vars: Record<string, string>) {
  const root = document.documentElement
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty(k, v))
}

export function ThemeDropdown() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const currentMode = (theme ?? 'system') as 'system' | 'light' | 'dark'
  const CurrentIcon = currentMode === 'system' ? Monitor : currentMode === 'dark' ? Moon : Sun

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="bg-transparent text-white border-white/15 hover:bg-white/10"
      >
        <CurrentIcon className="size-4 opacity-80" />
        <span className="hidden sm:inline">Theme</span>
        <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 rounded-xl border border-white/10 bg-black/70 backdrop-blur-md p-2 shadow-lg text-white"
        >
          <div className="flex flex-col p-1">
            {([
              { id: 'system' as const, label: 'System' },
              { id: 'light' as const, label: 'Light' },
              { id: 'dark' as const, label: 'Dark' },
            ]).map(({ id, label }) => (
              <button
                key={id}
                onClick={() => { setTheme(id); setOpen(false); try { localStorage.setItem('theme.mode', id) } catch {} }}
                className={`w-full text-left rounded-md px-2.5 py-1.5 text-xs transition-colors ${currentMode === id ? 'bg-white/10' : 'hover:bg-white/10'}`}
                role="menuitemradio"
                aria-checked={currentMode === id}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export function ColorDropdown() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const [currentPalette, setCurrentPalette] = useState<string>(() => {
    try { return localStorage.getItem('theme.palette') || 'violet' } catch { return 'violet' }
  })

  const paletteIndex = useMemo(() => Math.max(0, PALETTES.findIndex(p => p.id === currentPalette)), [currentPalette])
  const activePalette = PALETTES[paletteIndex] ?? PALETTES[0]

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    applyPalette(activePalette.vars)
    try { localStorage.setItem('theme.palette', activePalette.id) } catch {}
    try {
      document.documentElement.style.setProperty('--darkveil-hue', String(activePalette.hue))
      window.dispatchEvent(new CustomEvent('palettechange', { detail: { id: activePalette.id, hue: activePalette.hue } }))
    } catch {}
  }, [mounted, activePalette])

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="outline"
        size="sm"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        className="bg-transparent text-white border-white/15 hover:bg-white/10"
      >
        <Palette className="size-4 opacity-80" />
        <span className="hidden sm:inline">Color</span>
        <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-white/10 bg-black/70 backdrop-blur-md p-2 shadow-lg text-white"
        >
          <div className="flex flex-col p-1">
            {PALETTES.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setCurrentPalette(p.id)
                  try {
                    applyPalette(p.vars)
                    document.documentElement.style.setProperty('--darkveil-hue', String(p.hue))
                    window.dispatchEvent(new CustomEvent('palettechange', { detail: { id: p.id, hue: p.hue } }))
                    localStorage.setItem('theme.palette', p.id)
                  } catch {}
                  setOpen(false)
                }}
                className={`w-full flex items-center gap-2 rounded-md px-2.5 py-1.5 text-xs text-left transition-colors ${activePalette.id === p.id ? 'bg-white/10' : 'hover:bg-white/10'}`}
                role="menuitemradio"
                aria-checked={activePalette.id === p.id}
              >
                <span aria-hidden className="inline-block size-2 rounded-full" style={{ background: p.vars['--primary'] }} />
                <span>{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}