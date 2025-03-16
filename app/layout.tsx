import type { Metadata } from 'next'
import './globals.css'
export const metadata: Metadata = {
  title: 'Manglar Monitor',
  description: 'Created with React, Next.js, and TypeScript',
  generator: 'JhonZapataDev',
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
        <footer style={{
          textAlign: 'center',
          padding: '0.75rem',
          marginTop: 'auto',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.6)',
          backgroundColor: 'rgba(26, 32, 44, 0.3)',
          backdropFilter: 'blur(5px)',
          width: '100%',
          position: 'relative',
          bottom: 0
        }}>
          &copy; {new Date().getFullYear()} Manglar Monitor. Developed by JhonZapataDev. All rights reserved.
        </footer>
      </body>
    </html>
  )
}