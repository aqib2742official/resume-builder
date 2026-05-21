import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter, Roboto, Playfair_Display } from 'next/font/google'
import { Providers } from './providers'
import { Navbar } from '@/components/shared/Navbar'
import { DarkModeApplier } from '@/components/shared/DarkModeApplier'
import { AnnouncementBanner } from '@/components/shared/AnnouncementBanner'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const roboto = Roboto({ variable: '--font-roboto', subsets: ['latin'], weight: ['400', '500', '700'] })
const playfair = Playfair_Display({ variable: '--font-playfair', subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Resume Builder — Professional Resume Creator',
  description: 'Build a beautiful, professional resume in minutes. Free online resume builder.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${roboto.variable} ${playfair.variable} h-full`}
    >
      <body className="h-full antialiased">
        <Providers>
          <DarkModeApplier />
          <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950">
            <AnnouncementBanner />
            <Navbar />
            <main className="flex-1 overflow-hidden min-w-0">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
