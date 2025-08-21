import './globals.css'
import { Inter } from 'next/font/google'

// Use Inter font from Google fonts instead of Geist
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata = {
  title: 'Vancouver Free Events',
  description: 'Discover free events happening around Vancouver',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}