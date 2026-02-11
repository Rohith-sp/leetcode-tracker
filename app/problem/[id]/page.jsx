'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { ArrowLeft, ExternalLink, Calendar, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ProblemDetails({ params }) {
    const { id } = params
    const [problem, setProblem] = useState(null)
    const [loading, setLoading] = useState(true)
    const [reviewing, setReviewing] = useState(false)
    const [newConfidence, setNewConfidence] = useState(3)
    const router = useRouter()

    useEffect(() => {
        const fetchProblem = async () => {
            const { data, error } = await supabase
                .from('problems')
                .select('*')
                .eq('id', id)
                .single()

            if (error) {
                console.error(error)
                router.push('/dashboard')
            } else {
                setProblem(data)
                setNewConfidence(data.confidence_score)
            }
            setLoading(false)
        }
        fetchProblem()
    }, [id, router])

    const handleReview = async () => {
        // Logic: 
        // 1. Calculate new revisit_status based on newConfidence
        // 2. Increment review_count
        // 3. Update last_reviewed_at

        let status = 'soon'
        if (newConfidence <= 2) status = 'soon'
        else if (newConfidence === 3) status = 'later'
        else if (newConfidence >= 4) status = 'no'

        const { error } = await supabase
            .from('problems')
            .update({
                confidence_score: newConfidence,
                revisit_status: status,
                review_count: problem.review_count + 1,
                last_reviewed_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) {
            alert('Failed to update review: ' + error.message)
        } else {
            setReviewing(false)
            // Refresh local data
            const { data } = await supabase.from('problems').select('*').eq('id', id).single()
            setProblem(data)
        }
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>
    if (!problem) return <div className="p-10 text-center">Problem not found</div>

    return (
        <div className="min-h-screen bg-background p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-xl font-bold truncate max-w-md">{problem.leetcode_link.replace('https://leetcode.com/problems/', '')}</h1>
                    <Badge variant={problem.difficulty.toLowerCase()}>{problem.difficulty}</Badge>
                </div>
                <a href={problem.leetcode_link} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-2">
                        Open LeetCode <ExternalLink className="h-3 w-3" />
                    </Button>
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Core Remarks</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Final Approach</h3>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{problem.final_approach}</p>
                            </div>
                            <div className="h-px bg-border" />
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Mistake / Confusion</h3>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-red-600/80 dark:text-red-400/80">{problem.mistake_or_confusion}</p>
                            </div>
                            <div className="h-px bg-border" />
                            <div>
                                <h3 className="text-sm font-semibold text-muted-foreground mb-1">Key Insight</h3>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-blue-600/80 dark:text-blue-400/80">{problem.key_insight}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar stats */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Review Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Confidence</span>
                                <span className="font-bold">{problem.confidence_score}/5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Recall Status</span>
                                <Badge variant="outline" className={cn(
                                    "capitalize",
                                    problem.revisit_status === 'soon' && "border-red-500 text-red-500",
                                    problem.revisit_status === 'later' && "border-yellow-500 text-yellow-500",
                                    problem.revisit_status === 'no' && "border-green-500 text-green-500"
                                )}>
                                    {problem.revisit_status}
                                </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Reviews</span>
                                <span className="font-bold">{problem.review_count}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm">Last Reviewed</span>
                                <span className="text-xs text-muted-foreground">
                                    {problem.last_reviewed_at ? new Date(problem.last_reviewed_at).toLocaleDateString() : 'Never'}
                                </span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex-col gap-2">
                            {!reviewing ? (
                                <Button className="w-full gap-2" onClick={() => setReviewing(true)}>
                                    <CheckCircle className="h-4 w-4" /> Mark as Reviewed
                                </Button>
                            ) : (
                                <div className="w-full space-y-3 bg-muted/50 p-3 rounded-md">
                                    <label className="text-xs font-semibold block">Update Confidence:</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(score => (
                                            <button
                                                key={score}
                                                onClick={() => setNewConfidence(score)}
                                                className={cn(
                                                    "flex-1 h-8 rounded text-xs font-medium transition-all",
                                                    newConfidence === score
                                                        ? "bg-primary text-primary-foreground shadow-sm"
                                                        : "bg-background border hover:bg-accent"
                                                )}
                                            >
                                                {score}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" className="w-full" onClick={handleReview}>Confirm</Button>
                                        <Button size="sm" variant="ghost" className="w-full" onClick={() => setReviewing(false)}>Cancel</Button>
                                    </div>
                                </div>
                            )}
                        </CardFooter>
                    </Card>

                    <div className="flex flex-wrap gap-2">
                        {problem.topics.map(t => (
                            <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
