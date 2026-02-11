'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { User, Lock, Save } from 'lucide-react'

export default function SettingsPage() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const [name, setName] = useState('')
    const [nameMessage, setNameMessage] = useState(null)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState(null)

    useEffect(() => {
        const checkUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/login')
                return
            }
            setUser(session.user)
            setName(session.user.user_metadata?.full_name || '')
        }
        checkUser()
    }, [router])

    const handleNameUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        setNameMessage(null)

        if (!name.trim()) {
            setNameMessage({ type: 'error', text: 'Name cannot be empty' })
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.updateUser({
            data: { full_name: name }
        })

        if (error) {
            setNameMessage({ type: 'error', text: error.message })
        } else {
            setNameMessage({ type: 'success', text: 'Name updated successfully!' })
        }
        setLoading(false)
    }

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()
        setLoading(true)
        setPasswordMessage(null)

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' })
            setLoading(false)
            return
        }

        if (newPassword.length < 6) {
            setPasswordMessage({ type: 'error', text: 'Password must be at least 6 characters' })
            setLoading(false)
            return
        }

        const { error } = await supabase.auth.updateUser({
            password: newPassword
        })

        if (error) {
            setPasswordMessage({ type: 'error', text: error.message })
        } else {
            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' })
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        }
        setLoading(false)
    }

    if (!user) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        )
    }

    return (
        <div className="container max-w-4xl mx-auto p-4 md:p-8 space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground mt-2">Manage your account settings and preferences</p>
            </div>

            <div className="grid gap-6">
                {/* Profile Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Profile Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleNameUpdate} className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Email</label>
                                <Input
                                    type="email"
                                    value={user.email}
                                    disabled
                                    className="bg-muted"
                                />
                                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Full Name</label>
                                <Input
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            {nameMessage && (
                                <div className={`text-sm ${nameMessage.type === 'error' ? 'text-destructive' : 'text-accent'}`}>
                                    <p>{nameMessage.text}</p>
                                </div>
                            )}
                            <Button type="submit" disabled={loading}>
                                <Save className="mr-2 h-4 w-4" />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Change Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handlePasswordUpdate} className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">New Password</label>
                                <Input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Confirm New Password</label>
                                <Input
                                    type="password"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>
                            {passwordMessage && (
                                <div className={`text-sm ${passwordMessage.type === 'error' ? 'text-destructive' : 'text-accent'}`}>
                                    <p>{passwordMessage.text}</p>
                                </div>
                            )}
                            <Button type="submit" disabled={loading}>
                                <Lock className="mr-2 h-4 w-4" />
                                {loading ? 'Updating...' : 'Update Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
