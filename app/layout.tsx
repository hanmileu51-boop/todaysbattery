import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Gaegu, Gowun_Dodum } from 'next/font/google'
import './globals.css'

const display = Gaegu({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-display',
})

const body = Gowun_Dodum({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: '오늘의 배터리 🔋 | 1분 힐링 처방',
  description:
    '지금 내 에너지는 몇 %? 배터리를 껴안은 고양이가 1분 맞춤 힐링 루틴을 처방해 드려요.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FDF3E7',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ko"
      className={`bg-background ${display.variable} ${body.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
