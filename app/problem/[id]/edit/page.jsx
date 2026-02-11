'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export default function EditProblemPage({ params }) {
    const { id } = params
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    const [formData, setFormData] = useState({
        leetcode_link: '',
        difficulty: 'Medium',
        topics: [],
        final_approach: '',
        mistake_or_confusion: '',
        key_insight: '',
        confidence_score: 3,
        revisit_status: 'later',
    })

    const [topicInput, setTopicInput] = useState('')

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
                setFormData({
                    leetcode_link: data.leetcode_link,
                    difficulty: data.difficulty,
                    topics: data.topics,
                    final_approach: data.final_approach,
                    mistake_or_confusion: data.mistake_or_confusion,
                    key_insight: data.key_insight,
                    confidence_score: data.confidence_score,
                    revisit_status: data.revisit_status,
                })
            }
            setLoading(false)
        }
        fetchProblem()
    }, [id, router])

    const handleTopicAdd = (e) => {
        if (e.key === 'Enter' && topicInput.trim()) {
            e.preventDefault()
            if (!formData.topics.includes(topicInput.trim())) {
                setFormData(prev => ({ ...prev, topics: [...prev.topics, topicInput.trim()] }))
            }
            setTopicInput('')
        }
    }

    const removeTopic = (topic) => {
        setFormData(prev => ({ ...prev, topics: prev.topics.filter(t => t !== topic) }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.topics.length === 0) {
            alert('Please add at least one topic.')
            return
        }

        setSaving(true)

        const { error } = await supabase.from('problems').update({
            leetcode_link: formData.leetcode_link,
            difficulty: formData.difficulty,
            topics: formData.topics,
            final_approach: formData.final_approach,
            mistake_or_confusion: formData.mistake_or_confusion,
            key_insight: formData.key_insight,
            confidence_score: formData.confidence_score,
            revisit_status: formData.revisit_status,
        }).eq('id', id)

        if (error) {
            alert('Error updating problem: ' + error.message)
        } else {
            router.push(`/problem/${id}`)
        }
        setSaving(false)
    }

    if (loading) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="min-h-screen bg-background p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link href={`/problem/${id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Problem</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Problem Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">LeetCode Link</label>
                            <Input
                                required
                                placeholder="https://leetcode.com/problems/..."
                                value={formData.leetcode_link}
                                onChange={(e) => setFormData({ ...formData, leetcode_link: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Difficulty</label>
                                <div className="flex gap-2">
                                    {DIFFICULTIES.map(diff => (
                                        <Button
                                            key={diff}
                                            type="button"
                                            variant={formData.difficulty === diff ? "default" : "outline"}
                                            onClick={() => setFormData({ ...formData, difficulty: diff })}
                                            className="flex-1"
                                        >
                                            {diff}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Confidence (1-5)</label>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map(score => (
                                        <Button
                                            key={score}
                                            type="button"
                                            variant={formData.confidence_score === score ? "default" : "outline"}
                                            onClick={() => setFormData({ ...formData, confidence_score: score })}
                                            className="flex-1"
                                        >
                                            {score}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Revisit Status</label>
                            <div className="flex gap-2">
                                {['soon', 'later', 'no'].map(status => (
                                    <Button
                                        key={status}
                                        type="button"
                                        variant={formData.revisit_status === status ? "default" : "outline"}
                                        onClick={() => setFormData({ ...formData, revisit_status: status })}
                                        className="flex-1 capitalize"
                                    >
                                        {status}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Topics (Press Enter to add)</label>
                            <Input
                                placeholder="e.g. DFS, Array, Two Pointers"
                                value={topicInput}
                                onChange={(e) => setTopicInput(e.target.value)}
                                onKeyDown={handleTopicAdd}
                            />
                            <div className="flex flex-wrap gap-2 mt-2">
                                {formData.topics.map(topic => (
                                    <Badge key={topic} variant="secondary" className="cursor-pointer hover:bg-destructive/10" onClick={() => removeTopic(topic)}>
                                        {topic} &times;
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Remarks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Final Approach</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                value={formData.final_approach}
                                onChange={(e) => setFormData({ ...formData, final_approach: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Mistake or Confusion</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                value={formData.mistake_or_confusion}
                                onChange={(e) => setFormData({ ...formData, mistake_or_confusion: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <label className="text-sm font-medium">Key Insight</label>
                            <textarea
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                value={formData.key_insight}
                                onChange={(e) => setFormData({ ...formData, key_insight: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Link href={`/problem/${id}`}>
                            <Button type="button" variant="ghost">Cancel</Button>
                        </Link>
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}
