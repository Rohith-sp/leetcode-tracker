'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { ProblemList } from '@/components/ProblemList'
import { LogOut, Plus } from 'lucide-react'

export default function Dashboard() {
    const [problems, setProblems] = useState([])
    const [stats, setStats] = useState({ total: 0, easy: 0, medium: 0, hard: 0, dueSoon: 0 })
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            // Fetch ALL problems (not just "Due Soon")
            const { data: allProblems } = await supabase
                .from('problems')
                .select('*')
                .order('created_at', { ascending: false })

            setProblems(allProblems || [])

            // Fetch stats (safe handling)
            const getCount = async (query) => {
                const { count, error } = await query
                if (error) {
                    console.error("Stats Error:", error)
                    if (error.code === '42P01') {
                        // Only alert once
                        if (!window.hasAlertedTable) {
                            alert("Database table not found! Please run the schema.sql.")
                            window.hasAlertedTable = true
                        }
                    }
                    return 0
                }
                return count
            }

            const total = await getCount(supabase.from('problems').select('*', { count: 'exact', head: true }))
            const easy = await getCount(supabase.from('problems').select('*', { count: 'exact', head: true }).eq('difficulty', 'Easy'))
            const medium = await getCount(supabase.from('problems').select('*', { count: 'exact', head: true }).eq('difficulty', 'Medium'))
            const hard = await getCount(supabase.from('problems').select('*', { count: 'exact', head: true }).eq('difficulty', 'Hard'))
            const dueSoon = await getCount(supabase.from('problems').select('*', { count: 'exact', head: true }).eq('revisit_status', 'soon'))

            setStats({
                total: total || 0,
                easy: easy || 0,
                medium: medium || 0,
                hard: hard || 0,
                dueSoon: dueSoon || 0
            })

            setLoading(false)
        }

        fetchData()
    }, [router])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-background p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back. Let's keep the streak alive.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Link href="/add">
                        <Button className="gap-2">
                            <Plus className="h-4 w-4" /> Add Problem
                        </Button>
                    </Link>
                </div>
            </header>

            {/* Dashboard Grid - Better rhythm */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-surface-1 border border-border rounded-lg p-6 hover:bg-surface-2 hover:border-border-strong transition-all duration-200 group">
                    <div className="text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-3">
                        Total Solved
                    </div>
                    <div className="text-3xl font-bold text-foreground tracking-tight mb-1">
                        {stats.total}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="text-green-500 font-medium">Keep it up!</span>
                    </div>
                </div>

                <div className="bg-surface-1 border border-border rounded-lg p-6 hover:bg-surface-2 hover:border-border-strong transition-all duration-200 group">
                    <div className="text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-3">
                        Due for Review
                    </div>
                    <div className={`text-3xl font-bold tracking-tight mb-1 ${stats.dueSoon > 0 ? 'text-destructive' : 'text-foreground'}`}>
                        {stats.dueSoon}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {stats.dueSoon > 0 ? 'Needs attention now' : 'All caught up'}
                    </div>
                </div>

                <div className="bg-surface-1 border border-border rounded-lg p-6 hover:bg-surface-2 hover:border-border-strong transition-all duration-200 group md:col-span-2">
                    <div className="text-xs font-medium text-secondary-foreground uppercase tracking-wider mb-3">
                        Mastery Breakdown
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-green-600">{stats.easy}</div>
                            <div className="text-xs text-muted-foreground font-medium">Easy</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
                            <div className="text-xs text-muted-foreground font-medium">Medium</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-red-600">{stats.hard}</div>
                            <div className="text-xs text-muted-foreground font-medium">Hard</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content + Sidebar Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-foreground tracking-tight">
                            Up Next for Review
                        </h2>
                        <Link href="/review">
                            <Button variant="ghost" size="sm" className="h-8">
                                View All &rarr;
                            </Button>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="animate-pulse bg-surface-1 border border-border rounded-lg h-24" />
                            ))}
                        </div>
                    ) : (
                        <ProblemList problems={problems} emptyMessage="No problems due for review! Great job." />
                    )}
                </div>

                {/* Sidebar (Quick Actions / Motivation) */}
                <div className="space-y-6">
                    <Card variant="elevated" className="p-6">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Quick Actions</h3>
                        <div className="space-y-2">
                            <Link href="/add" className="block">
                                <Button className="w-full justify-start" variant="outline">
                                    <Plus className="mr-2 h-4 w-4" /> Add New Problem
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card variant="subtle" className="p-6">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Did you know?</h3>
                        <p className="text-sm text-muted-foreground">
                            Spacing your reviews over time is 2x more effective than cramming. You're building long-term memory.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    )
}
