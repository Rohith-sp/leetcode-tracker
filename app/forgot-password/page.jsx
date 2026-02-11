'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState(null)
    const router = useRouter()

    const handleResetRequest = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage(null)

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        })

        if (error) {
            setMessage({ type: 'error', text: error.message })
        } else {
            setMessage({
                type: 'success',
                text: 'Password reset link sent! Check your email inbox.'
            })
            setEmail('')
        }
        setLoading(false)
    }

    return (
        <div className="flex h-screen w-full items-center justify-center bg-muted/40 p-4">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">
                        Reset Password
                    </CardTitle>
                    <p className="text-sm text-muted-foreground text-center mt-2">
                        Enter your email and we'll send you a reset link
                    </p>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleResetRequest} className="grid gap-4">
                        <div className="grid gap-2">
                            <Input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        {message && (
                            <div className={`text-sm ${message.type === 'error' ? 'text-destructive' : 'text-accent'} text-center`}>
                                <p>{message.text}</p>
                            </div>
                        )}
                        <div className="flex flex-col gap-2">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </Button>
                            <Link href="/login" className="w-full">
                                <Button type="button" variant="outline" className="w-full">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Login
                                </Button>
                            </Link>
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
