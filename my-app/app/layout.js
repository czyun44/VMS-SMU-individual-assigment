import { NavBar } from '@/components/Navbar'
import './globals.css'
import { Inter } from 'next/font/google'
import { EthersProviders } from '@/context/provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'VMS',
  description: 'Voting Management System',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center">
        <EthersProviders>
          <NavBar />
          {children}
        </EthersProviders>
      </body>
    </html>
  )
}
