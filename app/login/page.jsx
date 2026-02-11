'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [isSignUp, setIsSignUp] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [resendCooldown, setResendCooldown] = useState(0)
    const router = useRouter()

    useEffect(() => {
        let timer
        if (resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((curr) => curr - 1)
            }, 1000)
        }
        return () => clearInterval(timer)
    }, [resendCooldown])

    const handleResend = async () => {
        if (resendCooldown > 0) return

        // Optimistic UI update
        setMessage({ type: 'success', text: 'Resending verification email...', showResend: true })
        setResendCooldown(60) // Start 60s cooldown

        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: email,
        })

        if (error) {
            setMessage({ type: 'error', text: `Failed to resend: ${error.message}`, showResend: true })
            setResendCooldown(0) // Reset if failed immediately
        } else {
            setMessage({ type: 'success', text: 'Verification email resent! Check your inbox.', showResend: true })
        }
    }

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (isSignUp) {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: name,
                    },
                },
            })
            if (error) {
                setMessage({ type: 'error', text: error.message })
            } else {
                setMessage({ type: 'success', text: 'Check your email for the confirmation link!' })
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })
            if (error) {
                // Check for specific error message regarding email confirmation
                const isEmailConfirmationError = error.message.toLowerCase().includes('email not confirmed')
                setMessage({
                    type: 'error',
                    text: error.message,
                    showResend: isEmailConfirmationError
                })
            } else {
                router.push('/dashboard')
            }
        }
        setLoading(false)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        {isSignUp ? 'Create Account' : 'Welcome Back'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="grid gap-4">
                        {isSignUp && (
                            <div className="grid gap-2">
                                <Input
                                    type="text"
                                    placeholder="Full Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                        )}
                        <div className="grid gap-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        {message && (
                            <div className={`text-sm ${message.type === 'error' ? 'text-destructive' : 'text-accent'} text-center`}>
                                <p>{message.text}</p>
                                {message.showResend && (
                                    <Button
                                        type="button"
                                        variant="link"
                                        size="sm"
                                        className="mt-1 h-auto p-0"
                                        onClick={handleResend}
                                        disabled={resendCooldown > 0}
                                    >
                                        {resendCooldown > 0
                                            ? `Resend available in ${resendCooldown}s`
                                            : "Resend Confirmation Email"}
                                    </Button>
                                )}
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                            </Button>
                            <div className="text-center text-sm text-muted-foreground mt-2">
                                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
                                <button
                                    type="button"
                                    className="underline text-primary hover:text-primary/80"
                                    onClick={() => {
                                        setIsSignUp(!isSignUp)
                                        setMessage(null)
                                        setResendCooldown(0)
                                    }}
                                >
                                    {isSignUp ? 'Sign In' : 'Sign Up'}
                                </button>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">Dev Focus. No Distractions.</p>
                </CardFooter>
            </Card>
        </div>
    )
}
