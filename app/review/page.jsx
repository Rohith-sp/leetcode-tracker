'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ProblemList } from '@/components/ProblemList'
import { ArrowLeft, Filter } from 'lucide-react'

export default function ReviewPage() {
    const [problems, setProblems] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('soon') // 'soon', 'later', 'all'
    const [difficulty, setDifficulty] = useState('all') // 'all', 'Easy', 'Medium', 'Hard'
    const router = useRouter()

    useEffect(() => {
        const fetchProblems = async () => {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            let query = supabase
                .from('problems')
                .select('*')
                .order('last_reviewed_at', { ascending: true, nullsFirst: true })

            if (filter !== 'all') {
                query = query.eq('revisit_status', filter)
            }

            if (difficulty !== 'all') {
                query = query.eq('difficulty', difficulty)
            }

            // Add secondary sort by confidence for "soon" items
            if (filter === 'soon') {
                query = query.order('confidence_score', { ascending: true })
            }

            const { data, error } = await query

            if (error) {
                console.error("Supabase Error:", error)
                if (error.code === '42P01') {
                    alert("Database table not found! Please run the schema.sql in Supabase SQL Editor.")
                } else {
                    alert("Error loading problems: " + error.message)
                }
            } else {
                setProblems(data || [])
            }
            setLoading(false)
        }

        fetchProblems()
    }, [filter, difficulty, router])

    return (
        <div className="min-h-screen bg-background p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Review Session</h1>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center bg-card p-4 rounded-lg border shadow-sm">
                <div className="flex items-center gap-2 mr-4">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Filters:</span>
                </div>

                <div className="flex gap-2 p-1 bg-muted rounded-lg">
                    {['soon', 'later', 'all'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${filter === f ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            {f === 'soon' ? 'Due Soon' : f === 'later' ? 'Review Later' : 'All Problems'}
                        </button>
                    ))}
                </div>

                <div className="h-6 w-px bg-border mx-2" />

                <select
                    className="h-8 rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                >
                    <option value="all">Any Difficulty</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                </select>
            </div>

            {loading ? (
                <div className="space-y-3">
                    <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                    <div className="h-24 bg-muted/50 rounded-lg animate-pulse" />
                </div>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Found {problems.length} problems matching your criteria.</p>
                    <ProblemList
                        problems={problems}
                        emptyMessage={filter === 'soon' ? "You're all caught up! No problems due soon." : "No problems found."}
                    />
                </div>
            )}
        </div>
    )
}
