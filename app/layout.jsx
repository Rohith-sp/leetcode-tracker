import './globals.css'
import { Inter } from 'next/font/google'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'LeetCode Tracker',
    description: 'Personal problem tracking for developers',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen bg-background text-foreground antialiased flex flex-col">
                    <Navbar />
                    <main className="flex-1 w-full pb-16">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    )
}
