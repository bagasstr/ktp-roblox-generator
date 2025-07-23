import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'KTP Roblox Generator - Buat KTP Avatar Roblox Gratis',
  description:
    'Layanan pembuatan KTP (Kartu Tanda Penduduk) untuk avatar Roblox Anda. Desain profesional, mudah digunakan, dan gratis! Buat identitas unik untuk karakter Roblox Anda.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='id'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
