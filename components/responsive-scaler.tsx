'use client'

import { useEffect, useState } from 'react'

interface ResponsiveScalerProps {
  children: React.ReactNode
  minWidth?: number
}

export function ResponsiveScaler({
  children,
  minWidth = 800,
}: ResponsiveScalerProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function handleResize() {
      const currentWidth = window.innerWidth
      if (currentWidth < minWidth) {
        // Leave a slight margin (e.g., 95% of screen width)
        const newScale = Math.max(0.4, (currentWidth * 0.95) / minWidth)
        setScale(newScale)
      } else {
        setScale(1)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [minWidth])

  return (
    <div className="flex w-full justify-center overflow-x-hidden">
      <div
        className="w-full transition-transform duration-200 ease-out origin-top"
        style={{
          minWidth: scale < 1 ? `${minWidth}px` : 'auto',
          maxWidth: `${minWidth}px`,
          transform: scale < 1 ? `scale(${scale})` : 'none',
          marginBottom: scale < 1 ? `-${(1 - scale) * 100}%` : '0px',
        }}
      >
        {children}
      </div>
    </div>
  )
}
