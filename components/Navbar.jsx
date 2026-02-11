'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'
import { LogOut, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    // Check auth state on mount
    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user || null)
        }

        checkUser()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)
        })

        return () => subscription.unsubscribe()
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const navLinks = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/add', label: 'Add Problem' },
        { href: '/review', label: 'Review' },
        { href: '/about', label: 'About' },
    ]

    // Don't show navbar on login page
    if (pathname === '/login') return null

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 md:px-8 max-w-7xl mx-auto">
                <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
                    <Image
                        src="/logo.png"
                        alt="LeetCode Tracker"
                        width={32}
                        height={32}
                        className="h-8 w-auto"
                    />
                    <span className="font-bold hidden sm:inline-block">LeetTracker</span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
                    <div className="flex gap-6 text-sm font-medium">
                        {user && navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`transition-colors hover:text-foreground/80 ${pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        {user && (
                            <span className="text-sm text-muted-foreground hidden lg:inline-block">
                                Hello, {user.user_metadata?.full_name || user.email?.split('@')[0]}
                            </span>
                        )}
                        {user ? (
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        ) : (
                            <Link href="/login">
                                <Button size="sm">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className="ml-auto md:hidden p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
            </div>

            {/* Mobile Nav */}
            {isMenuOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    {user && navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className={`block text-sm font-medium transition-colors ${pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                                }`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="pt-4 border-t">
                        {user ? (
                            <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" />
                                Logout
                            </Button>
                        ) : (
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button size="sm" className="w-full">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
