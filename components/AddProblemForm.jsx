'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Loader2 } from 'lucide-react'

const DIFFICULTIES = ['Easy', 'Medium', 'Hard']

export function AddProblemForm() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

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

        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            alert("You must be logged in.")
            return
        }

        const { error } = await supabase.from('problems').insert({
            user_id: user.id,
            leetcode_link: formData.leetcode_link,
            difficulty: formData.difficulty,
            topics: formData.topics,
            final_approach: formData.final_approach,
            mistake_or_confusion: formData.mistake_or_confusion,
            key_insight: formData.key_insight,
            confidence_score: formData.confidence_score,
            revisit_status: formData.revisit_status,
            // last_reviewed_at is intentionally null on creation
        })

        if (error) {
            alert('Error adding problem: ' + error.message)
        } else {
            router.push('/dashboard')
        }
        setLoading(false)
    }

    return (
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
                            type="url"
                            pattern="https://leetcode\.com/problems/.*"
                            placeholder="https://leetcode.com/problems/..."
                            value={formData.leetcode_link}
                            onChange={(e) => setFormData({ ...formData, leetcode_link: e.target.value })}
                            title="Please enter a valid LeetCode problem URL (https://leetcode.com/problems/...)"
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
                    <CardTitle>Remarks (Strictly Required)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Final Approach (How did you solve it?)</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            value={formData.final_approach}
                            onChange={(e) => setFormData({ ...formData, final_approach: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Mistake or Confusion (What tripped you up?)</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            value={formData.mistake_or_confusion}
                            onChange={(e) => setFormData({ ...formData, mistake_or_confusion: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <label className="text-sm font-medium">Key Insight (The 'Aha!' moment)</label>
                        <textarea
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            value={formData.key_insight}
                            onChange={(e) => setFormData({ ...formData, key_insight: e.target.value })}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center bg-muted/50 p-4">
                    <div className="text-sm text-muted-foreground">
                        Revisit Status: <span className="font-bold uppercase text-foreground">{formData.revisit_status}</span>
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Problem
                    </Button>
                </CardFooter>
            </Card>
        </form>
    )
}
