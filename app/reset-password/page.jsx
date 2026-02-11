'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const [validToken, setValidToken] = useState(false)
    const router = useRouter()

    useEffect(() => {
        supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                setValidToken(true)
            }
        })
    }, [])

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        if (password !== confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match' })
            setLoading(false)
            return
        }

        if (password.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setMessage({ type: 'error', text: error.message })
            setLoading(false)
        } else {
            setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' })
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        }
    }

    if (!validToken) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center">
                            Invalid Reset Link
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                            This password reset link is invalid or has expired.
                        </p>
                        <p className="text-sm text-muted-foreground text-center mt-2">
                            Please request a new password reset link.
                        </p>
                        <Button
                            className="w-full mt-4"
                            onClick={() => router.push('/forgot-password')}
                        >
                            Request New Link
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Set New Password
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordUpdate} className="grid gap-4">
                        <div className="grid gap-2">
                            <Input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Input
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                        {message && (
                            <div className={`text-sm ${message.type === 'error' ? 'text-destructive' : 'text-accent'} text-center`}>
                                <p>{message.text}</p>
                            </div>
                        )}
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-muted-foreground">Dev Focus. No Distractions.</p>
                </CardFooter>
            </Card>
        </div>
    )
}
